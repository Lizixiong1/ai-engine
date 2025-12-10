import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AUTH_KEY } from 'src/common/constant';

export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: AUTH_KEY,
      description: '用户 Token，格式：Bearer xxx',
      required: true,
    }),
  );
}
