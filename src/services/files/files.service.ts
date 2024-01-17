import { Injectable } from '@nestjs/common';
import { FilesRepository } from 'src/repository/files/files.repository';
import { Files } from 'src/schemas/files.schema';
import { BaseService } from '../base/base.service';
import { ErrorDomainService } from '../error-domain/error-domain.service';

@Injectable()
export class FilesService extends BaseService<Files> {
  constructor(
    public filesRepository: FilesRepository,
    public errorDomainService: ErrorDomainService,
  ) {
    super(filesRepository, errorDomainService);
  }
}
