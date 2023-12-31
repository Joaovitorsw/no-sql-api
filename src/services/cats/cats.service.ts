import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { like } from '../../helpers/like';
import { CatDto } from '../../models/cat.dto';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';

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
    });

    const cat = await this.catModel
      .findOne({
        $or: [
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

    createdCat.save();
    return createdCat.populate('owner', '-password -__v');
  }

  async findById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await this.catModel
      .findById(id)
      .populate('owner', '-password -__v')
      .exec();

    if (!cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

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

    if (!cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    return cat;
  }
  async removeById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await this.catModel
      .findOneAndDelete({
        _id: id,
      })
      .populate('owner', '-password -__v')
      .exec();

    if (!cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

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

    if (cats.length === 0) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe nenhum gato(a) com essas informações',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    return cats;
  }
}
