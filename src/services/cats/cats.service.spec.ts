import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CatDto } from '../../models/cat.dto';
import { CatsRepository } from '../../repository/cats/cats.repository';
import { UsersRepository } from '../../repository/users/users.repository';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { User } from '../../schemas/users.schema';
import { UserModel } from '../auth/auth.service.spec';
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
  static findOneAndUpdate = jest.fn();
  static findOneAndDelete = jest.fn();
  static countDocuments = jest.fn();
  static findById = jest.fn();
  toObject = jest
    .fn()
    .mockImplementation(
      (param: any) => param?.transform(0, this.data) ?? this.data,
    );
  toJSON = jest
    .fn()
    .mockImplementation(
      (param: any) => param?.transform(0, this.data) ?? this.data,
    );
}
describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        ErrorDomainService,
        CatsRepository,
        UsersRepository,
        {
          provide: getModelToken(Cat.name),
          useValue: CatModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should create a new cat', async () => {
    const catDto: CatDto = {
      name: 'Test',
      photoUrl: 'Breed',
      birthDate: new Date(),
      owner: 1,
    };

    jest.spyOn(CatModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          };
        }),
      };
    });
    jest.spyOn(CatModel, 'create').mockImplementationOnce(() => ({
      save: jest.fn(),
      toObject: jest.fn().mockImplementationOnce(() => catDto),
      populate: jest.fn(),
    }));
    jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue({
              id: 1,
              username: 'guto',
              email: 'guto@gmail.com',
            }),
          };
        }),
      };
    });

    const result = await service.createCat(catDto, {
      path: 'uploads\\teste.jpg',
    });
    expect(result).toEqual(catDto);
  });
  it('should validation empty user when create a new cat', async () => {
    const catDto: CatDto = {
      name: 'Test',
      photoUrl: 'Breed',
      birthDate: new Date(),
      owner: 32,
    };

    jest.spyOn(CatModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          };
        }),
      };
    });
    jest.spyOn(CatModel, 'create').mockImplementationOnce(() => ({
      save: jest.fn(),
      toJSON: jest.fn().mockImplementationOnce(() => catDto),
      populate: jest.fn(),
    }));
    jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          };
        }),
      };
    });

    await service.createCat(catDto, {});
    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um usuário com esse id',
      },
    ]);
  });

  it('should return domain validation ALREADY_EXISTS', async () => {
    const catDto: CatDto = {
      id: 1,
      name: 'Test',
      birthDate: new Date(),
      photoUrl: 'N/A',
      owner: 1,
    };
    jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue({
              id: 1,
              username: 'Giselida',
              email: 'giselidac@gmail.com',
            }),
          };
        }),
      };
    });
    jest.spyOn(service['catsRepository'], 'findOne').mockResolvedValueOnce({
      id: 1,
      name: 'Test',
      birthDate: new Date(),
      photoUrl: 'N/A',
      owner: 1,
    } as CatDocument);

    await service.createCat(catDto, {});

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um gato(a) com essas informações',
      },
    ]);
  });

  it('should return by id of cats', async () => {
    const mockCat = {
      id: 1,
      name: 'Kiara',
      birthDate: '2023-12-31T16:52:41.943Z',
      photoUrl: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        id: 1,
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

    const result = await service.findById(mockCat.id);
    expect(result).toEqual(mockCat);
  });
  it('should return empty by id of cats', async () => {
    const mockCat = {
      id: 1,
      name: 'Kiara',
      age: 1.2,
      photoUrl: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        id: 1,
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

    await service.findById(mockCat.id);

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
        id: 1,
        birthDate: '2023-12-31T16:52:41.943Z',
        createAt: '2023-12-31T16:52:41.943Z',
        name: 'Kiara',
        owner: {
          id: 1,
          email: 'giselidac@gmail.com',
          username: 'Giselida',
        },
        photoUrl: 'N/A',
        updateAt: '2023-12-31T16:52:41.943Z',
      },
    ];

    jest.spyOn(CatModel, 'countDocuments').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockCats.length),
    });
    jest.spyOn(CatModel, 'find').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          select: jest.fn().mockImplementationOnce(() => {
            return {
              exec: jest.fn().mockImplementationOnce(() => mockCats),
              sort: jest.fn().mockImplementationOnce(() => mockCats),
              skip: jest.fn().mockImplementationOnce(() => {
                return {
                  limit: jest.fn().mockImplementationOnce(() => mockCats),
                };
              }),
            };
          }),
        };
      }),
    });

    const result = await service.findAll();
    expect(result).toEqual({
      items: mockCats,
      page: 0,
      size: 10,
      total: 1,
    });
  });
  it('should return an empty array of cats', async () => {
    const mockCats = [];
    jest.spyOn(CatModel, 'countDocuments').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockCats.length),
    });
    jest.spyOn(CatModel, 'find').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          select: jest.fn().mockImplementationOnce(() => {
            return {
              exec: jest.fn().mockImplementationOnce(() => mockCats),
              sort: jest.fn().mockImplementationOnce(() => mockCats),
              skip: jest.fn().mockImplementationOnce(() => {
                return {
                  limit: jest.fn().mockImplementationOnce(() => mockCats),
                };
              }),
            };
          }),
        };
      }),
    });

    await service.findAll();
    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe nenhum registro com essas informações',
      },
    ]);
  });

  it('should update a cat', async () => {
    const catDto: CatDto = {
      id: 1,
      name: 'Test',
      photoUrl: 'Breed',
      birthDate: new Date(),
      owner: 1,
    };
    jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue({
              id: 1,
              username: 'guto',
              email: 'guto@gmail.com',
            }),
          };
        }),
      };
    });

    jest.spyOn(CatModel, 'findOneAndUpdate').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...catDto,
          exec: jest.fn().mockImplementationOnce(() => catDto),
        };
      }),
    });

    const result = await service.updateCat(catDto, {
      path: 'uploads\\teste.jpg',
    });
    expect(result).toEqual(catDto);
  });
  it('should update errorDomainService a NOT_FOUND cat', async () => {
    const catDto: CatDto = {
      id: 1,
      name: 'Test',
      birthDate: new Date(),
      photoUrl: 'Breed',
      owner: 1,
    };
    jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          };
        }),
      };
    });
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
      id: 1,
      name: 'Kiara',
      age: 1.2,
      photoUrl: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        id: 1,
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

    const result = await service.removeById(mockCat.id);

    expect(result).toEqual(mockCat);
  });

  it('should remove errorDomainService a NOT_FOUND cat', async () => {
    const mockCat = {
      id: 1,
      name: 'Kiara',
      age: 1.2,
      photoUrl: 'N/A',
      createAt: '2023-12-31T16:52:41.943Z',
      updateAt: '2023-12-31T16:52:41.943Z',
      owner: {
        id: 1,
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

    const result = await service.removeById(mockCat.id);

    expect(result).toBeNull();
  });
});
