import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { like } from 'src/helpers/like';
import { CatDto } from 'src/models/cat.dto';
import { Cat, CatDocument } from 'src/schemas/cats.schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class CatsRepository extends BaseRepository<Cat> {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {
    super(catModel);
  }

  async create(catDto: CatDto): Promise<CatDocument> {
    const createdCat = new this.catModel({
      ...catDto,
    });

    createdCat.save();
    return createdCat.populate('owner', '-password -__v');
  }

  async findById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await this.catModel
      .findById(id)
      .populate('owner', '-password -__v')
      .exec();

    return cat;
  }
  async update(catDto: CatDto): Promise<CatDocument> {
    catDto.updateAt = new Date().toISOString();
    delete catDto.createAt;
    const cat = await this.catModel
      .findOneAndUpdate(
        {
          _id: catDto._id,
        },
        {
          ...catDto,
        },
        {
          new: true,
        },
      )
      .populate('owner', '-password -__v')
      .exec();

    return cat;
  }
  async removeById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await this.catModel
      .findOneAndDelete({
        _id: id,
      })
      .populate('owner', '-password -__v')
      .exec();

    return cat;
  }
  async findAll(catDto?: Partial<CatDto>): Promise<CatDocument[]> {
    const cats = await this.catModel
      .find({
        ...catDto,
        ...like(catDto, 'name'),
        ...like(catDto, 'breed'),
      })
      .populate('owner', '-password -__v')
      .exec();

    return cats;
  }
  async findOne(predicate: any): Promise<CatDocument> {
    const cats = await this.catModel
      .findOne(predicate)
      .populate('owner', '-password -__v')
      .exec();

    return cats;
  }
  async findOneAndUpdate(...predicate: any): Promise<CatDocument> {
    const cats = await this.catModel
      .findOneAndUpdate(predicate)
      .populate('owner', '-password -__v')
      .exec();

    return cats;
  }
  async findOneAndDelete(...predicate: any): Promise<CatDocument> {
    const cats = await this.catModel
      .findOneAndDelete(predicate)
      .populate('owner', '-password -__v')
      .exec();

    return cats;
  }
}
