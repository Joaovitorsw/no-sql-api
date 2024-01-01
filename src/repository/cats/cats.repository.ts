import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { like } from '../../helpers/like';
import { CatDto } from '../../models/cat.dto';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class CatsRepository extends BaseRepository<Cat> {
  populationObject = {
    path: 'owner',
    select: '-password',
    populate: {
      path: 'role',
    },
  };
  constructor(@InjectModel(Cat.name) public catModel: Model<Cat>) {
    super(catModel);
  }

  async create(catDto: CatDto): Promise<CatDocument> {
    const cat = await super.create(catDto, this.populationObject);
    return cat;
  }

  async findAll(catDto?: Partial<CatDto>): Promise<CatDocument[]> {
    const cats = await super.findAll(
      {
        ...catDto,
        ...like(catDto, 'name'),
        ...like(catDto, 'breed'),
      },
      this.populationObject,
    );

    return cats;
  }
  async findOne(filter?: FilterQuery<Cat>): Promise<CatDocument> {
    const cats = await super.findOne(filter, {}, {}, this.populationObject);
    return cats;
  }
  async findOneAndUpdate(catDto: CatDto): Promise<CatDocument> {
    const cats = await super.findOneAndUpdate(
      {
        _id: catDto['id'],
      },
      {
        ...catDto,
      },
      {
        new: true,
      },
      this.populationObject,
    );

    return cats;
  }
  async findOneAndDelete(predicate: FilterQuery<Cat>): Promise<CatDocument> {
    const cats = await super.findOneAndDelete(
      predicate,
      {},
      this.populationObject,
    );
    return cats;
  }

  async findById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await super.findById(id, this.populationObject);
    return cat;
  }
}
