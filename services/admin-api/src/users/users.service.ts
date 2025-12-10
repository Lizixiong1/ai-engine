import { Injectable } from '@nestjs/common';
import CreateDto from './users.dto';

@Injectable()
export class UserService {
  createUser(createDto: CreateDto) {
    return '223';
  }
}
