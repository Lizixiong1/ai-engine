import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  async login(@Query('.com.secret') secret: string) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  
}
