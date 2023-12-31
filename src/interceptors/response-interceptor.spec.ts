import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { ErrorDomainService } from '../services/error-domain/error-domain.service';
import { ResponseInterceptor } from './response-interceptor';

describe.only('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<unknown>;
  let executionContextMock: ExecutionContext;
  let callHandlerMock: { handle: jest.Mock };
  let errorDomainService: ErrorDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor, ErrorDomainService],
    }).compile();

    interceptor = module.get<ResponseInterceptor<unknown>>(ResponseInterceptor);
    errorDomainService = module.get<ErrorDomainService>(ErrorDomainService);
    callHandlerMock = { handle: jest.fn() };
  });

  it('should format successful responses', () => {
    const data = { result: 'success' };
    executionContextMock = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: HttpStatus.OK,
          status: jest.fn().mockImplementation(() => {
            return { json: jest.fn() };
          }),
        }),
      }),
    } as ExecutionContext;
    callHandlerMock.handle.mockReturnValue(of(data));

    const result$ = interceptor.intercept(
      executionContextMock,
      callHandlerMock,
    );

    result$.subscribe((result) => {
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Operação realizada com sucesso!',
        data,
        success: true,
      });
    });
  });

  it('should handle http exception errors', () => {
    const firstRequest = new Observable((observer) => {
      observer.error(
        new HttpException('Error occurred', HttpStatus.BAD_REQUEST),
      );
    });

    callHandlerMock.handle.mockReturnValue(firstRequest);
    executionContextMock = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: HttpStatus.BAD_REQUEST,
          status: jest.fn().mockImplementation(() => {
            return { json: jest.fn().mockImplementation((value) => value) };
          }),
        }),
      }),
    } as ExecutionContext;

    interceptor
      .intercept(executionContextMock, callHandlerMock)

      .subscribe({
        error: (error) => {
          expect(error).toEqual({
            status: HttpStatus.BAD_REQUEST,
            message: 'Error occurred',
            success: false,
          });
        },
      });
  });
  it('should handle exception errors', () => {
    const firstRequest = new Observable((observer) => {
      observer.error([
        { property: 'name', message: 'name deve ser uma string' },
      ]);
    });

    callHandlerMock.handle.mockReturnValue(firstRequest);
    executionContextMock = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: jest.fn().mockImplementation(() => {
            return { json: jest.fn().mockImplementation((value) => value) };
          }),
        }),
      }),
    } as ExecutionContext;

    interceptor
      .intercept(executionContextMock, callHandlerMock)

      .subscribe({
        error: (error) => {
          expect(error).toEqual({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: [
              {
                message: 'name deve ser uma string',
                property: 'name',
              },
            ],
            success: false,
          });
        },
      });
  });
  it('should handle errorDomainService exception errors', () => {
    const firstRequest = new Observable((observer) => {
      errorDomainService['_errors'] = [
        {
          type: 'ValidationError',
          message: 'name deve ser uma string',
        },
      ];
      errorDomainService['_statusCode'] = HttpStatus.BAD_REQUEST;
      observer.next([]);
    });

    callHandlerMock.handle.mockReturnValue(firstRequest);
    executionContextMock = {
      switchToHttp: () => ({
        getResponse: () => ({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: jest.fn().mockImplementation(() => {
            return { json: jest.fn().mockImplementation((value) => value) };
          }),
        }),
      }),
    } as ExecutionContext;

    interceptor
      .intercept(executionContextMock, callHandlerMock)

      .subscribe({
        error: (error) => {
          expect(error).toEqual({
            status: HttpStatus.BAD_REQUEST,
            message: [
              {
                message: 'name deve ser uma string',
                property: 'name',
              },
            ],
            success: false,
          });
        },
      });
  });
});
