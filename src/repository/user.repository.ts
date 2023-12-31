import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserDto } from 'src/models/user.dto';
import { User, UserDocument } from 'src/schemas/users.schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  async create(userDto: UserDto): Promise<UserDocument> {
    const createdUser = new this.userModel({
      ...userDto,
    });

    createdUser.save();
    return createdUser;
  }

  async findById(id: string | number | Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();

    return user;
  }
  async update(userDto: UserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          _id: userDto._id,
        },
        {
          ...userDto,
        },
        {
          new: true,
        },
      )
      .exec();

    return user;
  }
  async removeById(
    id: string | number | Types.ObjectId,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndDelete({
        _id: id,
      })
      .exec();

    return user;
  }
  async findAll(userDto?: Partial<UserDto>): Promise<UserDocument[]> {
    const users = await this.userModel
      .find({
        ...userDto,
      })
      .exec();

    return users;
  }
  async findOne(predicate: any): Promise<UserDocument> {
    const user = await this.userModel.findOne(predicate).exec();

    return user.toObject({
      transform(_, ret) {
        delete ret.__v;
        return ret;
      },
    });
  }
  async findOneAndUpdate(...predicate: any): Promise<UserDocument> {
    const users = await this.userModel.findOneAndUpdate(predicate).exec();

    return users;
  }
  async findOneAndDelete(...predicate: any): Promise<UserDocument> {
    const users = await this.userModel.findOneAndDelete(predicate).exec();

    return users;
  }
}
