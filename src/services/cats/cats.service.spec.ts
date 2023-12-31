import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CatDto } from '../../models/cat.dto';
import { Cat } from '../../schemas/cats.schema';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';
import { CatsService } from './cats.service';

class CatModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static create = jest.fn();
  static exec = jest.fn();
  populate = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn();
  static findOne = jest.fn();
  static findById = jest.fn();
  static findOneAndUpdate = jest.fn();
  static findOneAndDelete = jest.fn();
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
      owner: '6590214c754d1e36278d8553',
    };

    jest.spyOn(CatModel, 'create').mockImplementationOnce(() => ({
      ...catDto,
      save: jest.fn().mockResolvedValue(catDto),
      populate: jest.fn().mockImplementationOnce(() => catDto),
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
      owner: '6590214c754d1e36278d8553',
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
      owner: '6590214c754d1e36278d8553',
    };

    jest.spyOn(CatModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue({
        _id: new Types.ObjectId('6590214c754d1e36278d8553'),
        name: 'Kiara',
        age: 1.2,
        breed: 'N/A',
        createAt: '2023-12-31T16:52:41.943Z',
        updateAt: '2023-12-31T16:52:41.943Z',
        owner: {
          _id: '6591a191ae3c5b621d1e6a38',
          username: 'Giselida',
          email: 'giselidac@gmail.com',
        },
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
      name: 'Kiara',
      age: 1.2,
      breed: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        _id: '6591a191ae3c5b621d1e6a38',
        username: 'Giselida',
        email: 'giselidac@gmail.com',
      },
    };

    jest.spyOn(CatModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockCat,
          exec: jest.fn().mockImplementationOnce(() => mockCat),
        };
      }),
    });

    const result = await service.findById(mockCat._id);
    expect(result).toEqual(mockCat);
  });
  it('should return empty by id of cats', async () => {
    const mockCat = {
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      name: 'Kiara',
      age: 1.2,
      breed: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        _id: '6591a191ae3c5b621d1e6a38',
        username: 'Giselida',
        email: 'giselidac@gmail.com',
      },
    };

    jest.spyOn(CatModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockCat,
          exec: jest.fn().mockImplementationOnce(() => null),
        };
      }),
    });

    await service.findById(mockCat._id);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um gato(a) com esse id',
      },
    ]);
  });
  it('should return an array of cats', async () => {
    const mockCats = [
      {
        _id: '6591a197ae3c5b621d1e6a3b',
        name: 'Kiara',
        age: 1.2,
        breed: 'N/A',
        createAt: '2023-12-31T16:52:41.943Z',
        updateAt: '2023-12-31T16:52:41.943Z',
        owner: {
          _id: '6591a191ae3c5b621d1e6a38',
          username: 'Giselida',
          email: 'giselidac@gmail.com',
        },
      },
    ];

    jest.spyOn(CatModel, 'find').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockCats,
          exec: jest.fn().mockImplementationOnce(() => mockCats),
        };
      }),
    });

    const result = await service.findAll();
    expect(result).toEqual(mockCats);
  });
  it('should return an empty array of cats', async () => {
    const mockCats = [];

    jest.spyOn(CatModel, 'find').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockCats,
          exec: jest.fn().mockImplementationOnce(() => mockCats),
        };
      }),
    });

    await service.findAll();
    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe nenhum gato(a) com essas informações',
      },
    ]);
  });

  it('should update a cat', async () => {
    const catDto: CatDto = {
      _id: '6590214c754d1e36278d8553',
      name: 'Test',
      age: 1,
      breed: 'Breed',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      owner: '6590214c754d1e36278d8553',
    };

    jest.spyOn(CatModel, 'findOneAndUpdate').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...catDto,
          exec: jest.fn().mockImplementationOnce(() => catDto),
        };
      }),
    });

    const result = await service.update(catDto);
    expect(result).toEqual(catDto);
  });
  it('should update errorDomainService a NOT_FOUND cat', async () => {
    const catDto: CatDto = {
      _id: '6590214c754d1e36278d8553',
      name: 'Test',
      age: 1,
      breed: 'Breed',
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      owner: '6590214c754d1e36278d8553',
    };

    jest.spyOn(CatModel, 'findOneAndUpdate').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockImplementationOnce(() => null),
        };
      }),
    });

    const result = await service.update(catDto);
    expect(result).toBeNull();
  });

  it('should remove a cat', async () => {
    const mockCat = {
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      name: 'Kiara',
      age: 1.2,
      breed: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        _id: '6591a191ae3c5b621d1e6a38',
        username: 'Giselida',
        email: '',
      },
    };

    jest.spyOn(CatModel, 'findOneAndDelete').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockCat,
          exec: jest.fn().mockImplementationOnce(() => mockCat),
        };
      }),
    });

    const result = await service.removeById(mockCat._id);

    expect(result).toEqual(mockCat);
  });

  it('should remove errorDomainService a NOT_FOUND cat', async () => {
    const mockCat = {
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      name: 'Kiara',
      age: 1.2,
      breed: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        _id: '6591a191ae3c5b621d1e6a38',
        username: 'Giselida',
        email: '',
      },
    };

    jest.spyOn(CatModel, 'findOneAndDelete').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockCat,
          exec: jest.fn().mockImplementationOnce(() => null),
        };
      }),
    });

    const result = await service.removeById(mockCat._id);

    expect(result).toBeNull();
  });
});
