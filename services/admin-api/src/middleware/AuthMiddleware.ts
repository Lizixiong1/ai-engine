import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { AUTH_KEY } from 'src/common/constant';

@Injectable()
export class AuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers[AUTH_KEY];

    if (!token || !token?.startsWith('Bearer')) {
      throw new UnauthorizedException('未发现认证信息');
    }

    const accessToken = token.replace('Bearer ', '');

    const user = await this.authService.verifyToken(accessToken);

    if (!user) {
      throw new UnauthorizedException('认证失败');
    }

    (req as any).user = user;

    next();
  }
}
