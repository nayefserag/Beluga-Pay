import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: winston.Logger;

  constructor() {
    const logFilePath = path.join('logs', 'error.log');
    this.logger = winston.createLogger({
      level: 'error',
      format: winston.format.json(),
      transports: [new winston.transports.File({ filename: logFilePath })],
    });
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logMessage = {
      message: exception.message,
      statusCode: status,
      method: request.method,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(logMessage);

    response.status(status).json(logMessage);
  }
}
