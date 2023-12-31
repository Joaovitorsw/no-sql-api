import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserDto } from 'src/models/user.dto';
import { User, UserDocument } from 'src/schemas/users.schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  async update(userDto: UserDto): Promise<UserDocument> {
    const user = super.findOneAndUpdate(
      {
        _id: userDto._id,
      },
      {
        ...userDto,
      },
      {
        new: true,
      },
    );

    return user;
  }

  async findOne(predicate: FilterQuery<User>): Promise<UserDocument> {
    const user = await super.findOne(predicate);
    return user.toObject({
      transform(_, ret) {
        delete ret.__v;
        return ret;
      },
    });
  }
}
