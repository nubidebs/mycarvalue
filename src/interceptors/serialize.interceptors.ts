import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled
    //before a request is handled by request handler
    // ExecutionContext contains info about the request

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out. Data is the incoming User Entity response
        //excludeExtraneousValues removes everything that is not part of the UserDto
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
