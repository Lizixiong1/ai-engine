import { useEffect, useRef, useState } from "react";
import { shallow } from "./util";
export { persist } from "./middleware";

export type Listener<T> = (state: T, preState: T) => void;
export type Set<T> = (newState: T | ((v: T) => T), replace?: boolean) => void;
export type Get<T> = () => T;
export type Subscribe<T> = (listener: Listener<T>) => () => void;
export interface API<T> {
  setState: Set<T>;
  getState: Get<T>;
  subscribe: Subscribe<T>;
}
export type CreateState<T, A extends API<T> = API<T>> = (
  set: Set<T>,
  get: Get<T>,
  api: A
) => T;
type ExtractAPI<C> = C extends CreateState<any, infer A> ? A : never;

type ExtractState<C> = C extends CreateState<infer T, any> ? T : never;

export const createStore = <C extends CreateState<any, any>>(
  createState: C
) => {
  type T = ExtractState<C>;
  type A = ExtractAPI<C>;
  let state: T;
  const listeners = new Set<Listener<T>>();

  const setState: Set<T> = (partial, replace) => {
    const nextState =
      typeof partial === "function" ? (partial as (v: T) => T)(state) : partial;
    if (!Object.is(nextState, state)) {
      // 浅比较
      const previousState = state;
      state = (replace != undefined ? replace : typeof nextState !== "object")
        ? nextState
        : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState)); // 触发观察者事件，
    }
  };
  const getState: Get<T> = () => state;
  const subscribe: Subscribe<T> = (listener: Listener<T>) => {
    // 将事件推入listeners
    // 对外提供取消监听方法
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const api = { setState, getState, subscribe } as A; // api对象提供给外部
  state = createState(setState, getState, api);
  return api;
};

export const create = <T>(createState: CreateState<T>) => {
  const api = createStore(createState);

  function useStore(selector = api.getState) {
    const [, forceRender] = useState(0);

    const latestSelector = useRef(selector);
    const latestSelectedState = useRef<T>();

    // 渲染阶段计算当前值
    let selectedState;

    const newSelection = selector();

    if (
      latestSelectedState.current &&
      shallow(latestSelectedState.current, newSelection)
    ) {
      selectedState = latestSelectedState.current;
    } else {
      selectedState = newSelection;
    }

    useEffect(() => {
      console.log("挂载");

      latestSelector.current = selector;
      latestSelectedState.current = selectedState;

      const checkForUpdates = () => {
        const newSelection = latestSelector.current();

        // 对函数类型特殊比较
        debugger;
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
