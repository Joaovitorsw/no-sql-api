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
import {
  DomainError,
  ErrorDomainService,
} from '../services/error-domain/error-domain.service';

const STATUS_MESSAGES = {
  [HttpStatus.OK]: 'Operação realizada com sucesso!',
  [HttpStatus.CREATED]: 'Registro criado com sucesso!',
  [HttpStatus.ACCEPTED]: 'Registro atualizado com sucesso!',
  [HttpStatus.NO_CONTENT]: 'Registro excluído com sucesso!',
  [HttpStatus.BAD_REQUEST]: 'Erro na requisição!',
  [HttpStatus.UNAUTHORIZED]: 'Não autorizado!',
  [HttpStatus.FORBIDDEN]: 'Acesso negado!',
  [HttpStatus.NOT_FOUND]: 'Registro não encontrado!',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Erro de validação!',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Erro interno!',
  [HttpStatus.NOT_IMPLEMENTED]: 'Não implementado!',
  [HttpStatus.BAD_GATEWAY]: 'Erro de comunicação!',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Serviço indisponível!',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Tempo de requisição esgotado!',
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  constructor(private errorDomain: ErrorDomainService) {
    this.errorDomain = errorDomain;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: T) => {
        if (this.errorDomain.errors.length > 0) {
          this.errorHandler(this.errorDomain.errors, context);
          this.errorDomain.clearDomainsErrors();
          return;
        }

        return this.responseHandler(res, context);
      }),
      catchError((err: HttpException) => {
        return throwError(() => this.errorHandler(err, context));
      }),
    );
  }

  errorHandler(
    exception: HttpException | Array<DomainError>,
    context: ExecutionContext,
  ) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    status =
      this.errorDomain.statusCode && this.errorDomain.errors.length > 0
        ? this.errorDomain.statusCode
        : status;

    return response.status(status).json({
      status,
      ...(exception instanceof Array
        ? { message: exception }
        : { message: exception.message }),
      success: false,
    });
  }
  responseHandler(res: T, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return {
      statusCode,
      message: STATUS_MESSAGES[statusCode],
      data: res,
      success: true,
    };
  }
}
