import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles } from '../../schemas/roles.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class RolesRepository extends BaseRepository<Roles> {
  constructor(@InjectModel(Roles.name) public userModel: Model<Roles>) {
    super(userModel);
  }
}
