import { IStorage, StorageOptions } from '../types';

/**
 * 本地存储实现（LocalStorage）
 * 用于持久化存储，即使关闭浏览器也会保留
 */
export class LocalStorage implements IStorage {
  private readonly prefix: string;

  constructor(prefix: string = 'app_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private getMetaKey(key: string): string {
    return `${this.prefix}${key}_meta`;
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const storageKey = this.getKey(key);
      const metaKey = this.getMetaKey(key);

      const data = localStorage.getItem(storageKey);
      const meta = localStorage.getItem(metaKey);

      if (!data) return null;

      // 检查是否过期
      if (meta) {
        const metaData = JSON.parse(meta);
        if (metaData.expiresAt && metaData.expiresAt < Date.now()) {
          // 数据已过期，删除
          await this.remove(key);
          return null;
        }
      }

      return JSON.parse(data);
    } catch (error) {
      console.error(`[LocalStorage] Failed to get key "${key}":`, error);
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
      const metaKey = this.getMetaKey(key);

      const data = JSON.stringify(value);
      localStorage.setItem(storageKey, data);

      // 存储元数据（过期时间等）
      if (options) {
        const meta = {
          expiresAt: options.expiresIn
            ? Date.now() + options.expiresIn
            : undefined,
          metadata: options.metadata,
          createdAt: Date.now()
        };
        localStorage.setItem(metaKey, JSON.stringify(meta));
      }
    } catch (error) {
      console.error(`[LocalStorage] Failed to set key "${key}":`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const storageKey = this.getKey(key);
      const metaKey = this.getMetaKey(key);

      localStorage.removeItem(storageKey);
      localStorage.removeItem(metaKey);
    } catch (error) {
      console.error(`[LocalStorage] Failed to remove key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[LocalStorage] Failed to clear:', error);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const testKey = `${this.prefix}test_${Date.now()}`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}
