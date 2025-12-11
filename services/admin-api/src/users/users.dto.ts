import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
  @ApiProperty({
    description: '用户名',
    default: '',
  })
  username: string;

  @ApiProperty({
    description: '密码',
    default: '',
  })
  password: string;

  @ApiProperty({
    description: 'email',
    default: '',
  })
  email?: string;

  @ApiProperty({
    description: '创建时间',
  })
  createTime: Date;

  @ApiProperty({
    description: '更新时间',
  })
  updateTime: Date;
}

export default CreateDto;
