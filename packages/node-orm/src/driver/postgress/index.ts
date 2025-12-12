// eslint-disable-next-line @typescript-eslint/no-var-requires
import pg from "pg";
import {
  DriverBase,
  ConnectionConfig,
  QueryResult,
  TransactionConnection,
} from "../Driver";

export class PostgresDriver extends DriverBase {
  private pool: any = null;

  constructor(config: ConnectionConfig) {
    super(config, "postgres");
  }

  async connect(): Promise<void> {
    this.pool = new pg.Pool({
      max: 10,
      ...this.config,
    });
  }

  async query(sql: string, params?: any[]): Promise<QueryResult> {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }

    const result = await this.pool.query(sql, params || []);

    return {
      rows: result.rows,
      affectedRows: result.rowCount,
      insertId: result.rows[0]?.id,
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
      return "NULL";
    }
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    return String(value);
  }

  async beginTransaction(): Promise<TransactionConnection> {
    if (!this.pool) {
      throw new Error("Database not connected. Call connect() first.");
    }

    const client = await this.pool.connect();
    await client.query("BEGIN");

    return {
      query: async (sql: string, params?: any[]): Promise<QueryResult> => {
        const result = await client.query(sql, params || []);
        return {
          rows: result.rows,
          affectedRows: result.rowCount,
          insertId: result.rows[0]?.id,
        };
      },
      commit: async (): Promise<void> => {
        await client.query("COMMIT");
        client.release();
      },
      rollback: async (): Promise<void> => {
        await client.query("ROLLBACK");
        client.release();
      },
    };
  }
}
