import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`Request: ${context.switchToHttp().getRequest().url}`);

    return next.handle().pipe(tap(response => console.log(`Response: ${response}`)));
  }
}


// next 
//the next function is a callback that is passed to the interceptor function 
//and can be used to pass control to the next interceptor in the chain or to the final handler function.
// will return a observable
//can use pipe operator to modify the response data like map(transform data), tap(logging)