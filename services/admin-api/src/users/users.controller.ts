import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AUTH_KEY } from 'src/common/constant';
import { ApiAuth } from 'src/decorator/auth.decorator';
@ApiAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/getUserInfoById/:id')
  async getUserInfoById(@Param('id') id: string) {
    // return this.userService
  }
  @Post('/updateUser')
  async updateUser() {
    return ''
  }
}
