"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import defaultStorage from "./index";
import { IStorage, StorageOptions } from "./types";

/**
 * React Hooks for Storage System
 */

/**
 * useStorage - 同步存储数据到组件状态
 * @param key - 存储键
 * @param initialValue - 初始值
 * @param storage - 存储实例（可选，默认使用 defaultStorage）
 */
export function useStorage<T>(
  key: string,
  initialValue: T,
  storage = defaultStorage
) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载初始值
  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await storage.get<T>(key);
        if (stored !== null) {
          setValue(stored);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, storage]);

  // 设置值并同步到存储
  const setValueAndSync = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      try {
        const actualValue =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(actualValue);
        await storage.set(key, actualValue);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [key, value, storage]
  );

  // 删除存储值
  const removeValue = useCallback(async () => {
    try {
      setValue(initialValue);
      await storage.remove(key);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [key, initialValue, storage]);

  return [
    value,
    setValueAndSync,
    { loading, error, remove: removeValue },
  ] as const;
}

/**
 * useSessionStorage - 使用 SessionStorage
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storage] = useState(() =>
    require("./StorageFactory").StorageFactory.create({
      type: require("./types").StorageType.SESSION,
    })
  );

  return useStorage(key, initialValue, storage);
}

/**
 * useLocalStorage - 使用 LocalStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storage] = useState(() =>
    require("./StorageFactory").StorageFactory.create({
      type: require("./types").StorageType.LOCAL,
    })
  );

  return useStorage(key, initialValue, storage);
}

/**
 * useAsync - 执行异步操作并缓存结果
 * @param asyncFunction - 异步函数
 * @param immediate - 是否立即执行
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus("pending");
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus("success");
      return response;
    } catch (error) {
      setError(error as E);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

/**
 * useCachedAsync - 执行异步操作并缓存到存储
 * @param key - 缓存键
 * @param asyncFunction - 异步函数
 * @param options - 缓存选项
 */
export function useCachedAsync<T>(
  key: string,
  asyncFunction: () => Promise<T>,
  options: StorageOptions & { skipCache?: boolean } = {}
) {
  const [value, setValue, { loading: storageLoading, error: storageError }] =
    useStorage<T | null>(key, null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    // 如果有缓存且不跳过，直接返回
    if (value !== null && !options.skipCache) {
      return value;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      await setValue(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, value, options, setValue]);

  useEffect(() => {
    // 在挂载时自动执行
    if (value === null && !storageLoading && !options.skipCache) {
      execute();
    }
  }, [execute, value, storageLoading, options]);

  return {
    data: value,
    loading: loading || storageLoading,
    error: error || storageError,
    refetch: execute,
  };
}

/**
 * useStorageSync - 监听多个存储值
 */
export function useStorageSync<T extends Record<string, any>>(
  initialValues: T,
  storage = defaultStorage
) {
  const [values, setValues] = useState<T>(initialValues);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValues = async () => {
      try {
        const keys = Object.keys(initialValues);
        const results = await Promise.all(keys.map((key) => storage.get(key)));

        const newValues = { ...initialValues };
        keys.forEach((key, index) => {
          if (results[index] !== null) {
            (newValues as any)[key] = results[index];
          }
        });

        setValues(newValues);
      } finally {
        setLoading(false);
      }
    };

    loadValues();
  }, [initialValues, storage]);

  const setValueAndSync = useCallback(
    async (key: keyof T, value: T[typeof key]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      await storage.set(String(key), value);
    },
    [storage]
  );

  return [values, setValueAndSync, { loading }] as const;
}

/**
 * useDebounceStorage - 防抖存储更新
 */
export function useDebounceStorage<T>(
  key: string,
  initialValue: T,
  delay = 500,
  storage = defaultStorage
) {
  const [value, setValue] = useState<T>(initialValue);
  const [savedValue, setSavedValue, { loading }] = useStorage(
    key,
    initialValue,
    storage
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      storage.set(key, value);
      setSavedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, key, storage, setSavedValue]);

  return [value, setValue, { savedValue, loading }] as const;
}

/**
 * useThrottle - 节流函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
) {
  const lastRunRef = useRef(null);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      if (
        (lastRunRef as any).current === null ||
        now - (lastRunRef as any).current >= delay
      ) {
        func(...args);
        (lastRunRef as any).current = now;
      }
    }) as T,
    [func, delay, lastRunRef]
  );
}
