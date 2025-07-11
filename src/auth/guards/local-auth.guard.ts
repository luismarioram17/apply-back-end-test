import { Injectable, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

export function UseLocalAuth() {
  return applyDecorators(UseGuards(LocalAuthGuard));
}
