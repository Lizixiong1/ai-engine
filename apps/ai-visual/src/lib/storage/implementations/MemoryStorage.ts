import { IStorage, StorageOptions } from '../types';

/**
 * 内存存储实现
 * 用于测试和临时存储，关闭浏览器后数据会丢失
 */
export class MemoryStorage implements IStorage {
  private store: Map<string, { value: any; expiresAt?: number }> = new Map();
  private readonly prefix: string;

  constructor(prefix: string = 'memory_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const storageKey = this.getKey(key);
      const item = this.store.get(storageKey);

      if (!item) return null;

      // 检查是否过期
      if (item.expiresAt && item.expiresAt < Date.now()) {
        await this.remove(key);
        return null;
      }

      return item.value as T;
    } catch (error) {
      console.error(`[MemoryStorage] Failed to get key "${key}":`, error);
      return null;
    }
  }

  async set<T = any>(
    key: string,
    value: T,
    options?: StorageOptions
  ): Promise<void> {
    try {
      const storageKey = this.getKey(key);

      this.store.set(storageKey, {
        value,
        expiresAt: options?.expiresIn
          ? Date.now() + options.expiresIn
          : undefined
      });
    } catch (error) {
      console.error(`[MemoryStorage] Failed to set key "${key}":`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const storageKey = this.getKey(key);
      this.store.delete(storageKey);
    } catch (error) {
      console.error(`[MemoryStorage] Failed to remove key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToDelete: string[] = [];
      this.store.forEach((_, key) => {
        if (key.startsWith(this.prefix)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.store.delete(key));
    } catch (error) {
      console.error('[MemoryStorage] Failed to clear:', error);
    }
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
