import defaultStorage from "./index";
import { StorageFactory, StorageManager, StorageType } from "./StorageFactory";
import { StorageOptions, ApiStorageConfig } from "./types";

/**
 * 会话管理器 - 处理用户会话数据
 */
export class SessionManager {
  private storageKey = "session";

  async setSession(session: any, expiresIn?: number): Promise<void> {
    const options: StorageOptions | undefined = expiresIn
      ? { expiresIn }
      : undefined;
    await defaultStorage.set(this.storageKey, session, options);
  }

  async getSession(): Promise<any | null> {
    return defaultStorage.get(this.storageKey);
  }

  async clearSession(): Promise<void> {
    await defaultStorage.remove(this.storageKey);
  }

  async isLoggedIn(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null && !!session.userId;
  }
}

/**
 * 缓存管理器 - 管理 API 响应缓存
 */
export class CacheManager {
  private storageKey = "api_cache";
  private cacheLife: number; // 缓存生命周期（毫秒）

  constructor(cacheLife: number = 300000) {
    // 默认 5 分钟
    this.cacheLife = cacheLife;
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramStr = params ? JSON.stringify(params) : "";
    return `${this.storageKey}:${endpoint}:${paramStr}`;
  }

  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T | null> {
    const key = this.getCacheKey(endpoint, params);
    return defaultStorage.get<T>(key);
  }

  async set<T = any>(
    endpoint: string,
    data: T,
    params?: Record<string, any>
  ): Promise<void> {
    const key = this.getCacheKey(endpoint, params);
    await defaultStorage.set(key, data, { expiresIn: this.cacheLife });
  }

  async invalidate(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<void> {
    const key = this.getCacheKey(endpoint, params);
    await defaultStorage.remove(key);
  }

  async clear(): Promise<void> {
    // 清除所有缓存
    await defaultStorage.clear();
  }
}
interface UserPreferences {
  theme?: "light" | "dark";
  language?: string;
  fontSize?: "small" | "medium" | "large";
  notifications?: boolean;
  [key: string]: any;
}

/**
 * 用户偏好管理器 - 管理用户设置
 */
export class PreferencesManager {
  private storageKey = "user_preferences";

  async getPreferences(): Promise<UserPreferences> {
    const prefs = await defaultStorage.get<UserPreferences>(this.storageKey);
    return prefs || {};
  }

  async updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<void> {
    const prefs = await this.getPreferences();
    prefs[key] = value;
    await defaultStorage.set(this.storageKey, prefs);
  }

  async setPreferences(prefs: UserPreferences): Promise<void> {
    await defaultStorage.set(this.storageKey, prefs);
  }

  async clearPreferences(): Promise<void> {
    await defaultStorage.remove(this.storageKey);
  }

  async getTheme(): Promise<"light" | "dark"> {
    const prefs = await this.getPreferences();
    return prefs.theme || "light";
  }

  async setTheme(theme: "light" | "dark"): Promise<void> {
    await this.updatePreference("theme", theme);
  }
}

/**
 * 临时数据管理器 - 使用 SessionStorage 存储临时数据
 */
export class TemporaryDataManager {
  private storage = StorageFactory.create({ type: StorageType.SESSION });

  async set<T = any>(key: string, value: T): Promise<void> {
    await this.storage.set(key, value);
  }

  async get<T = any>(key: string): Promise<T | null> {
    return this.storage.get<T>(key);
  }

  async remove(key: string): Promise<void> {
    await this.storage.remove(key);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }
}

/**
 * 存储健康检查 - 监控存储可用性
 */
export class StorageHealthCheck {
  async checkAll(): Promise<{
    localStorage: boolean;
    sessionStorage: boolean;
    memory: boolean;
  }> {
    const results = await Promise.all([
      StorageFactory.create({ type: StorageType.LOCAL }).isAvailable(),
      StorageFactory.create({ type: StorageType.SESSION }).isAvailable(),
      StorageFactory.create({ type: StorageType.MEMORY }).isAvailable(),
    ]);

    return {
      localStorage: results[0],
      sessionStorage: results[1],
      memory: results[2],
    };
  }

  async getSafeStorage() {
    const checks = await this.checkAll();

    if (checks.localStorage) {
      return StorageFactory.create({ type: StorageType.LOCAL });
    }
    if (checks.sessionStorage) {
      return StorageFactory.create({ type: StorageType.SESSION });
    }
    return StorageFactory.create({ type: StorageType.MEMORY });
  }
}

/**
 * 智能存储管理器 - 根据不同需求选择存储方式
 */
export class SmartStorageManager {
  /**
   * 创建为用户数据优化的存储管理器
   * 主存储: LocalStorage（持久化）
   * 备用: SessionStorage（降级）
   */
  static createForUserData(): StorageManager {
    const primary = StorageFactory.create({ type: StorageType.LOCAL });
    const fallback = StorageFactory.create({ type: StorageType.SESSION });
    return new StorageManager(primary, fallback);
  }

  /**
   * 创建为会话数据优化的存储管理器
   * 主存储: SessionStorage（会话级别）
   * 备用: MemoryStorage（内存）
   */
  static createForSessionData(): StorageManager {
    const primary = StorageFactory.create({ type: StorageType.SESSION });
    const fallback = StorageFactory.create({ type: StorageType.MEMORY });
    return new StorageManager(primary, fallback);
  }

  /**
   * 创建为服务器同步数据优化的存储管理器
   * 主存储: API（服务器）
   * 备用: LocalStorage（本地备份）
   */
  static createForServerSync(apiConfig: ApiStorageConfig): StorageManager {
    const primary = StorageFactory.create({
      type: StorageType.API,
      apiConfig,
    });
    const fallback = StorageFactory.create({ type: StorageType.LOCAL });
    return new StorageManager(primary, fallback);
  }

  /**
   * 创建为敏感数据优化的存储管理器
   * 主存储: API（加密存储在服务器）
   * 备用: SessionStorage（会话级别）
   */
  static createForSensitiveData(apiConfig: ApiStorageConfig): StorageManager {
    const primary = StorageFactory.create({
      type: StorageType.API,
      apiConfig,
    });
    const fallback = StorageFactory.create({ type: StorageType.SESSION });
    return new StorageManager(primary, fallback);
  }
}
