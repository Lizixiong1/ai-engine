import { TransactionConnection } from './driver/Driver';
import { Repository } from './Repository';
import { QueryBuilder } from './QueryBuilder';

/**
 * 事务类，用于管理数据库事务
 */
export class Transaction {
  private connection: TransactionConnection;
  private committed: boolean = false;
  private rolledBack: boolean = false;

  constructor(connection: TransactionConnection) {
    this.connection = connection;
  }

  /**
   * 获取Repository实例，在事务上下文中使用
   */
  getRepository<T = any>(tableName: string): Repository<T> {
    return new Repository<T>(this.connection, tableName);
  }

  /**
   * 执行原始SQL查询
   */
  async query(sql: string, params?: any[]): Promise<any> {
    this.ensureNotFinished();
    return this.connection.query(sql, params);
  }

  /**
   * 提交事务
   */
  async commit(): Promise<void> {
    this.ensureNotFinished();
    await this.connection.commit();
    this.committed = true;
  }

  /**
   * 回滚事务
   */
  async rollback(): Promise<void> {
    this.ensureNotFinished();
    await this.connection.rollback();
    this.rolledBack = true;
  }

  /**
   * 检查事务是否已完成
   */
  isFinished(): boolean {
    return this.committed || this.rolledBack;
  }

  private ensureNotFinished(): void {
    if (this.committed) {
      throw new Error('Transaction has already been committed.');
    }
    if (this.rolledBack) {
      throw new Error('Transaction has already been rolled back.');
    }
  }
}

