import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  PopulateOptions,
  QueryOptions,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
export type DocumentType<T> = T & Document;
export class BaseRepository<T> {
  protected model: Model<T>;
  protected entityToPopulate: PopulateOptions;

  protected constructor(model: Model<T>, entityToPopulate?: PopulateOptions) {
    this.model = model;
    this.entityToPopulate = entityToPopulate;
  }
  async create(
    entity: Partial<T>,
    entityToPopulate?: PopulateOptions,
  ): Promise<HydratedDocument<T>> {
    const entityCreated = new this.model(entity) as Document<T>;
    if (entityToPopulate || this?.entityToPopulate)
      await entityCreated.populate(entityToPopulate ?? this?.entityToPopulate);
    await entityCreated.save();
    return entityCreated.toJSON() as HydratedDocument<T>;
  }

  async findAll(
    entity?: Partial<T>,
    entityToPopulate?: PopulateOptions,
  ): Promise<HydratedDocument<T>[]> {
    const sort: { [key: string]: SortOrder } = this.getSortKey(entity);
    const pagination: { [key: string]: number } = this.getPagination(entity);

    const query = this.model
      .find(entity)
      .populate(entityToPopulate ?? this?.entityToPopulate)
      .select((entityToPopulate ?? this?.entityToPopulate)?.select);

    if (sort) query.sort(sort);

    if (pagination) query.skip(pagination?.skip).limit(pagination?.limit);

    return (await query.exec()) as HydratedDocument<T>[];
  }
  private getPagination(entity: Partial<T>) {
    if (entity?.['page'] && entity?.['size']) {
      const [skip, limit] = [+entity['page'], +entity['size']];
      const pagination: { [key: string]: number } = {
        skip,
        limit,
      };
      delete entity['page'];
      delete entity['size'];
      return pagination;
    }
    return {
      skip: 0,
      limit: 10,
    };
  }

  private getSortKey(entity: Partial<T>) {
    let sort: { [key: string]: SortOrder } = { _id: 'asc' };
    if (entity?.['sort']) {
      const [field, order] = entity['sort'].split(',');
      sort = {
        [field]: order,
      };
      delete entity['sort'];
      if (field == 'id') {
        sort = {
          _id: order,
        };
      }
    }
    return sort;
  }

  async findOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T> | null,
    entityToPopulate?: PopulateOptions,
  ): Promise<HydratedDocument<T>> {
    const findEntity = await this.model
      .findOne(filter, update, options)
      .populate(entityToPopulate ?? this?.entityToPopulate)
      .exec();

    return findEntity as HydratedDocument<T>;
  }

  async findById(
    id: string | number | Types.ObjectId,
    entityToPopulate?: PopulateOptions,
  ): Promise<HydratedDocument<T>> {
    const findEntity = await this.model
      .findById(id)
      .populate(entityToPopulate ?? this?.entityToPopulate)
      .exec();
    return findEntity as HydratedDocument<T>;
  }

  async findOneAndUpdate(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T> | null,
    entityToPopulate?: PopulateOptions,
  ): Promise<HydratedDocument<T>> {
    const findEntity = await this.model
      .findOneAndUpdate(
        filter,
        update,
        options ?? {
          new: true,
        },
      )
      .populate(entityToPopulate ?? this?.entityToPopulate)
      .exec();
    return findEntity as HydratedDocument<T>;
  }

  async findOneAndDelete(
    filter?: FilterQuery<T>,
    options?: QueryOptions<T> | null,
    entityToPopulate?: PopulateOptions,
  ): Promise<HydratedDocument<T>> {
    const findEntity = await this.model
      .findOneAndDelete(
        filter,
        options ?? {
          new: true,
        },
      )
      .populate(entityToPopulate ?? this?.entityToPopulate)
      .exec();
    return findEntity as HydratedDocument<T>;
  }

  async countDocuments(entity?: FilterQuery<T>): Promise<number> {
    delete entity['page'];
    delete entity['size'];
    delete entity['sort'];
    const count = await this.model.countDocuments(entity).exec();
    return count;
  }
}
