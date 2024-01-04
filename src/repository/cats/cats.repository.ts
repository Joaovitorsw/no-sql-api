import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CatDto } from '../../models/cat.dto';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { BaseRepository } from '../base/base.repository';

const POPULATION_OBJECT = {
  path: 'owner',
  select: '-password',
  populate: {
    path: 'role',
  },
};
@Injectable()
export class CatsRepository extends BaseRepository<Cat> {
  constructor(@InjectModel(Cat.name) public catModel: Model<Cat>) {
    super(catModel, POPULATION_OBJECT);
  }

  async create(catDto: CatDto): Promise<CatDocument> {
    const cat = await super.create(catDto, POPULATION_OBJECT);
    return cat;
  }

  async findOneAndUpdate(catDto: CatDto): Promise<CatDocument> {
    const cats = await super.findOneAndUpdate(
      {
        _id: +catDto['id'],
      },
      {
        ...catDto,
      },
      {
        new: true,
      },
      POPULATION_OBJECT,
    );
    return cats;
  }
  async findOneAndDelete(predicate: FilterQuery<Cat>): Promise<CatDocument> {
    const cats = await super.findOneAndDelete(predicate, {}, POPULATION_OBJECT);
    return cats;
  }

  async findById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await super.findById(id, POPULATION_OBJECT);
    return cat;
  }
}
