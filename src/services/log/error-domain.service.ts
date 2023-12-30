import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorDomainService {
  private _errors: string[];
  private _statusCode: HttpStatus = HttpStatus.BAD_REQUEST;
  constructor() {
    this._errors = [];
    this._statusCode = HttpStatus.BAD_REQUEST;
  }

  addError(error: string) {
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
    this._statusCode = null;
  }
}
