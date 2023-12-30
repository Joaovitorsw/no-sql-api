import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorDomainService } from './error-domain.service';

describe('ErrorDomainService', () => {
  let service: ErrorDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorDomainService],
    }).compile();

    service = module.get<ErrorDomainService>(ErrorDomainService);
  });

  it('should set StatusCode"', () => {
    service.statusCode = HttpStatus.OK;
    expect(service.statusCode).toBe(HttpStatus.OK);
  });
  it('should clearDomainsErrors"', () => {
    expect(service.clearDomainsErrors()).toBe(undefined);
  });
});
