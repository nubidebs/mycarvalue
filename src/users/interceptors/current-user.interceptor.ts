/*  UNUSED   
    
  We replaced the interceptor with a middleware to make sure the checks
  happen before we reach the AuthGuard step 

  */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.CurrentUser = user;
    }
    // run route handler
    return handler.handle();
  }
}
