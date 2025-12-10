import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
  @ApiProperty({
    description: '姓名',
    default: '',
  })
  name: string;

  @ApiProperty({
    description: '年龄',
    default: 0,
  })
  age: number;
}

export default CreateDto;