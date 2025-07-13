import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDoc } from '@users/docs';

export const LocalRequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { user: UserDoc } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
