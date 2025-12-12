import { QueryExecutor, QueryResult } from './driver/Driver';
import { QueryBuilder } from './QueryBuilder';

export class Repository<T = any> {
  protected driver: QueryExecutor;
  protected tableName: string;

  constructor(driver: QueryExecutor, tableName: string) {
    this.driver = driver;
    this.tableName = tableName;
  }

  query(): QueryBuilder {
    return new QueryBuilder(this.driver, this.tableName);
  }

  async find(id: number | string): Promise<T | null> {
    return this.query().where({ id }).first<T>();
  }

  async findAll(): Promise<T[]> {
    return this.query().get<T>();
  }

  async findOne(conditions: Record<string, any>): Promise<T | null> {
    return this.query().where(conditions).first<T>();
  }

  async findMany(conditions: Record<string, any>): Promise<T[]> {
    return this.query().where(conditions).get<T>();
  }

  async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    const result = await this.driver.query(sql, values);

    if (result.insertId) {
      return this.find(result.insertId) as Promise<T>;
    }

    // For PostgreSQL, try to get the inserted row
    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as T;
    }

    return data as T;
  }

  async createMany(dataArray: Partial<T>[]): Promise<T[]> {
    if (dataArray.length === 0) {
      return [];
    }

    const fields = Object.keys(dataArray[0]);
    const valuesList = dataArray.map((data) => Object.values(data));
    const placeholders = valuesList.map(() => `(${fields.map(() => '?').join(', ')})`).join(', ');
    const allValues = valuesList.flat();

    const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES ${placeholders}`;
    await this.driver.query(sql, allValues);

    // Return the created records (simplified - in production you might want to fetch them)
    return dataArray as T[];
  }

  async update(id: number | string, data: Partial<T>): Promise<boolean> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const result = await this.driver.query(sql, [...values, id]);

    return (result.affectedRows || 0) > 0;
  }

  async updateWhere(conditions: Record<string, any>, data: Partial<T>): Promise<number> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field) => `${field} = ?`).join(', ');

    const queryBuilder = this.query();
    queryBuilder.where(conditions);
    const whereClause = queryBuilder['whereConditions'].join(' ');
    const whereParams = queryBuilder['whereParams'];

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`;
    const result = await this.driver.query(sql, [...values, ...whereParams]);

    return result.affectedRows || 0;
  }

  async delete(id: number | string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.driver.query(sql, [id]);
    return (result.affectedRows || 0) > 0;
  }

  async deleteWhere(conditions: Record<string, any>): Promise<number> {
    const queryBuilder = this.query();
    queryBuilder.where(conditions);
    const whereClause = queryBuilder['whereConditions'].join(' ');
    const whereParams = queryBuilder['whereParams'];

    const sql = `DELETE FROM ${this.tableName} WHERE ${whereClause}`;
    const result = await this.driver.query(sql, whereParams);

    return result.affectedRows || 0;
  }

  async count(conditions?: Record<string, any>): Promise<number> {
    const queryBuilder = this.query();
    if (conditions) {
      queryBuilder.where(conditions);
    }
    return queryBuilder.count();
  }

  async exists(conditions: Record<string, any>): Promise<boolean> {
    const count = await this.count(conditions);
    return count > 0;
  }
}

