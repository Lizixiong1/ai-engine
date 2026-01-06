import { useEffect, useRef, useState } from "react";
import { shallow } from "./util";
type CreateState<T = any> = (
  set: (newState: T | ((v: T) => T)) => void,
  get: () => T
) => any;
const createStoreImpl = <State>(createState: any) => {
  let state: State;
  const listeners = new Set<(state: any, preState: any) => void>();

  const setState = (partial: (arg0: any) => any, replace?: boolean) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      // 浅比较
      const previousState = state;
      state = (replace != undefined ? replace : typeof nextState !== "object")
        ? nextState
        : Object.assign({}, state, nextState);

      console.log(listeners);

      listeners.forEach((listener) => listener(state, previousState)); // 触发观察者事件，
    }
  };
  const getState = () => state;
  const subscribe = (listener: any) => {
    // 将事件推入listeners
    // 对外提供取消监听方法
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const destroy = () => {
    // 清除所有event
    listeners.clear();
  };
  const api = { setState, getState, subscribe, destroy }; // api对象提供给外部
  state = createState(setState, getState, api);
  return api;
};

const create = <T>(createState: CreateState<T>) => {
  const api = createStoreImpl(createState);

  function useStore(selector = api.getState) {
    const [, forceRender] = useState(0);

    const latestSelector = useRef(selector);
    const latestSelectedState = useRef<any>();

    // 渲染阶段计算当前值
    let selectedState;

    const newSelection = selector();

    if (typeof newSelection === "function") {
      // 🔥 关键优化：对函数类型使用稳定化
      if (
        latestSelectedState.current &&
        typeof latestSelectedState.current === "function" &&
        newSelection.toString() === latestSelectedState.current.toString()
      ) {
        // 函数体相同，保持原引用
        selectedState = latestSelectedState.current;
      } else {
        selectedState = newSelection;
      }
    } else {
      // 非函数类型使用浅比较
      if (
        latestSelectedState.current &&
        shallow(latestSelectedState.current, newSelection)
      ) {
        selectedState = latestSelectedState.current;
      } else {
        selectedState = newSelection;
      }
    }

    useEffect(() => {
      console.log("挂载");

      latestSelector.current = selector;
      latestSelectedState.current = selectedState;

      const checkForUpdates = () => {
        const newSelection = latestSelector.current();

        // 对函数类型特殊比较
        debugger
        let hasChanged;
        if (typeof newSelection === "function") {
          hasChanged = latestSelectedState.current !== newSelection;
        } else {
          hasChanged = !shallow(latestSelectedState.current, newSelection);
        }

        if (hasChanged) {
          latestSelectedState.current = newSelection;
          forceRender(Math.random());
        }
      };

      const unsubscribe = api.subscribe(checkForUpdates);
      return unsubscribe;
    }, []);

    return selectedState;
  }

  return useStore;
};
export { create };
