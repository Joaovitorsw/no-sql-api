import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCatDto } from 'src/models/create-cat.dto';
import { Cat } from '../../schemas/cat.schema';
import { ErrorDomainService } from '../log/error-domain.service';
import { CatsService } from './cats.service';

class CatModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static create = jest.fn();
  static exec = jest.fn();
  static find = jest.fn();
  static findOne = jest.fn();
}
describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    jest.spyOn(CatModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
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
    const catDto: CreateCatDto = { name: 'Test', age: 1, breed: 'Breed' };

    jest.spyOn(CatModel, 'create').mockImplementationOnce(() => ({
      ...catDto,
      save: jest.fn().mockResolvedValue(catDto),
    }));

    const result = await service.create(catDto);
    expect(result).toEqual(catDto);
  });

  it('should return an array of cats', async () => {
    const mockCats = [{ name: 'Test', age: 1, breed: 'Breed' }];

    jest.spyOn(CatModel, 'find').mockReturnThis();
    jest.spyOn(CatModel, 'exec').mockResolvedValueOnce(mockCats);

    const result = await service.findAll();
    expect(result).toEqual(mockCats);
  });
});
