import { HttpStatus } from '@nestjs/common';
import { PopulateOptions, Types } from 'mongoose';
import { BaseRepository } from 'src/repository/base/base.repository';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';

export class BaseService<T> {
  constructor(
    protected repository: BaseRepository<T>,
    protected errorDomainService: ErrorDomainService,
  ) {}

  async create(
    entity: Partial<T>,
    entityToPopulate?: PopulateOptions,
  ): Promise<T> {
    const createdEntity = await this.repository.create(
      entity,
      entityToPopulate,
    );
    const object = createdEntity;
    return object;
  }
  async findAll(roles: Partial<T>): Promise<T[]> {
    const result = await this.repository.findAll(roles);
    return result;
  }
  async findById(id: string | number | Types.ObjectId): Promise<T> {
    const result = await this.repository.findById(id);
    if (!result) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um registro com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }
    return result;
  }
  async update(entity: T): Promise<T> {
    const result = await this.repository.findOneAndUpdate(
      {
        _id: entity['id'],
      },
      {
        ...entity,
      },
    );
    if (!result) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um registro com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }
    return result;
  }
  async removeById(id: string | number | Types.ObjectId): Promise<T> {
    const result = await this.repository.findOneAndDelete({
      _id: id,
    });
    if (!result) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um registro com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }
    return result;
  }
}
