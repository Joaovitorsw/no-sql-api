import { HttpStatus, Injectable } from '@nestjs/common';

export enum eTypeDomainError {
  NOT_FOUND = 'NotFoundError',
  ALREADY_EXISTS = 'AlreadyExistsError',
  VALIDATION_ERROR = 'ValidationError',
  UNAUTHORIZED = 'UnauthorizedError',
}

export interface DomainError {
  type: string;
  message: string;
}
@Injectable()
export class ErrorDomainService {
  private _errors: DomainError[];
  private _statusCode: HttpStatus = HttpStatus.BAD_REQUEST;
  constructor() {
    this._errors = [];
    this._statusCode = HttpStatus.BAD_REQUEST;
  }

  addError(error: DomainError) {
    this._errors.push(error);
  }

  get errors() {
    return this._errors;
  }
  set statusCode(statusCode: HttpStatus) {
    this._statusCode = statusCode;
  }
  get statusCode() {
    return this._statusCode;
  }

  clearDomainsErrors() {
    this._errors = [];
    this._statusCode = HttpStatus.BAD_REQUEST;
  }
}
