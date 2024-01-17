import { HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Types } from 'mongoose';
import * as path from 'path';
import { Calendar, CalendarDTO } from 'src/dtos/calendar';
import { FileDto } from 'src/dtos/file';
import {
  PaginationRequest,
  PaginationResponse,
} from 'src/models/pagination-response';
import { FilesRepository } from 'src/repository/files/files.repository';
import { PetDto } from '../../dtos/pet.dto';
import { PetsRepository } from '../../repository/pets/pets.repository';
import { UsersRepository } from '../../repository/users/users.repository';
import { Pet, PetDocument } from '../../schemas/pets.schema';
import { BaseService } from '../base/base.service';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';

@Injectable()
export class PetsService extends BaseService<Pet> {
  constructor(
    private userRepository: UsersRepository,
    public petsRepository: PetsRepository,
    public filesRepository: FilesRepository,
    public errorDomainService: ErrorDomainService,
  ) {
    super(petsRepository, errorDomainService);
  }

  async searchByField(
    pet?: PaginationRequest<Partial<PetDto>>,
  ): Promise<PaginationResponse<PetDocument>> {
    return await this.petsRepository.searchByField(pet);
  }
  async searchByDate(calendar: CalendarDTO): Promise<Calendar[]> {
    return await this.petsRepository.searchByDate(calendar);
  }

  async createPet(petDto: PetDto, file: FileDto): Promise<PetDocument> {
    const user = await this.userRepository.findById(petDto.owner);

    if (!user) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um usuário com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
      return;
    }

    const fileInserted = await this.filesRepository.create({
      ...file,
      name: this.randomName(),
      buffer: Buffer.from(file.buffer, 'binary').toString('base64'),
    });

    petDto.photoUrl = +fileInserted.id;

    const pet = await this.petsRepository.findOne({
      $or: [
        { name: petDto.name, birthDate: petDto.birthDate, owner: petDto.owner },
      ],
    });
    if (pet) {
      this.errorDomainService.addError({
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um pet com essas informações',
      });
      return;
    }

    const createdPet = await this.petsRepository.create({
      ...petDto,
    });
    return createdPet;
  }

  async findById(id: string | number | Types.ObjectId): Promise<PetDocument> {
    const pet = await this.petsRepository.findById(id);

    if (!pet) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um pet com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    return pet;
  }
  async updatePet(petDto: PetDto, file: any): Promise<PetDocument> {
    const user = await this.userRepository.findById(petDto.owner);

    if (!user) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um usuário com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    const pet = await this.petsRepository.findOneAndUpdate(petDto);

    if (!pet) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um pet com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    await this.filesRepository.findOneAndUpdate(
      {
        _id: pet.photoUrl,
      },
      {
        mimetype: file.mimetype,
        size: file.size,
        name: this.randomName(),
        buffer: Buffer.from(file.buffer, 'binary').toString('base64'),
      },
    );

    return pet;
  }
  async removeById(id: string | number | Types.ObjectId): Promise<PetDocument> {
    const pet = await this.petsRepository.findOneAndDelete({
      _id: id,
    });

    if (!pet) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um pet com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    await this.filesRepository.findOneAndDelete({
      _id: pet.photoUrl,
    });

    const uploadsPath = path.join(
      __dirname,
      '../..',
      'uploads',
      pet.photoUrl.toString(),
    );

    fs.unlinkSync(uploadsPath);

    return pet;
  }

  async getImage(id: string): Promise<any> {
    const file = await this.filesRepository.findById(id);

    if (!file) {
      this.errorDomainService.addError({
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um arquivo com esse id',
      });
      this.errorDomainService.statusCode = HttpStatus.NOT_FOUND;
    }

    if (file) {
      const uploadsPath = path.join(__dirname, '../..', 'uploads');

      if (!fs.existsSync(uploadsPath))
        fs.mkdirSync(uploadsPath, { recursive: true });

      fs.writeFileSync(uploadsPath + `/${id}`, file.buffer, 'base64');
    }

    return file;
  }
  randomName() {
    return Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
  }
}
