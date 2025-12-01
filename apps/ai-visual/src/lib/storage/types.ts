/**
 * 存储接口定义 - 所有存储方案必须实现此接口
 */
export interface IStorage {
  /**
   * 获取存储值
   * @param key 存储键
   * @returns Promise 返回存储的值，不存在返回 null
   */
  get<T = any>(key: string): Promise<T | null>;

  /**
   * 设置存储值
   * @param key 存储键
   * @param value 存储值
   * @param options 可选配置（如过期时间）
   */
  set<T = any>(
    key: string,
    value: T,
    options?: StorageOptions
  ): Promise<void>;

  /**
   * 删除存储值
   * @param key 存储键
   */
  remove(key: string): Promise<void>;

  /**
   * 清空所有存储数据
   */
  clear(): Promise<void>;

  /**
   * 检查存储是否可用
   */
  isAvailable(): Promise<boolean>;
}

/**
 * 存储选项配置
 */
export interface StorageOptions {
  /**
   * 过期时间（毫秒），为 0 表示不过期
   */
  expiresIn?: number;

  /**
   * 自定义元数据
   */
  metadata?: Record<string, any>;
}

/**
 * API 调用配置
 */
export interface ApiStorageConfig {
  /**
   * 获取数据的 API 端点
   */
  getUrl: string;

  /**
   * 保存数据的 API 端点
   */
  setUrl: string;

  /**
   * 删除数据的 API 端点
   */
  removeUrl: string;

  /**
   * 清空数据的 API 端点（可选）
   */
  clearUrl?: string;

  /**
   * 请求超时时间（毫秒）
   */
  timeout?: number;

  /**
   * 自定义请求头
   */
  headers?: Record<string, string>;

  /**
   * API 错误处理回调
   */
  onError?: (error: Error) => void;
}

/**
 * 存储类型枚举
 */
export enum StorageType {
  LOCAL = 'local',
  SESSION = 'session',
  API = 'api',
  MEMORY = 'memory'
}

/**
 * 存储工厂配置
 */
export interface StorageFactoryConfig {
  type: StorageType;
  apiConfig?: ApiStorageConfig;
}
