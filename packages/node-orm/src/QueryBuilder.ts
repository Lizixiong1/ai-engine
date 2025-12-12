import { QueryExecutor } from './driver/Driver';

export type WhereCondition = {
  [key: string]: any;
} | Array<[string, string, any]> | string;

export class QueryBuilder {
  private driver: QueryExecutor;
  private table: string;
  private selectFields: string[] = [];
  private whereConditions: string[] = [];
  private whereParams: any[] = [];
  private orderByFields: string[] = [];
  private limitCount: number | null = null;
  private offsetCount: number | null = null;
  private joinClauses: string[] = [];
  private groupByFields: string[] = [];
  private havingConditions: string[] = [];

  constructor(driver: QueryExecutor, table: string) {
    this.driver = driver;
    this.table = table;
  }

  select(fields: string | string[]): this {
    if (typeof fields === 'string') {
      this.selectFields = [fields];
    } else {
      this.selectFields = fields;
    }
    return this;
  }

  where(condition: WhereCondition, operator: string = 'AND'): this {
    if (typeof condition === 'string') {
      this.whereConditions.push(`(${condition})`);
    } else if (Array.isArray(condition)) {
      // Array format: [['field', '=', 'value'], ['field2', '>', 10]]
      condition.forEach(([field, op, value]) => {
        this.addWhereCondition(field, op, value, operator);
      });
    } else {
      // Object format: { field: value, field2: { $gt: 10 } }
      Object.keys(condition).forEach((key) => {
        const value = condition[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Support operators like { $gt: 10, $lt: 20 }
          if (value.$gt !== undefined) {
            this.addWhereCondition(key, '>', value.$gt, operator);
          }
          if (value.$gte !== undefined) {
            this.addWhereCondition(key, '>=', value.$gte, operator);
          }
          if (value.$lt !== undefined) {
            this.addWhereCondition(key, '<', value.$lt, operator);
          }
          if (value.$lte !== undefined) {
            this.addWhereCondition(key, '<=', value.$lte, operator);
          }
          if (value.$ne !== undefined) {
            this.addWhereCondition(key, '!=', value.$ne, operator);
          }
          if (value.$like !== undefined) {
            this.addWhereCondition(key, 'LIKE', value.$like, operator);
          }
          if (value.$in !== undefined) {
            this.addWhereCondition(key, 'IN', value.$in, operator);
          }
        } else {
          this.addWhereCondition(key, '=', value, operator);
        }
      });
    }
    return this;
  }

  private addWhereCondition(field: string, operator: string, value: any, logicOperator: string = 'AND'): void {
    if (this.whereConditions.length > 0) {
      this.whereConditions.push(logicOperator);
    }

    if (operator.toUpperCase() === 'IN' && Array.isArray(value)) {
      const placeholders = value.map(() => '?').join(', ');
      this.whereConditions.push(`${field} IN (${placeholders})`);
      this.whereParams.push(...value);
    } else {
      this.whereConditions.push(`${field} ${operator} ?`);
      this.whereParams.push(value);
    }
  }

  orWhere(condition: WhereCondition): this {
    return this.where(condition, 'OR');
  }

  join(table: string, first: string, operator: string, second: string, type: string = 'INNER'): this {
    this.joinClauses.push(`${type} JOIN ${table} ON ${first} ${operator} ${second}`);
    return this;
  }

  leftJoin(table: string, first: string, operator: string, second: string): this {
    return this.join(table, first, operator, second, 'LEFT');
  }

  rightJoin(table: string, first: string, operator: string, second: string): this {
    return this.join(table, first, operator, second, 'RIGHT');
  }

  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByFields.push(`${field} ${direction}`);
    return this;
  }

  groupBy(fields: string | string[]): this {
    if (typeof fields === 'string') {
      this.groupByFields = [fields];
    } else {
      this.groupByFields = fields;
    }
    return this;
  }

  having(condition: string): this {
    this.havingConditions.push(condition);
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  offset(count: number): this {
    this.offsetCount = count;
    return this;
  }

  async get<T = any>(): Promise<T[]> {
    const sql = this.buildSelectQuery();
    const result = await this.driver.query(sql, this.whereParams);
    return result.rows as T[];
  }

  async first<T = any>(): Promise<T | null> {
    this.limit(1);
    const results = await this.get<T>();
    return results.length > 0 ? results[0] : null;
  }

  async count(): Promise<number> {
    const sql = this.buildCountQuery();
    const result = await this.driver.query(sql, this.whereParams);
    return parseInt(result.rows[0]?.count || '0', 10);
  }

  private buildSelectQuery(): string {
    const fields = this.selectFields.length > 0 ? this.selectFields.join(', ') : '*';
    let sql = `SELECT ${fields} FROM ${this.table}`;

    if (this.joinClauses.length > 0) {
      sql += ' ' + this.joinClauses.join(' ');
    }

    if (this.whereConditions.length > 0) {
      sql += ' WHERE ' + this.whereConditions.join(' ');
    }

    if (this.groupByFields.length > 0) {
      sql += ' GROUP BY ' + this.groupByFields.join(', ');
    }

    if (this.havingConditions.length > 0) {
      sql += ' HAVING ' + this.havingConditions.join(' AND ');
    }

    if (this.orderByFields.length > 0) {
      sql += ' ORDER BY ' + this.orderByFields.join(', ');
    }

    if (this.limitCount !== null) {
      sql += ` LIMIT ${this.limitCount}`;
    }

    if (this.offsetCount !== null) {
      sql += ` OFFSET ${this.offsetCount}`;
    }

    return sql;
  }

  private buildCountQuery(): string {
    let sql = `SELECT COUNT(*) as count FROM ${this.table}`;

    if (this.joinClauses.length > 0) {
      sql += ' ' + this.joinClauses.join(' ');
    }

    if (this.whereConditions.length > 0) {
      sql += ' WHERE ' + this.whereConditions.join(' ');
    }

    if (this.groupByFields.length > 0) {
      sql += ' GROUP BY ' + this.groupByFields.join(', ');
    }

    return sql;
  }
}

