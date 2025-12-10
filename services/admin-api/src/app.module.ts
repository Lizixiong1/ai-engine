import * as common from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';
import { AuthService } from './auth/auth.service';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import { AuthModule } from './auth/auth.module';

@common.Module({
  imports: [UsersModule, AuthModule],
  providers: [AuthService],
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
