import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function UseLocalAuth() {
  return applyDecorators(UseGuards(AuthGuard('local')));
}
