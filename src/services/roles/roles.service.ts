import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../../repository/roles/roles.repository';
import { Roles } from '../../schemas/roles.schema';
import { BaseService } from '../base/base.service';
import { ErrorDomainService } from '../error-domain/error-domain.service';

@Injectable()
export class RolesService extends BaseService<Roles> {
  constructor(
    public rolesRepository: RolesRepository,
    public errorDomainService: ErrorDomainService,
  ) {
    super(rolesRepository, errorDomainService);
  }
}
