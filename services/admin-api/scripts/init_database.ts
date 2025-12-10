import * as fs from 'fs';
import * as path from 'path';
import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();


// ts-node 允许使用ts允许node模块而不需要编译， -r tsconfig-paths/register
async function initDatabase() {
  try {
    const connection = await createConnection({
      host: process.env.HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: true, // 允许多个sql语句
    });

    const sql = fs.readFileSync(
      path.join(__dirname, '../database/init.sql'),
      'utf-8',
    );

    // console.log(sql);

    await connection.query(sql);
    connection.end();
    console.log('初始化成功');
    
  } catch (error) {
    // process.exit();
    console.log(error);
  }
}

initDatabase();
