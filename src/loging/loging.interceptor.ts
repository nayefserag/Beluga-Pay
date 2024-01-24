import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const beforeReqTime = Date.now();
    const method = context.switchToHttp().getRequest().method;
    const url = context.switchToHttp().getRequest().url;
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${url} - ${Date.now() - beforeReqTime}ms`);
      }),
    );
  }
}
