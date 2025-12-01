import {
  IStorage,
  StorageType,
  StorageFactoryConfig,
  ApiStorageConfig,
} from "./types";
import { LocalStorage } from "./implementations/LocalStorage";
import { SessionStorage } from "./implementations/SessionStorage";
import { ApiStorage } from "./implementations/ApiStorage";
import { MemoryStorage } from "./implementations/MemoryStorage";

/**
 * 存储工厂类
 * 负责创建不同类型的存储实例
 */
export class StorageFactory {
  private static instances: Map<string, IStorage> = new Map();

  /**
   * 创建或获取存储实例
   * @param config 存储配置
   * @returns 存储实例
   */
  static create(config: StorageFactoryConfig): IStorage {
    const key = `${config.type}_${JSON.stringify(config.apiConfig || {})}`;

    // 返回缓存的实例
    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    let instance: IStorage;

    switch (config.type) {
      case StorageType.LOCAL:
        instance = new LocalStorage("app_");
        break;

      case StorageType.SESSION:
        instance = new SessionStorage("session_");
        break;

      case StorageType.API:
        if (!config.apiConfig) {
          throw new Error("ApiStorage requires apiConfig");
        }
        instance = new ApiStorage(config.apiConfig);
        break;

      case StorageType.MEMORY:
        instance = new MemoryStorage("memory_");
        break;

      default:
        throw new Error(`Unknown storage type: ${config.type}`);
    }

    this.instances.set(key, instance);
    return instance;
  }

  /**
   * 清除缓存的实例
   */
  static clearCache(): void {
    this.instances.clear();
  }

  /**
   * 获取所有实例
   */
  static getInstances(): Map<string, IStorage> {
    return this.instances;
  }
}

/**
 * 存储管理器类
 * 提供统一的存储接口，支持降级和故障转移
 */
export class StorageManager {
  private primaryStorage: IStorage;
  private fallbackStorage?: IStorage;
  private isUsingFallback: boolean = false;

  constructor(primaryStorage: IStorage, fallbackStorage?: IStorage) {
    this.primaryStorage = primaryStorage;
    this.fallbackStorage = fallbackStorage;
  }

  /**
   * 获取当前使用的存储
   */
  getActiveStorage(): IStorage {
    return this.isUsingFallback && this.fallbackStorage
      ? this.fallbackStorage
      : this.primaryStorage;
  }

  /**
   * 从存储获取值
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      // 优先使用主存储
      const data = await this.primaryStorage.get<T>(key);
      if (data !== null) {
        this.isUsingFallback = false;
        return data;
      }

      // 如果主存储返回 null，尝试备用存储
      if (this.fallbackStorage) {
        const fallbackData = await this.fallbackStorage.get<T>(key);
        if (fallbackData !== null) {
          this.isUsingFallback = true;
          return fallbackData;
        }
      }

      return null;
    } catch (error) {
      console.error(`[StorageManager] Failed to get key "${key}":`, error);

      // 主存储失败，尝试备用存储
      if (this.fallbackStorage) {
        try {
          this.isUsingFallback = true;
          return await this.fallbackStorage.get<T>(key);
        } catch (fallbackError) {
          console.error(
            `[StorageManager] Fallback storage also failed:`,
            fallbackError
          );
        }
      }

      return null;
    }
  }

  /**
   * 保存值到存储
   */
  async set<T = any>(key: string, value: T, options?: any): Promise<void> {
    try {
      await this.primaryStorage.set(key, value, options);
      this.isUsingFallback = false;
    } catch (error) {
      console.error(`[StorageManager] Primary storage failed:`, error);

      // 主存储失败，尝试备用存储
      if (this.fallbackStorage) {
        try {
          await this.fallbackStorage.set(key, value, options);
          this.isUsingFallback = true;
        } catch (fallbackError) {
          console.error(
            `[StorageManager] Fallback storage also failed:`,
            fallbackError
          );
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * 删除存储值
   */
  async remove(key: string): Promise<void> {
    try {
      await this.primaryStorage.remove(key);
    } catch (error) {
      console.error(`[StorageManager] Failed to remove key "${key}":`, error);
    }

    // 同时从备用存储删除
    if (this.fallbackStorage) {
      try {
        await this.fallbackStorage.remove(key);
      } catch {
        // 忽略备用存储的错误
      }
    }
  }

  /**
   * 清空存储
   */
  async clear(): Promise<void> {
    try {
      await this.primaryStorage.clear();
    } catch (error) {
      console.error("[StorageManager] Failed to clear primary storage:", error);
    }

    if (this.fallbackStorage) {
      try {
        await this.fallbackStorage.clear();
      } catch {
        // 忽略备用存储的错误
      }
    }
  }

  /**
   * 检查存储是否可用
   */
  async isAvailable(): Promise<boolean> {
    try {
      return await this.primaryStorage.isAvailable();
    } catch {
      if (this.fallbackStorage) {
        return await this.fallbackStorage.isAvailable();
      }
      return false;
    }
  }
}


export { StorageType, type ApiStorageConfig };
