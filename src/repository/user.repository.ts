import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) public userModel: Model<User>) {
    super(userModel);
  }
  async findAll(
    entity?: Partial<User>,
    fields?: string,
  ): Promise<HydratedDocument<User>[]> {
    const users = await this.model.find(entity).select(fields).exec();
    return users;
  }

  async findOne(predicate: FilterQuery<User>): Promise<UserDocument> {
    const user = await super.findOne(predicate);
    return user?.toObject({
      transform(_, ret) {
        delete ret?.__v;
        return ret;
      },
    });
  }
}
