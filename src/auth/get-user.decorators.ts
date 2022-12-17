import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

//the ExecutionContext is a class that provides contextual information about the current request and response. 
//It is used to access the current request and response objects, as well as the current user's authentication 
//information and other metadata. This information is useful for implementing custom logic 
//in middleware or other request-handling functions.

// the switchToHttp() method is used to switch the current execution context from a non-HTTP context (such as a WebSocket or gRPC context) 
//to an HTTP context. This allows access to the current request and response objects, as well as other HTTP-specific information, 
//such as the authentication data and headers. This method is commonly used in middleware and other request-handling functions
// to access information about the current HTTP request.