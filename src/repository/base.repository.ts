import { Model, Types } from 'mongoose';

export class BaseRepository<T> {
  protected model: Model<T>;
  protected constructor(model: Model<T>) {
    this.model = model;
  }

  async create(entity: Partial<T>): Promise<T> {
    const entityCreated = new this.model(entity);
    entityCreated.save();
    return entityCreated;
  }

  async findById(id: string | number | Types.ObjectId): Promise<T> {
    const entity = await this.model.findById(id).exec();
    return entity;
  }
  async update(entity: T): Promise<T> {
    const entityUpdated = await this.model
      .findOneAndUpdate(
        {
          _id: entity['_id'],
        },
        {
          ...entity,
        },
        {
          new: true,
        },
      )
      .exec();

    return entityUpdated;
  }
  async removeById(id: string | number | Types.ObjectId): Promise<T> {
    const entity = await this.model
      .findOneAndDelete({
        _id: id,
      })
      .exec();

    return entity;
  }
  async findAll(): Promise<T[]> {
    const entity = await this.model.find().exec();

    return entity;
  }
}
