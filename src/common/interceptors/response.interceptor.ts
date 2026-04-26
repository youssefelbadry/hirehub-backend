import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { url, method } = request;

    console.log(`${url} ${method} - Request started`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - now;
        console.log(`[${method} ${url} - Completed in ${time}ms]`);
      }),
    );
  }
}
