import { StorageFactory, StorageManager, StorageType } from './StorageFactory';
import { LocalStorage } from './implementations/LocalStorage';
import { SessionStorage } from './implementations/SessionStorage';
import { MemoryStorage } from './implementations/MemoryStorage';
import { ApiStorage } from './implementations/ApiStorage';

// ============ 导出类型 ============
export type { IStorage, StorageOptions, ApiStorageConfig, StorageFactoryConfig } from './types';
export { StorageType } from './types';

// ============ 导出核心类 ============
export { StorageFactory, StorageManager };

// ============ 导出存储实现 ============
export { LocalStorage, SessionStorage, MemoryStorage, ApiStorage };

// ============ 导出管理器 ============
export {
  SessionManager,
  CacheManager,
  PreferencesManager,
  TemporaryDataManager,
  StorageHealthCheck,
  SmartStorageManager
} from './managers';

// ============ 导出 React Hooks ============
export {
  useStorage,
  useSessionStorage,
  useLocalStorage,
  useAsync,
  useCachedAsync,
  useStorageSync,
  useDebounceStorage,
  useThrottle
} from './hooks';

/**
 * 创建默认存储管理器
 * 使用 localStorage 作为主存储，sessionStorage 作为备用存储
 */
export const createDefaultStorageManager = (): StorageManager => {
  const primaryStorage = StorageFactory.create({ type: StorageType.LOCAL });
  const fallbackStorage = StorageFactory.create({ type: StorageType.SESSION });
  return new StorageManager(primaryStorage, fallbackStorage);
};

/**
 * 创建内存存储管理器（用于测试）
 */
export const createMemoryStorageManager = (): StorageManager => {
  const primaryStorage = StorageFactory.create({ type: StorageType.MEMORY });
  return new StorageManager(primaryStorage);
};

/**
 * 默认存储实例 - 使用 localStorage 和 sessionStorage 的组合
 */
const defaultStorage = createDefaultStorageManager();

export default defaultStorage;
