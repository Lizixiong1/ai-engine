import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { DATE_FORMAT1 } from 'src/common/constant';
import CreateDto from './users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // ← 必须加这个
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建
  async create(user: CreateDto) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // 查询单个
  async findOne(id: number) {
    let res = await this.userRepository.findOne({ where: { id } });
    if (res) {
      return {
        ...res,
        createTime: dayjs(res.createTime).format(DATE_FORMAT1),
        updateTime: dayjs(res.updateTime).format(DATE_FORMAT1),
      };
    }
    return res;
    // return this.userRepository.findOne({ where: { id } });
  }

  // 更新
  async update(id: number, user: Partial<User>) {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  // 删除
  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
