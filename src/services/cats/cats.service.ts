import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { likeOperator } from 'src/helpers/like';
import { CreateCatDto } from '../../models/create-cat.dto';
import { Cat } from '../../schemas/cat.schema';
import { ErrorDomainService } from '../log/error-domain.service';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<Cat>,
    private errorDomainService: ErrorDomainService,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);

    if (createCatDto.age <= 0) {
      this.errorDomainService.addError(
        'Não foi possivel criar o gato(a) com a idade 0',
      );
      return;
    }

    const hasCat = this.catModel
      .findOne({
        ...createCatDto,
      })
      .exec();

    if (await hasCat) {
      this.errorDomainService.addError(
        'Já existe um gato(a) com essas informações',
      );
      return;
    }

    return createdCat.save();
  }

  findById(id: number): Promise<Cat> {
    return this.catModel.findById(id).exec();
  }
  findAll(createCatDto?: Partial<CreateCatDto>): Promise<Cat[]> {
    return this.catModel
      .find({
        ...createCatDto,
        ...likeOperator(createCatDto, 'name'),
        ...likeOperator(createCatDto, 'breed'),
      })
      .exec();
  }
}
