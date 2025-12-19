import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { LoginParams, RegisterDto } from './auth.dto';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/common/constant';
import { User } from 'src/users/users.entity';
import dayjs from 'dayjs';

type JwtPayload = {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
};
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: jwtConstants.secret,
      });
    } catch {
      throw new UnauthorizedException('token 无效或已过期');
    }
  }

  async onModuleInit() {
    const username = process.env.INIT_ADMIN_USERNAME;
    const password = process.env.INIT_ADMIN_PASSWORD;

    if (!username || !password) {
      return;
    }

    const exists = await this.userService.findByUsername(username);

    if (exists) return;

    await this.createUser({ username, password });
  }

  async register(dto: RegisterDto) {
    const { username } = dto;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const existed = (await this.userService.findByUsername(
      username,
    )) as User | null;
    if (existed) {
      throw new BadRequestException('用户名已存在');
    }
    const user = await this.createUser(dto);
    const { password: passwordToOmit, ...result } = user;
    void passwordToOmit;
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
      user: result,
    };
  }

  async createUser(dto: RegisterDto) {
    const { username, password } = dto;
    const saltRounds = 10;
    const hash: string = await bcrypt.hash(password, saltRounds);

    const currentTime = dayjs().toDate();

    const user = await this.userService.create({
      username,
      password: hash,
      createTime: currentTime,
      updateTime: currentTime,
    });
    return user;
  }
  async login(
    params: LoginParams,
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const { username, password } = params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const user = (await this.userService.findByUsername(
      username,
    )) as User | null;
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload: JwtPayload = { sub: user.id, username: user.username };
    const { password: passwordToOmit, ...safeUser } = user;
    void passwordToOmit;
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
      user: safeUser,
    };
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });
  }

  generateRefreshToken(sub: JwtPayload['sub']) {
    return this.jwtService.sign({
      sub,
    });
  }
}
