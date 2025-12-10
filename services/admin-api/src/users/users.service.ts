import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // ← 必须加这个
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建
  async create(user: Partial<User>) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAll() {
    return this.userRepository.find();
  }

  // 查询单个
  async findOne(id: number) {
    let res = await this.userRepository.findOne({where: {id}})
    return res
    // return this.userRepository.findOne({ where: { id } });
  }

  // 更新
  async update(id: number, user: Partial<User>) {
    await this.userRepository.update(id, user);
    return this.findOne(id) as Promise<User>;
  }

  // 删除
  async remove(id: number): Promise<void> {
    // await this.userRepository.delete(id);
  }
}
