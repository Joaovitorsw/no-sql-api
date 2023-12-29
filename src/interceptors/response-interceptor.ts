import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => {
        return this.responseHandler(res, context);
      }),
      catchError((err: HttpException) => {
        return throwError(() => this.errorHandler(err, context));
      }),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).json({
      statusCode: status,
      ...(exception instanceof Array
        ? { message: exception }
        : { message: exception.message }),
      ...(exception instanceof HttpException
        ? { data: exception.getResponse() }
        : {}),
      success: false,
    });
  }
  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return {
      statusCode,
      message: 'Operação realizada com sucesso!',
      data: res,
      success: true,
    };
  }
}
