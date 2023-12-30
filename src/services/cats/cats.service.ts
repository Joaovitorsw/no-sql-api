import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { likeOperator } from '../../helpers/like';
import { CatDto } from '../../models/cat.dto';
import { Cat, CatDocument } from '../../schemas/cat.schema';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../log/error-domain.service';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<Cat>,
    private errorDomainService: ErrorDomainService,
  ) {}

  async create(catDto: CatDto): Promise<CatDocument> {
    if (catDto.age <= 0) {
      this.errorDomainService.addError({
        type: eTypeDomainError.VALIDATION_ERROR,
        message: 'Não foi possivel criar o gato(a) com a idade 0',
      });
      return;
    }
    const createdCat = new this.catModel({
      ...catDto,
      createAt: new Date().toISOString(),
    });

    const cat = await this.catModel
      .findOne({
        $or: [
          { name: catDto.name },
          { name: catDto.name, breed: catDto.breed },
          { name: catDto.name, breed: catDto.breed, age: catDto.age },
        ],
      })
      .exec();

    if (cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um gato(a) com essas informações',
      });
      return;
    }

    return createdCat.save();
  }

  async findById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await this.catModel.findById(id).exec();

    if (!cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      });
    }

    return cat;
  }
  async update(catDto: CatDto): Promise<CatDocument> {
    const cat = await this.catModel
      .findOneAndUpdate(
        {
          _id: catDto._id,
        },
        {
          ...catDto,
          updateAt: new Date().toISOString(),
        },
        {
          new: true,
        },
      )
      .exec();

    if (!cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      });
    }

    return cat;
  }
  async removeById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await this.catModel
      .findOneAndDelete({
        _id: id,
      })
      .exec();

    if (!cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      });
    }

    return cat;
  }
  async findAll(CatDto?: Partial<CatDto>): Promise<CatDocument[]> {
    const cats = await this.catModel
      .find({
        ...CatDto,
        ...likeOperator(CatDto, 'name'),
        ...likeOperator(CatDto, 'breed'),
      })
      .exec();

    if (cats.length === 0) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe nenhum gato(a) com essas informações',
      });
    }

    return cats;
  }
}
