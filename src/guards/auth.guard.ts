import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    // check the presence of the userId property in the session
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
