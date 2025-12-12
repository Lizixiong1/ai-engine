import { Pool } from 'mysql2/promise';

export type DatabaseType = 'mysql' | 'postgres';

export interface ConnectionConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  [key: string]: any;
}

export interface QueryResult {
  rows: any[];
  affectedRows?: number;
  insertId?: number;
}

export interface TransactionConnection {
  query(sql: string, params?: any[]): Promise<QueryResult>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * 查询执行器接口，用于统一DriverBase和TransactionConnection
 */
export interface QueryExecutor {
  query(sql: string, params?: any[]): Promise<QueryResult>;
}

export abstract class DriverBase implements QueryExecutor {
  protected config: ConnectionConfig;
  protected type: DatabaseType;

  constructor(config: ConnectionConfig, type: DatabaseType) {
    this.config = config;
    this.type = type;
  }

  abstract connect(): Promise<void>;
  abstract query(sql: string, params?: any[]): Promise<QueryResult>;
  abstract close(): Promise<void>;
  abstract escape(value: any): string;
  abstract beginTransaction(): Promise<TransactionConnection>;
}
