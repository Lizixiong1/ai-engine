import * as common from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';
import { AuthService } from './auth/auth.service';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/users.entity';

@common.Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '123456',
      database: 'admin_api',
      entities: [User], // 实体
      synchronize: true, // 自动同步数据库（开发用）
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [AuthService, Repository],
})
export class AppModule {
  // constructor(consumer: common.MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
  configure(consumer: common.MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).exclude('auth/register', 'auth/login');
  }
}
