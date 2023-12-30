import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { likeOperator } from '../../helpers/like';
import { CreateCatDto } from '../../models/create-cat.dto';
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

  async create(createCatDto: CreateCatDto): Promise<CatDocument> {
    if (createCatDto.age <= 0) {
      this.errorDomainService.addError({
        type: eTypeDomainError.VALIDATION_ERROR,
        message: 'Não foi possivel criar o gato(a) com a idade 0',
      });
      return;
    }
    const createdCat = new this.catModel(createCatDto);

    const cat = await this.catModel
      .findOne({
        ...createCatDto,
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
  async findAll(createCatDto?: Partial<CreateCatDto>): Promise<CatDocument[]> {
    const cats = await this.catModel
      .find({
        ...createCatDto,
        ...likeOperator(createCatDto, 'name'),
        ...likeOperator(createCatDto, 'breed'),
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
