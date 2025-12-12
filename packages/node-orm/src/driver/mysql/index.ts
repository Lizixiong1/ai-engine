import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { DriverBase, ConnectionConfig, QueryResult, TransactionConnection } from '../Driver';

export class MysqlDriver extends DriverBase {
  private pool: Pool | null = null;

  constructor(config: ConnectionConfig) {
    super(config, 'mysql');
  }

  async connect(): Promise<void> {
    this.pool = mysql.createPool({
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...this.config,
    });
  }

  async query(sql: string, params?: any[]): Promise<QueryResult> {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }

    const [rows, fields] = await this.pool.execute(sql, params || []);
    const result = Array.isArray(rows) ? rows : [];
    
    return {
      rows: result as any[],
      affectedRows: (rows as any).affectedRows,
      insertId: (rows as any).insertId,
    };
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  escape(value: any): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }
    if (typeof value === 'string') {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === 'boolean') {
      return value ? '1' : '0';
    }
    return String(value);
  }

  async beginTransaction(): Promise<TransactionConnection> {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }

    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    return {
      query: async (sql: string, params?: any[]): Promise<QueryResult> => {
        const [rows] = await connection.execute(sql, params || []);
        const result = Array.isArray(rows) ? rows : [];
        
        return {
          rows: result as any[],
          affectedRows: (rows as any).affectedRows,
          insertId: (rows as any).insertId,
        };
      },
      commit: async (): Promise<void> => {
        await connection.commit();
        connection.release();
      },
      rollback: async (): Promise<void> => {
        await connection.rollback();
        connection.release();
      },
    };
  }
}
