import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { like } from '../../helpers/like';
import { CatDto } from '../../models/cat.dto';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class CatsRepository extends BaseRepository<Cat> {
  constructor(@InjectModel(Cat.name) public catModel: Model<Cat>) {
    super(catModel);
  }

  async create(catDto: CatDto): Promise<CatDocument> {
    const cat = await super.create(catDto);
    await cat.populate('owner', '-password -__v');
    return cat.toObject();
  }

  async findAll(catDto?: Partial<CatDto>): Promise<CatDocument[]> {
    const cats = await super.findAll(
      {
        ...catDto,
        ...like(catDto, 'name'),
        ...like(catDto, 'breed'),
      },
      'owner',
      '-password -__v',
    );

    return cats;
  }
  async findOne(filter?: FilterQuery<Cat>): Promise<CatDocument> {
    const cats = await super.findOne(filter, {}, {}, 'owner', '-password -__v');
    return cats;
  }
  async findOneAndUpdate(catDto: CatDto): Promise<CatDocument> {
    const cats = await super.findOneAndUpdate(
      {
        _id: catDto._id,
      },
      {
        ...catDto,
      },
      {
        new: true,
      },
      'owner',
      '-password -__v',
    );

    return cats;
  }
  async findOneAndDelete(predicate: FilterQuery<Cat>): Promise<CatDocument> {
    const cats = await super.findOneAndDelete(
      predicate,
      {},
      'owner',
      '-password -__v',
    );
    return cats;
  }

  async findById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await super.findById(id, 'owner', '-password -__v');
    return cat;
  }
}