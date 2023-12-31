import {
  FilterQuery,
  HydratedDocument,
  Model,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
export type DocumentType<T> = T & Document;
export class BaseRepository<T> {
  protected model: Model<T>;
  protected constructor(model: Model<T>) {
    this.model = model;
  }

  async create(entity: Partial<T>): Promise<HydratedDocument<T>> {
    const entityCreated = new this.model(entity);
    entityCreated.save();
    return entityCreated;
  }
  async findAll(
    entity?: Partial<T>,
    ...entityToPopulate: string[]
  ): Promise<HydratedDocument<T>[]> {
    const allEntity = await this.model
      .find(entity)
      .populate(entityToPopulate[0], entityToPopulate[1])
      .exec();
    return allEntity as HydratedDocument<T>[];
  }
  async findOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T> | null,
    ...entityToPopulate: string[]
  ): Promise<HydratedDocument<T>> {
    const allEntity = await this.model
      .findOne(filter, update, options)
      .populate(entityToPopulate[0], entityToPopulate[1])
      .exec();

    return allEntity as HydratedDocument<T>;
  }

  async findById(
    id: string | number | Types.ObjectId,
    ...entityToPopulate: string[]
  ): Promise<HydratedDocument<T>> {
    const allEntity = await this.model
      .findById(id)
      .populate(entityToPopulate[0], entityToPopulate[1])
      .exec();
    return allEntity as HydratedDocument<T>;
  }

  async findOneAndUpdate(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T> | null,
    ...entityToPopulate: string[]
  ): Promise<HydratedDocument<T>> {
    const allEntity = await this.model
      .findOneAndUpdate(filter, update, options)
      .populate(entityToPopulate[0], entityToPopulate[1])
      .exec();
    return allEntity as HydratedDocument<T>;
  }
  async findOneAndDelete(
    filter?: FilterQuery<T>,
    options?: QueryOptions<T> | null,
    ...entityToPopulate: string[]
  ): Promise<HydratedDocument<T>> {
    const allEntity = await this.model
      .findOneAndDelete(filter, options)
      .populate(entityToPopulate[0], entityToPopulate[1])
      .exec();
    return allEntity as HydratedDocument<T>;
  }
}
