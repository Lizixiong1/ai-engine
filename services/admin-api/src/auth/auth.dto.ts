import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'lzx', description: '用户名' })
  username: string;

  @ApiProperty({ example: '123456', description: '密码' })
  password: string;

  @ApiProperty({ example: '@12.com', required: false, description: '邮箱' })
  email?: string;
}
