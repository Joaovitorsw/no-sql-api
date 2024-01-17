import { HttpStatus } from '@nestjs/common';
import { HydratedDocument, PopulateOptions, Types } from 'mongoose';
import {
  PaginationRequest,
  PaginationResponse,
} from '../../models/pagination-response';
import { BaseRepository } from '../../repository/base/base.repository';
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
  async findAll(
    entity?: PaginationRequest<Partial<T>>,
  ): Promise<PaginationResponse<HydratedDocument<T>>> {
    if (!entity)
      entity = {
        page: 0,
        size: 10,
        sort: 'id,asc',
      } as PaginationRequest<Partial<T>>;
    const page = +(entity?.page ?? 0),
      size = +(entity?.size ?? 10);

    const items = await this.repository.findAll(entity);
    if (items.length === 0) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe nenhum registro com essas informações',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    const pagination = {
      items,
      page: page,
      size: size,
      total: await this.repository.countDocuments(entity),
    };

    return pagination;
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
  async countDocuments(entity: Partial<T>): Promise<number> {
    const result = await this.repository.countDocuments(entity);
    return result;
  }
}
