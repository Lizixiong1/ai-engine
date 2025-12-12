# Node ORM

一个简易版本的ORM，支持MySQL和PostgreSQL数据库。

## 特性

- 支持MySQL和PostgreSQL
- 简单的API调用方式，无需依赖注入
- 提供Repository模式进行CRUD操作
- 支持QueryBuilder构建复杂查询
- **支持事务（Transaction）**
- TypeScript支持

## 安装

```bash
npm install
```

## 使用示例

### 1. 创建数据源连接

```typescript
import { DataSource } from '@ai-engine/node-orm';

// MySQL连接
const mysqlDataSource = new DataSource('mysql', {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'mydb',
});

// PostgreSQL连接
const pgDataSource = new DataSource('postgres', {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'mydb',
});

// 连接数据库
await mysqlDataSource.connect();
```

### 2. 使用Repository进行CRUD操作

```typescript
// 获取Repository
const userRepo = mysqlDataSource.getRepository('users');

// 创建记录
const newUser = await userRepo.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
});

// 查找记录
const user = await userRepo.find(1);
const userByEmail = await userRepo.findOne({ email: 'john@example.com' });
const allUsers = await userRepo.findAll();

// 更新记录
await userRepo.update(1, { name: 'Jane Doe' });
await userRepo.updateWhere({ email: 'john@example.com' }, { age: 31 });

// 删除记录
await userRepo.delete(1);
await userRepo.deleteWhere({ email: 'john@example.com' });

// 统计
const count = await userRepo.count({ age: { $gte: 18 } });
const exists = await userRepo.exists({ email: 'john@example.com' });
```

### 3. 使用QueryBuilder构建复杂查询

```typescript
const userRepo = mysqlDataSource.getRepository('users');

// 基础查询
const users = await userRepo
  .query()
  .select(['id', 'name', 'email'])
  .where({ age: { $gte: 18 } })
  .orderBy('created_at', 'DESC')
  .limit(10)
  .offset(0)
  .get();

// 复杂条件查询
const activeUsers = await userRepo
  .query()
  .where({ status: 'active' })
  .orWhere({ role: 'admin' })
  .where({ age: { $gte: 18, $lte: 65 } })
  .get();

// JOIN查询
const ordersWithUsers = await userRepo
  .query()
  .select(['users.*', 'orders.total'])
  .leftJoin('orders', 'users.id', '=', 'orders.user_id')
  .where({ 'users.status': 'active' })
  .get();

// 聚合查询
const userCount = await userRepo
  .query()
  .where({ status: 'active' })
  .count();
```

### 4. 支持的查询操作符

- `$gt`: 大于
- `$gte`: 大于等于
- `$lt`: 小于
- `$lte`: 小于等于
- `$ne`: 不等于
- `$like`: LIKE查询
- `$in`: IN查询

```typescript
// 使用操作符
const users = await userRepo
  .query()
  .where({
    age: { $gte: 18, $lte: 65 },
    status: { $in: ['active', 'pending'] },
    name: { $like: '%John%' },
  })
  .get();
```

### 5. 批量操作

```typescript
// 批量创建
const users = await userRepo.createMany([
  { name: 'User 1', email: 'user1@example.com' },
  { name: 'User 2', email: 'user2@example.com' },
  { name: 'User 3', email: 'user3@example.com' },
]);
```

### 6. 直接执行SQL

```typescript
// 直接执行SQL查询
const result = await mysqlDataSource.query(
  'SELECT * FROM users WHERE age > ?',
  [18]
);
```

### 7. 事务支持

#### 方式一：使用transaction回调（推荐）

```typescript
// 自动管理事务，成功自动提交，失败自动回滚
await mysqlDataSource.transaction(async (transaction) => {
  const userRepo = transaction.getRepository('users');
  const orderRepo = transaction.getRepository('orders');

  // 创建用户
  const user = await userRepo.create({
    name: 'John Doe',
    email: 'john@example.com',
  });

  // 创建订单
  const order = await orderRepo.create({
    user_id: user.id,
    total: 100.00,
    status: 'pending',
  });

  // 如果这里抛出异常，整个事务会自动回滚
  // 如果执行成功，事务会自动提交

  return { user, order };
});
```

#### 方式二：手动管理事务

```typescript
// 开始事务
const transaction = await mysqlDataSource.beginTransaction();

try {
  const userRepo = transaction.getRepository('users');
  const orderRepo = transaction.getRepository('orders');

  // 执行多个操作
  const user = await userRepo.create({
    name: 'John Doe',
    email: 'john@example.com',
  });

  const order = await orderRepo.create({
    user_id: user.id,
    total: 100.00,
  });

  // 提交事务
  await transaction.commit();
} catch (error) {
  // 回滚事务
  await transaction.rollback();
  throw error;
}
```

#### 在事务中执行原始SQL

```typescript
await mysqlDataSource.transaction(async (transaction) => {
  // 使用transaction执行SQL
  await transaction.query(
    'UPDATE users SET balance = balance - ? WHERE id = ?',
    [100, 1]
  );

  await transaction.query(
    'UPDATE accounts SET balance = balance + ? WHERE id = ?',
    [100, 2]
  );
});
```

### 8. 断开连接

```typescript
// 断开数据库连接
await mysqlDataSource.disconnect();
```

## API文档

### DataSource

- `constructor(type: 'mysql' | 'postgres', config: ConnectionConfig)`
- `connect(): Promise<void>` - 连接数据库
- `disconnect(): Promise<void>` - 断开连接
- `getRepository<T>(tableName: string): Repository<T>` - 获取Repository实例
- `getDriver(): DriverBase` - 获取驱动实例
- `query(sql: string, params?: any[]): Promise<any>` - 执行原始SQL
- `beginTransaction(): Promise<Transaction>` - 开始事务
- `transaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T>` - 在事务中执行回调

### Repository

- `query(): QueryBuilder` - 创建查询构建器
- `find(id: number | string): Promise<T | null>` - 根据ID查找
- `findAll(): Promise<T[]>` - 查找所有记录
- `findOne(conditions: Record<string, any>): Promise<T | null>` - 查找单条记录
- `findMany(conditions: Record<string, any>): Promise<T[]>` - 查找多条记录
- `create(data: Partial<T>): Promise<T>` - 创建记录
- `createMany(dataArray: Partial<T>[]): Promise<T[]>` - 批量创建
- `update(id: number | string, data: Partial<T>): Promise<boolean>` - 更新记录
- `updateWhere(conditions: Record<string, any>, data: Partial<T>): Promise<number>` - 条件更新
- `delete(id: number | string): Promise<boolean>` - 删除记录
- `deleteWhere(conditions: Record<string, any>): Promise<number>` - 条件删除
- `count(conditions?: Record<string, any>): Promise<number>` - 统计数量
- `exists(conditions: Record<string, any>): Promise<boolean>` - 检查是否存在

### QueryBuilder

- `select(fields: string | string[]): this` - 选择字段
- `where(condition: WhereCondition, operator?: string): this` - WHERE条件
- `orWhere(condition: WhereCondition): this` - OR条件
- `join(table: string, first: string, operator: string, second: string, type?: string): this` - JOIN
- `leftJoin(...): this` - LEFT JOIN
- `rightJoin(...): this` - RIGHT JOIN
- `orderBy(field: string, direction?: 'ASC' | 'DESC'): this` - 排序
- `groupBy(fields: string | string[]): this` - 分组
- `having(condition: string): this` - HAVING条件
- `limit(count: number): this` - 限制数量
- `offset(count: number): this` - 偏移量
- `get<T>(): Promise<T[]>` - 执行查询
- `first<T>(): Promise<T | null>` - 获取第一条
- `count(): Promise<number>` - 统计数量

### Transaction

- `getRepository<T>(tableName: string): Repository<T>` - 获取事务中的Repository实例
- `query(sql: string, params?: any[]): Promise<any>` - 在事务中执行原始SQL
- `commit(): Promise<void>` - 提交事务
- `rollback(): Promise<void>` - 回滚事务
- `isFinished(): boolean` - 检查事务是否已完成
