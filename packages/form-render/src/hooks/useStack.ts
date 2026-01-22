import { useState, useCallback, useRef } from 'react';

export interface UseStackOptions<T> {
  maxSize?: number;
  initialValue?: T;
}

export interface UseStackReturn<T> {
  current: T;
  history: T[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  save: (state: T) => void;
  clear: () => void;
}

export default function useStack<T>(options: UseStackOptions<T> = {}): UseStackReturn<T> {
  const { maxSize = 100, initialValue } = options;

  // 初始化历史记录栈和当前索引
  const [history, setHistory] = useState<T[]>(initialValue !== undefined ? [initialValue] : []);
  const [currentIndex, setCurrentIndex] = useState<number>(initialValue !== undefined ? 0 : -1);

  // 计算当前状态
  const current = history[currentIndex] as T;

  // 计算是否可以撤销和重做
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // 实现撤销操作
  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [canUndo]);

  // 实现重做操作
  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canRedo]);

  // 实现保存状态操作
  const save = useCallback((state: T) => {
    // 如果当前索引不是最后一个，截断历史记录
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push(state);
      
      // 确保不超过最大大小限制
      if (newHistory.length > maxSize) {
        newHistory.shift();
      }
      
      return newHistory;
    });
    
    // 更新当前索引到新的最后一个位置
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      return newIndex >= maxSize ? maxSize - 1 : newIndex;
    });
  }, [currentIndex, maxSize]);

  // 实现清空历史记录操作
  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    current,
    history,
    currentIndex,
    canUndo,
    canRedo,
    undo,
    redo,
    save,
    clear,
  };
}

