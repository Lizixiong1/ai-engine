import { DriverBase, ConnectionConfig, DatabaseType } from './driver/Driver';
import { MysqlDriver } from './driver/mysql';
import { PostgresDriver } from './driver/postgress';
import { Repository } from './Repository';
import { Transaction } from './Transaction';

export class DataSource {
  private driver: DriverBase | null = null;
  private type: DatabaseType;
  private config: ConnectionConfig;
  private connected: boolean = false;

  constructor(type: DatabaseType, config: ConnectionConfig) {
    this.type = type;
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.connected && this.driver) {
      return;
    }

    if (this.type === 'mysql') {
      this.driver = new MysqlDriver(this.config);
    } else if (this.type === 'postgres') {
      this.driver = new PostgresDriver(this.config);
    } else {
      throw new Error(`Unsupported database type: ${this.type}`);
    }

    await this.driver.connect();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
      this.connected = false;
    }
  }

  getRepository<T = any>(tableName: string): Repository<T> {
    const driver = this.driver;
    if (!driver) {
      throw new Error('DataSource not connected. Call connect() first.');
    }
    return new Repository<T>(driver, tableName);
  }

  getDriver(): DriverBase {
    const driver = this.driver;
    if (!driver) {
      throw new Error('DataSource not connected. Call connect() first.');
    }
    return driver;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const driver = this.driver;
    if (!driver) {
      throw new Error('DataSource not connected. Call connect() first.');
    }
    return driver.query(sql, params);
  }

  /**
   * 开始一个新的事务
   */
  async beginTransaction(): Promise<Transaction> {
    const driver = this.driver;
    if (!driver) {
      throw new Error('DataSource not connected. Call connect() first.');
    }
    const connection = await driver.beginTransaction();
    return new Transaction(connection);
  }

  /**
   * 在事务中执行回调函数
   * 如果回调函数执行成功，自动提交事务；如果抛出异常，自动回滚事务
   */
  async transaction<T>(
    callback: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    const transaction = await this.beginTransaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

