import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  id: string;
}

export const GetUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<{ user: JwtUser }>();
    console.log(request.user);
    return request.user.id;
  },
);
