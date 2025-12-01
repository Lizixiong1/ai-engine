import {
  StorageFactory,
  StorageManager,
  StorageType,
  ApiStorageConfig
} from './StorageFactory';
import { StorageOptions } from './types';
import defaultStorage from './index';
/**
 * 会话存储使用示例
 */

// ============ 示例 1: 使用默认存储 ============
export async function example1_DefaultStorage() {
  // import defaultStorage from './index';

  // 保存数据
  await defaultStorage.set('user', { name: '张三', age: 25 });

  // 获取数据
  const user = await defaultStorage.get('user');
  console.log('User:', user);

  // 删除数据
  await defaultStorage.remove('user');
}

// ============ 示例 2: 使用 LocalStorage ============
export async function example2_LocalStorage() {
  const storage = StorageFactory.create({ type: StorageType.LOCAL });

  // 保存带过期时间的数据
  const options: StorageOptions = {
    expiresIn: 3600000, // 1小时
    metadata: { source: 'api', userId: '123' }
  };

  await storage.set('token', 'abc123token', options);
  const token = await storage.get('token');
  console.log('Token:', token);
}

// ============ 示例 3: 使用 SessionStorage ============
export async function example3_SessionStorage() {
  const storage = StorageFactory.create({ type: StorageType.SESSION });

  await storage.set('tempData', { page: 1, filters: {} });
  const data = await storage.get('tempData');
  console.log('Temp Data:', data);
}

// ============ 示例 4: 使用 API 存储 ============
export async function example4_ApiStorage() {
  const apiConfig: ApiStorageConfig = {
    getUrl: 'https://api.example.com/storage/get',
    setUrl: 'https://api.example.com/storage/set',
    removeUrl: 'https://api.example.com/storage/remove',
    clearUrl: 'https://api.example.com/storage/clear',
    timeout: 10000,
    headers: {
      Authorization: 'Bearer token123'
    },
    onError: (error) => {
      console.error('API Storage Error:', error);
    }
  };

  const storage = StorageFactory.create({
    type: StorageType.API,
    apiConfig
  });

  await storage.set('userPreferences', { theme: 'dark', language: 'zh-CN' });
  const prefs = await storage.get('userPreferences');
  console.log('Preferences:', prefs);
}

// ============ 示例 5: 使用存储管理器（支持降级） ============
export async function example5_StorageManager() {
  // 创建主存储和备用存储
  const apiConfig: ApiStorageConfig = {
    getUrl: '/api/storage/get',
    setUrl: '/api/storage/set',
    removeUrl: '/api/storage/remove'
  };

  const primaryStorage = StorageFactory.create({
    type: StorageType.API,
    apiConfig
  });

  const fallbackStorage = StorageFactory.create({
    type: StorageType.LOCAL
  });

  // 创建存储管理器
  const storageManager = new StorageManager(primaryStorage, fallbackStorage);

  // 正常使用 - 如果 API 失败，会自动降级到 localStorage
  await storageManager.set('session', { userId: '123', token: 'abc' });
  const session = await storageManager.get('session');
  console.log('Session:', session);

  // 检查当前使用的存储
  const activeStorage = storageManager.getActiveStorage();
  console.log('Active Storage:', activeStorage.constructor.name);
}

// ============ 示例 6: 在 React 中使用 Hook ============
export function example6_ReactHook() {
  // 这是一个示例，展示如何在 React 中使用
  const code = `
import { useState, useEffect } from 'react';
import defaultStorage from '@/lib/storage';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // 尝试从存储获取
        let userData = await defaultStorage.get('user');
        
        if (!userData) {
          // 如果没有，从 API 获取
          const response = await fetch('/api/user');
          userData = await response.json();
          
          // 保存到存储，设置 1 小时过期
          await defaultStorage.set('user', userData, { expiresIn: 3600000 });
        }
        
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>Welcome, {user?.name}</div>;
}

export default UserProfile;
  `;
  console.log(code);
}

// ============ 示例 7: 批量操作 ============
export async function example7_BatchOperations() {
  const storage = StorageFactory.create({ type: StorageType.LOCAL });

  // 批量保存
  const data = {
    user: { name: '张三', age: 25 },
    config: { theme: 'dark' },
    preferences: { language: 'zh-CN' }
  };

  for (const [key, value] of Object.entries(data)) {
    await storage.set(key, value);
  }

  // 批量读取
  const results = await Promise.all([
    storage.get('user'),
    storage.get('config'),
    storage.get('preferences')
  ]);

  console.log('Batch Results:', results);

  // 清空所有
  await storage.clear();
}

// ============ 示例 8: 错误处理 ============
export async function example8_ErrorHandling() {
  const storage = StorageFactory.create({ type: StorageType.LOCAL });

  try {
    await storage.set('bigData', new Array(1000000).fill('data'));
  } catch (error) {
    console.error('Failed to save data:', error);
    // 可以降级到内存存储或其他备用方案
  }

  // 检查存储是否可用
  const isAvailable = await storage.isAvailable();
  console.log('Storage available:', isAvailable);
}
