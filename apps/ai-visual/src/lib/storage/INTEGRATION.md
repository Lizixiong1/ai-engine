# 会话存储系统集成指南

## 📚 目录结构

```
src/lib/storage/
├── types.ts                              # 核心类型和接口定义
├── StorageFactory.ts                     # 工厂类和存储管理器
├── index.ts                              # 主入口和导出
│
├── implementations/
│   ├── LocalStorage.ts                  # LocalStorage 实现
│   ├── SessionStorage.ts                # SessionStorage 实现
│   ├── ApiStorage.ts                    # API 存储实现
│   └── MemoryStorage.ts                 # 内存存储实现
│
├── managers.ts                           # 高级管理器（会话、缓存、偏好等）
├── hooks.ts                              # React Hooks（需要 React 环境）
│
├── __tests__/
│   └── storage.test.ts                  # 单元测试
│
├── examples.ts                           # 使用示例
└── README.md                             # 详细文档
```

## 🔧 快速集成步骤

### 1. 基础使用

```typescript
import defaultStorage from '@/lib/storage';

// 保存数据
await defaultStorage.set('user', { name: '张三' });

// 获取数据
const user = await defaultStorage.get('user');

// 删除数据
await defaultStorage.remove('user');
```

### 2. 在 React 组件中使用 Hook

```typescript
import { useStorage } from '@/lib/storage';

function MyComponent() {
  const [user, setUser, { loading }] = useStorage('user', null);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={() => setUser({ name: 'New User' })}>
        Update
      </button>
    </div>
  );
}
```

### 3. 使用高级管理器

```typescript
import { SessionManager, CacheManager, PreferencesManager } from '@/lib/storage/managers';

// 会话管理
const sessionManager = new SessionManager();
await sessionManager.setSession({ userId: '123' }, 3600000); // 1 小时过期

// 缓存管理
const cacheManager = new CacheManager(300000); // 5 分钟缓存
await cacheManager.set('/api/users', users);
const cached = await cacheManager.get('/api/users');

// 偏好管理
const prefsManager = new PreferencesManager();
await prefsManager.setTheme('dark');
const theme = await prefsManager.getTheme();
```

## 📋 常见场景

### 场景 1：用户登录状态管理

```typescript
import { SessionManager } from '@/lib/storage/managers';

const sessionManager = new SessionManager();

// 登录
async function login(username: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  const session = await response.json();
  
  // 保存会话，设置 24 小时过期
  await sessionManager.setSession(session, 86400000);
}

// 检查是否已登录
async function checkLoggedIn() {
  return await sessionManager.isLoggedIn();
}

// 登出
async function logout() {
  await sessionManager.clearSession();
}
```

### 场景 2：API 响应缓存

```typescript
import { CacheManager } from '@/lib/storage/managers';

const cache = new CacheManager(300000); // 5 分钟

async function getUsers() {
  // 检查缓存
  let users = await cache.get('/api/users');
  
  if (users) {
    console.log('From cache');
    return users;
  }

  // 从 API 获取
  const response = await fetch('/api/users');
  users = await response.json();

  // 缓存结果
  await cache.set('/api/users', users);
  
  return users;
}

// 使缓存失效
await cache.invalidate('/api/users');
```

### 场景 3：用户偏好设置

```typescript
import { PreferencesManager } from '@/lib/storage/managers';

const prefs = new PreferencesManager();

// 获取主题
const theme = await prefs.getTheme();

// 切换主题
await prefs.setTheme('dark');

// 更新其他偏好
await prefs.updatePreference('language', 'zh-CN');
await prefs.updatePreference('fontSize', 'large');
```

### 场景 4：临时页面数据

```typescript
import { TemporaryDataManager } from '@/lib/storage/managers';

const temp = new TemporaryDataManager();

// 页面导航前保存表单数据
await temp.set('formData', { name: 'test', email: 'test@example.com' });

// 页面加载时恢复数据
const formData = await temp.get('formData');

// 提交后清除
await temp.remove('formData');
```

### 场景 5：服务器数据同步

```typescript
import { SmartStorageManager } from '@/lib/storage/managers';

const apiConfig = {
  getUrl: '/api/storage/get',
  setUrl: '/api/storage/set',
  removeUrl: '/api/storage/remove',
  timeout: 10000
};

const storage = SmartStorageManager.createForServerSync(apiConfig);

// 自动使用 API，失败时降级到 localStorage
await storage.set('userData', userData);
const data = await storage.get('userData');
```

### 场景 6：敏感数据处理

```typescript
import { SmartStorageManager } from '@/lib/storage/managers';

const apiConfig = {
  getUrl: '/api/secure/get',
  setUrl: '/api/secure/set',
  removeUrl: '/api/secure/remove',
  headers: {
    'X-CSRF-Token': csrfToken
  }
};

// 敏感数据：优先使用 API（服务器加密），降级到 SessionStorage
const storage = SmartStorageManager.createForSensitiveData(apiConfig);

await storage.set('token', sensitiveToken);
```

## 🎨 React 中的高级用法

### 自定义 Hook - 同步多个值

```typescript
import { useStorageSync } from '@/lib/storage/hooks';

function Settings() {
  const [values, setValueAndSync] = useStorageSync({
    theme: 'light',
    language: 'en',
    notifications: true
  });

  return (
    <div>
      <select
        value={values.theme}
        onChange={(e) => setValueAndSync('theme', e.target.value)}
      >
        <option>light</option>
        <option>dark</option>
      </select>
    </div>
  );
}
```

### 缓存 API 请求

```typescript
import { useCachedAsync } from '@/lib/storage/hooks';

function UserProfile() {
  const { data: user, loading, refetch } = useCachedAsync(
    'user-profile',
    async () => {
      const res = await fetch('/api/user/profile');
      return res.json();
    },
    { expiresIn: 600000 } // 10 分钟缓存
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => refetch({ skipCache: true })}>
        Refresh
      </button>
    </div>
  );
}
```

### 防抖存储更新

```typescript
import { useDebounceStorage } from '@/lib/storage/hooks';

function SearchBox() {
  const [query, setQuery, { savedValue }] = useDebounceStorage(
    'search-query',
    '',
    500 // 500ms 防抖
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Last saved: {savedValue}</p>
    </div>
  );
}
```

## 🔒 安全考虑

### 1. 敏感数据

```typescript
// ❌ 不要在 localStorage 中存储敏感数据
await localStorage.set('password', password);

// ✅ 使用 API 存储
const storage = SmartStorageManager.createForSensitiveData(apiConfig);
await storage.set('password', password);

// ✅ 或使用 SessionStorage（关闭浏览器后清除）
const sessionStorage = StorageFactory.create({ type: StorageType.SESSION });
await sessionStorage.set('token', token);
```

### 2. 数据验证

```typescript
async function safeGet<T>(key: string, validator?: (data: any) => boolean): Promise<T | null> {
  try {
    const data = await defaultStorage.get<T>(key);
    
    // 验证数据
    if (validator && !validator(data)) {
      console.warn('Data validation failed');
      await defaultStorage.remove(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get data:', error);
    return null;
  }
}
```

### 3. CSRF 防护

```typescript
const apiConfig: ApiStorageConfig = {
  getUrl: '/api/storage/get',
  setUrl: '/api/storage/set',
  removeUrl: '/api/storage/remove',
  headers: {
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
  }
};

const storage = StorageFactory.create({
  type: StorageType.API,
  apiConfig
});
```

## 🧪 测试

### 单元测试示例

```typescript
import { StorageFactory, StorageType } from '@/lib/storage';

describe('User Session Storage', () => {
  it('should save and retrieve user session', async () => {
    const storage = StorageFactory.create({ type: StorageType.MEMORY });
    
    const session = { userId: '123', token: 'abc' };
    await storage.set('session', session);
    
    const retrieved = await storage.get('session');
    expect(retrieved).toEqual(session);
  });

  it('should expire session data', async () => {
    const storage = StorageFactory.create({ type: StorageType.MEMORY });
    
    await storage.set('session', { userId: '123' }, { expiresIn: 100 });
    let data = await storage.get('session');
    expect(data).not.toBeNull();
    
    await new Promise(resolve => setTimeout(resolve, 150));
    data = await storage.get('session');
    expect(data).toBeNull();
  });
});
```

## 📊 性能优化

### 1. 缓存 API 请求

```typescript
const cache = new CacheManager(300000);

async function fetchData(endpoint: string) {
  const cached = await cache.get(endpoint);
  if (cached) return cached;

  const data = await fetch(endpoint).then(r => r.json());
  await cache.set(endpoint, data);
  return data;
}
```

### 2. 批量操作

```typescript
// 减少异步调用
const data = {
  user: { name: 'test' },
  settings: { theme: 'dark' },
  cache: { timestamp: Date.now() }
};

// 批量保存
for (const [key, value] of Object.entries(data)) {
  await defaultStorage.set(key, value);
}

// 批量读取
const results = await Promise.all([
  defaultStorage.get('user'),
  defaultStorage.get('settings'),
  defaultStorage.get('cache')
]);
```

### 3. 存储可用性检查

```typescript
import { StorageHealthCheck } from '@/lib/storage/managers';

const healthCheck = new StorageHealthCheck();
const status = await healthCheck.checkAll();

if (!status.localStorage) {
  console.warn('LocalStorage not available, using fallback');
}
```

## 🐛 故障排查

### 问题 1：数据不持久化

```typescript
// 检查存储是否可用
const isAvailable = await defaultStorage.isAvailable();

if (!isAvailable) {
  console.error('Storage is not available');
  // 使用备用方案
}
```

### 问题 2：数据超过存储限制

```typescript
try {
  await storage.set('largeData', bigObject);
} catch (error) {
  console.error('Failed to save:', error);
  // 压缩数据或分片保存
  const compressed = JSON.stringify(bigObject);
  if (compressed.length > 5000000) {
    // 分片保存或使用 API 存储
  }
}
```

### 问题 3：跨域问题（API 存储）

```typescript
const apiConfig: ApiStorageConfig = {
  getUrl: '/api/storage/get', // 使用相对路径
  setUrl: '/api/storage/set',
  removeUrl: '/api/storage/remove',
  timeout: 10000,
  onError: (error) => {
    console.error('API Error:', error);
    // 可以在这里实现降级逻辑
  }
};
```

## 📚 更多资源

- [types.ts](./types.ts) - 核心类型定义
- [StorageFactory.ts](./StorageFactory.ts) - 工厂类实现
- [managers.ts](./managers.ts) - 高级管理器
- [hooks.ts](./hooks.ts) - React Hooks
- [examples.ts](./examples.ts) - 完整示例
- [__tests__/storage.test.ts](./__tests__/storage.test.ts) - 单元测试
