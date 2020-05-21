import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.originalUrl;
    const body = req.body;
    this.logger.log(`${method} ${url} ${JSON.stringify(body, null, 0)}`);
    this.logger.log(`Session: ${JSON.stringify(req.user, null, 0)}`);

    return next.handle();
  }
}
