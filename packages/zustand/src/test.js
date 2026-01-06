import { useEffect, useRef, useState } from "react";

const shallow = (a, b) => {
  if (!a || typeof a !== "object" || !b || typeof b !== "object") {
    // 必须是对象类型
    return false;
  }
  if (Object.is(a, b)) {
    return true;
  }
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i];

    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }

    if (!Object.is(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

const createImpl = (createState) => {
  let state;

  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;
      state =
        replace ?? (typeof nextState !== "object" || !nextState)
          ? nextState
          : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    if (!listeners.has(listener)) {
      listeners.add(listener);
    }
    return () => {
      listeners.delete(listener);
    };
  };

  const destroy = () => {
    listeners.clear();
  };

  const getInitialState = () => initialState;

  const api = { setState, getState, getInitialState, subscribe, destroy };

  const initialState = (state = createState(setState, getState, api));
  return api;
};

/**
 * createState ->    (set,get,api) => ({ a: a,update: (state) => state.a + 1 })
 *
 *
 */
const create = (createState) => {
  const api = createImpl(createState);

  function useStore(selector = api.getState) {
    const [_, forceRender] = useState({});

    const lastState = useRef();
    const lastSelector = useRef(selector);

    let selectedState;
    const newState = lastSelector.current();

    if (!shallow(newState, lastState.current)) {
      selectedState = newState;
    } else {
      selectedState = lastState.current;
    }

    useEffect(() => {
      lastSelector.current = selector;
      lastState.current = selectedState;
      const checkFnUpdate = () => {
        const newState = lastSelector.current();

        if (!shallow(newState, lastState.current)) {
          lastState.current = newState;
          forceRender({});
        }
      };

      const unsubscribe = api.subscribe(checkFnUpdate);

      return unsubscribe;
    }, []);

    return selectedState;
  }

  return useStore;
};

export default create;
