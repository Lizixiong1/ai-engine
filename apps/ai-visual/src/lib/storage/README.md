# 会话存储系统 (Session Storage System)

一个灵活、解耦的会话存储解决方案，支持多种存储方式（LocalStorage、SessionStorage、API、内存），实现了工厂模式和存储降级。

## 🎯 特性

- **多种存储方式**：支持 LocalStorage、SessionStorage、API、内存存储
- **完全解耦**：通过接口设计，易于扩展新的存储方式
- **自动降级**：支持主备存储切换，提高应用可靠性
- **过期管理**：支持设置数据过期时间
- **元数据支持**：可存储自定义元数据
- **错误处理**：完善的错误处理和日志记录
- **TypeScript 支持**：提供完整的类型定义

## 📦 架构

### 核心组件

```
src/lib/storage/
├── types.ts                          # 类型定义和接口
├── StorageFactory.ts                 # 工厂类和存储管理器
├── index.ts                          # 主入口，导出 API
├── implementations/
│   ├── LocalStorage.ts              # LocalStorage 实现
│   ├── SessionStorage.ts            # SessionStorage 实现
│   ├── ApiStorage.ts                # API 存储实现
│   └── MemoryStorage.ts             # 内存存储实现
├── examples.ts                       # 使用示例
└── README.md                         # 本文档
```

### 核心接口

```typescript
interface IStorage {
  get<T = any>(key: string): Promise<T | null>;
  set<T = any>(key: string, value: T, options?: StorageOptions): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  isAvailable(): Promise<boolean>;
}
```

## 🚀 快速开始

### 基础使用

```typescript
import defaultStorage from '@/lib/storage';

// 保存数据
await defaultStorage.set('user', { name: '张三', age: 25 });

// 获取数据
const user = await defaultStorage.get('user');

// 删除数据
await defaultStorage.remove('user');

// 清空所有数据
await defaultStorage.clear();
```

### 指定存储方式

```typescript
import { StorageFactory, StorageType } from '@/lib/storage';

// 使用 LocalStorage
const localStorage = StorageFactory.create({ type: StorageType.LOCAL });

// 使用 SessionStorage
const sessionStorage = StorageFactory.create({ type: StorageType.SESSION });

// 使用内存存储
const memoryStorage = StorageFactory.create({ type: StorageType.MEMORY });
```

### 使用 API 存储

```typescript
import { StorageFactory, StorageType } from '@/lib/storage';

const apiStorage = StorageFactory.create({
  type: StorageType.API,
  apiConfig: {
    getUrl: 'https://api.example.com/storage/get',
    setUrl: 'https://api.example.com/storage/set',
    removeUrl: 'https://api.example.com/storage/remove',
    clearUrl: 'https://api.example.com/storage/clear',
    timeout: 10000,
    headers: {
      Authorization: 'Bearer token123'
    },
    onError: (error) => {
      console.error('API Error:', error);
    }
  }
});

await apiStorage.set('data', { value: 'test' });
const data = await apiStorage.get('data');
```

### 使用存储管理器（支持降级）

```typescript
import {
  StorageFactory,
  StorageManager,
  StorageType
} from '@/lib/storage';

// 创建主存储和备用存储
const primaryStorage = StorageFactory.create({ type: StorageType.API, apiConfig });
const fallbackStorage = StorageFactory.create({ type: StorageType.LOCAL });

// 创建管理器
const manager = new StorageManager(primaryStorage, fallbackStorage);

// 正常使用 - 如果 API 失败，会自动降级到 localStorage
await manager.set('session', { userId: '123' });
const session = await manager.get('session');

// 检查当前使用的存储
const storage = manager.getActiveStorage();
```

## 📝 高级特性

### 数据过期

```typescript
const options = {
  expiresIn: 3600000 // 1 小时后过期
};

await defaultStorage.set('token', 'abc123', options);

// 1 小时后，获取会返回 null
const token = await defaultStorage.get('token'); // null
```

### 元数据

```typescript
const options = {
  expiresIn: 3600000,
  metadata: {
    source: 'api',
    userId: '123',
    timestamp: new Date()
  }
};

await defaultStorage.set('user', userData, options);
```

### 错误处理

```typescript
try {
  await storage.set('data', largeData);
} catch (error) {
  console.error('Storage failed:', error);
  // 可以尝试其他存储方式或显示用户提示
}

// 检查存储是否可用
const isAvailable = await storage.isAvailable();
if (!isAvailable) {
  console.warn('Storage is not available');
}
```

## 🔌 React 集成示例

### 自定义 Hook

```typescript
import { useState, useEffect } from 'react';
import defaultStorage from '@/lib/storage';

function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // 从存储加载
  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await defaultStorage.get<T>(key);
        if (stored !== null) {
          setValue(stored);
        }
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  // 保存到存储
  const setSyncedValue = async (newValue: T) => {
    setValue(newValue);
    await defaultStorage.set(key, newValue);
  };

  return [value, setSyncedValue, loading] as const;
}

// 使用
function App() {
  const [user, setUser, loading] = useStorage('user', null);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={() => setUser({ name: 'New User' })}>
        Update User
      </button>
    </div>
  );
}
```

## 🛠️ 扩展自定义存储

```typescript
import { IStorage, StorageOptions } from '@/lib/storage';

// 创建自定义存储实现
class IndexedDBStorage implements IStorage {
  async get<T = any>(key: string): Promise<T | null> {
    // 实现 IndexedDB 逻辑
  }

  async set<T = any>(key: string, value: T, options?: StorageOptions): Promise<void> {
    // 实现 IndexedDB 逻辑
  }

  async remove(key: string): Promise<void> {
    // 实现删除逻辑
  }

  async clear(): Promise<void> {
    // 实现清空逻辑
  }

  async isAvailable(): Promise<boolean> {
    // 检查 IndexedDB 是否可用
  }
}

// 使用自定义存储
const storage = new IndexedDBStorage();
await storage.set('key', 'value');
```

## 📊 存储方式对比

| 特性 | LocalStorage | SessionStorage | API | 内存 |
|------|-----------|------------|-----|------|
| 持久化 | ✅ | ❌ | ✅ | ❌ |
| 跨标签页 | ✅ | ❌ | ✅ | ❌ |
| 容量 | ~5MB | ~5MB | 取决于服务器 | 取决于内存 |
| 离线支持 | ✅ | ✅ | ❌ | ✅ |
| 安全性 | ⚠️ | ⚠️ | ✅ (HTTPS) | ✅ |
| 适用场景 | 用户偏好、令牌 | 临时数据 | 敏感数据 | 测试 |

## ⚙️ API 后端实现示例

### Node.js + Express

```typescript
import express from 'express';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

// 模拟存储
const storage = new Map<string, any>();

// GET /api/storage/get
app.get('/api/storage/get', (req: Request, res: Response) => {
  const { key } = req.query;
  const data = storage.get(String(key));
  res.json({ data: data || null });
});

// POST /api/storage/set
app.post('/api/storage/set', (req: Request, res: Response) => {
  const { key, value, expiresIn } = req.body;
  
  let expiresAt: number | undefined;
  if (expiresIn) {
    expiresAt = Date.now() + expiresIn;
  }

  storage.set(String(key), { value, expiresAt });
  res.json({ success: true });
});

// DELETE /api/storage/remove
app.delete('/api/storage/remove', (req: Request, res: Response) => {
  const { key } = req.body;
  storage.delete(String(key));
  res.json({ success: true });
});

// DELETE /api/storage/clear
app.delete('/api/storage/clear', (req: Request, res: Response) => {
  storage.clear();
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Storage API running on http://localhost:3000');
});
```

## 🧪 测试

```typescript
import { StorageFactory, StorageType } from '@/lib/storage';

describe('Storage System', () => {
  it('should save and retrieve data', async () => {
    const storage = StorageFactory.create({ type: StorageType.MEMORY });
    
    const data = { name: 'test' };
    await storage.set('key', data);
    const retrieved = await storage.get('key');
    
    expect(retrieved).toEqual(data);
  });

  it('should expire data', async () => {
    const storage = StorageFactory.create({ type: StorageType.MEMORY });
    
    await storage.set('key', 'value', { expiresIn: 100 });
    let value = await storage.get('key');
    expect(value).toBe('value');
    
    // 等待过期
    await new Promise(resolve => setTimeout(resolve, 150));
    value = await storage.get('key');
    expect(value).toBeNull();
  });
});
```

## 📄 许可证

MIT

## 💡 最佳实践

1. **使用默认存储**：大多数场景下使用 `defaultStorage` 即可
2. **区分用途**：敏感数据使用 API 存储，临时数据使用 SessionStorage
3. **设置过期**：为会话数据设置合理的过期时间
4. **错误处理**：始终处理可能的存储错误
5. **监控可用性**：在关键操作前检查存储是否可用
6. **降级方案**：使用 StorageManager 实现自动降级

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
