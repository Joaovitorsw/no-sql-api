import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/users.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) public userModel: Model<User>) {
    super(userModel, {
      path: 'roleID',
      select: '-password',
    });
  }
}
