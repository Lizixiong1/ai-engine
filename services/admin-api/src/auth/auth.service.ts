import { Injectable } from '@nestjs/common';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  async verifyToken(token: string) {
    try {
      // 示例：JWT 校验
      //   return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      return true;
    } catch (err) {
      return null;
    }
  }

  async register(dto: RegisterDto) {
    
  }
}
