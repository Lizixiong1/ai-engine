import { IStorage, StorageOptions } from '../types';

/**
 * 会话存储实现（SessionStorage）
 * 用于临时存储，关闭浏览器标签页时数据会被清除
 */
export class SessionStorage implements IStorage {
  private readonly prefix: string;

  constructor(prefix: string = 'session_') {
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

      const data = sessionStorage.getItem(storageKey);
      const meta = sessionStorage.getItem(metaKey);

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
      console.error(`[SessionStorage] Failed to get key "${key}":`, error);
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
      sessionStorage.setItem(storageKey, data);

      // 存储元数据（过期时间等）
      if (options) {
        const meta = {
          expiresAt: options.expiresIn
            ? Date.now() + options.expiresIn
            : undefined,
          metadata: options.metadata,
          createdAt: Date.now()
        };
        sessionStorage.setItem(metaKey, JSON.stringify(meta));
      }
    } catch (error) {
      console.error(`[SessionStorage] Failed to set key "${key}":`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const storageKey = this.getKey(key);
      const metaKey = this.getMetaKey(key);

      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(metaKey);
    } catch (error) {
      console.error(`[SessionStorage] Failed to remove key "${key}":`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[SessionStorage] Failed to clear:', error);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const testKey = `${this.prefix}test_${Date.now()}`;
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}
