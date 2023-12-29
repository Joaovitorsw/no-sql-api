import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { ResponseInterceptor } from './response-interceptor';

describe.only('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let executionContextMock: ExecutionContext;
  let callHandlerMock: { handle: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor>(ResponseInterceptor);

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
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Error occurred',
            data: new HttpException('Error occurred', HttpStatus.BAD_REQUEST),
            success: false,
          });
        },
      });
  });
  it('should handle exception errors', () => {
    const firstRequest = new Observable((observer) => {
      observer.error(new Error('Error occurred'));
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
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error occurred',
            data: new Error('Error occurred'),
            success: false,
          });
        },
      });
  });
});
