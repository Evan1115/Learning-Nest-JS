import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(map((data) => instanceToPlain(data)));
  }
}

//transform interceptor
//can be used to transform the request before it is passed to the final handler
// or response data before returned to the client.

//instanceToPlain() method
// accept a object uas input
// convert an object to a plain JavaScript object that only include propties that should be include and exclude those propeties that explicity defined to exclude
// It respects the @Exclude and @Expose decorators, so you can use these decorators to specify which properties should be included or excluded in the resulting plain object.