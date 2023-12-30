import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CatDto } from '../../models/cat.dto';
import { Cat } from '../../schemas/cat.schema';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../log/error-domain.service';
import { CatsService } from './cats.service';

class CatModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static create = jest.fn();
  static exec = jest.fn();
  static find = jest.fn();
  static findOne = jest.fn();
  static findById = jest.fn();
}
describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        ErrorDomainService,
        {
          provide: getModelToken(Cat.name),
          useValue: CatModel,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should create a new cat', async () => {
    const catDto: CatDto = {
      name: 'Test',
      age: 1,
      breed: 'Breed',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    jest.spyOn(CatModel, 'create').mockImplementationOnce(() => ({
      ...catDto,
      save: jest.fn().mockResolvedValue(catDto),
    }));
    jest.spyOn(CatModel, 'findOne').mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
    const result = await service.create(catDto);
    expect(result).toEqual(catDto);
  });
  it('should return domain validation VALIDATION_ERROR', async () => {
    const catDto: CatDto = {
      name: 'Test',
      age: 0,
      breed: 'Breed',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    await service.create(catDto);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.VALIDATION_ERROR,
        message: 'Não foi possivel criar o gato(a) com a idade 0',
      },
    ]);
  });
  it('should return domain validation ALREADY_EXISTS', async () => {
    const catDto: CatDto = {
      name: 'Test',
      age: 15,
      breed: 'Breed',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    jest.spyOn(CatModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue({
        _id: new Types.ObjectId('6590214c754d1e36278d8553'),
        name: 'Test',
        age: 15,
        breed: 'Breed',
        __v: 0,
      }),
    }));

    await service.create(catDto);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um gato(a) com essas informações',
      },
    ]);
  });

  it('should return by id of cats', async () => {
    const mockCat = {
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      name: 'Test',
      age: 15,
      breed: 'Breed',
      __v: 0,
    };

    jest.spyOn(CatModel, 'findById').mockReturnThis();
    jest.spyOn(CatModel, 'exec').mockResolvedValueOnce(mockCat);

    const result = await service.findById(mockCat._id);
    expect(result).toEqual(mockCat);
  });
  it('should return empty by id of cats', async () => {
    const mockCat = {
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      name: 'Test',
      age: 15,
      breed: 'Breed',
      __v: 0,
    };

    jest.spyOn(CatModel, 'findById').mockReturnThis();
    jest.spyOn(CatModel, 'exec').mockResolvedValueOnce(null);

    await service.findById(mockCat._id);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      },
    ]);
  });
  it('should return an array of cats', async () => {
    const mockCats = [{ name: 'Test', age: 1, breed: 'Breed' }];

    jest.spyOn(CatModel, 'find').mockReturnThis();
    jest.spyOn(CatModel, 'exec').mockResolvedValueOnce(mockCats);

    const result = await service.findAll();
    expect(result).toEqual(mockCats);
  });
  it('should return an empty array of cats', async () => {
    const mockCats = [];

    jest.spyOn(CatModel, 'find').mockReturnThis();
    jest.spyOn(CatModel, 'exec').mockResolvedValueOnce(mockCats);

    await service.findAll();
    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe nenhum gato(a) com essas informações',
      },
    ]);
  });
});
