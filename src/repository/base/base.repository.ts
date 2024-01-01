import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  PopulateOptions,
  QueryOptions,
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
    const allEntity = await this.model
      .find(entity)
      .populate(entityToPopulate ?? this?.entityToPopulate)
      .select((entityToPopulate ?? this?.entityToPopulate)?.select)
      .exec();
    return allEntity as HydratedDocument<T>[];
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
      .findOneAndUpdate(filter, update, options)
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
      .findOneAndDelete(filter, options)
      .populate(entityToPopulate ?? this?.entityToPopulate)
      .exec();
    return findEntity as HydratedDocument<T>;
  }
}
