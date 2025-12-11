import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './users.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AUTH_KEY } from 'src/common/constant';
import { ApiAuth } from 'src/decorator/auth.decorator';
import { User } from './users.entity';
import CreateDto from './users.dto';
@ApiAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: CreateDto) {
    return this.userService.create(user);
  }

  @Get()
  findAll() {
    let users = this.userService.findAll();
    return users;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: Partial<User>) {
    return this.userService.update(Number(id), user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
