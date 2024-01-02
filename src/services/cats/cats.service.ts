import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CatDto } from '../../models/cat.dto';
import { CatsRepository } from '../../repository/cats/cats.repository';
import { UsersRepository } from '../../repository/users/users.repository';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { BaseService } from '../base/base.service';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';

@Injectable()
export class CatsService extends BaseService<Cat> {
  constructor(
    private userRepository: UsersRepository,
    public catsRepository: CatsRepository,
    public errorDomainService: ErrorDomainService,
  ) {
    super(catsRepository, errorDomainService);
  }

  async create(catDto: CatDto): Promise<CatDocument> {
    const user = await this.userRepository.findById(catDto.owner);

    if (!user) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um usuário com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
      return;
    }

    if (catDto.age <= 0) {
      this.errorDomainService.addError({
        type: eTypeDomainError.VALIDATION_ERROR,
        message: 'Não foi possivel criar o gato(a) com a idade 0',
      });
      return;
    }
    const cat = await this.catsRepository.findOne({
      $or: [
        { name: catDto.name, breed: catDto.breed },
        { name: catDto.name, breed: catDto.breed, owner: catDto.owner },
        { name: catDto.name, breed: catDto.breed, age: catDto.age },
      ],
    });

    if (cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um gato(a) com essas informações',
      });
      return;
    }
    const createdCat = this.catsRepository.create({
      ...catDto,
    });
    return createdCat;
  }

  async findById(id: string | number | Types.ObjectId): Promise<CatDocument> {
    const cat = await this.catsRepository.findById(id);

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
    const user = await this.userRepository.findById(catDto.owner);

    if (!user) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um usuário com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    const cat = await this.catsRepository.findOneAndUpdate(catDto);

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
    const cat = await this.catsRepository.findOneAndDelete({
      _id: id,
    });

    if (!cat) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    return cat;
  }
}
