import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PetDto } from '../../dtos/pet.dto';
import { PetsRepository } from '../../repository/pets/pets.repository';
import { UsersRepository } from '../../repository/users/users.repository';
import { Pet, PetDocument } from '../../schemas/pets.schema';
import { User } from '../../schemas/users.schema';
import { UserModel } from '../auth/auth.service.spec';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';
import { PetsService } from './pets.service';

class PetModel {
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
describe('PetsService', () => {
  let service: PetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        ErrorDomainService,
        PetsRepository,
        UsersRepository,
        {
          provide: getModelToken(Pet.name),
          useValue: PetModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  it('should create a new pet', async () => {
    const petDto: PetDto = {
      name: 'Test',
      photoUrl: 'Breed',
      birthDate: new Date(),
      owner: 1,
    };

    jest.spyOn(PetModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          };
        }),
      };
    });
    jest.spyOn(PetModel, 'create').mockImplementationOnce(() => ({
      save: jest.fn(),
      toObject: jest.fn().mockImplementationOnce(() => petDto),
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

    const result = await service.createPet(petDto, {
      path: 'uploads\\teste.jpg',
    });
    expect(result).toEqual(petDto);
  });
  it('should validation empty user when create a new pet', async () => {
    const petDto: PetDto = {
      name: 'Test',
      photoUrl: 'Breed',
      birthDate: new Date(),
      owner: 32,
    };

    jest.spyOn(PetModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          };
        }),
      };
    });
    jest.spyOn(PetModel, 'create').mockImplementationOnce(() => ({
      save: jest.fn(),
      toJSON: jest.fn().mockImplementationOnce(() => petDto),
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

    await service.createPet(petDto, {});
    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um usuário com esse id',
      },
    ]);
  });

  it('should return domain validation ALREADY_EXISTS', async () => {
    const petDto: PetDto = {
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
    jest.spyOn(service['petsRepository'], 'findOne').mockResolvedValueOnce({
      id: 1,
      name: 'Test',
      birthDate: new Date(),
      photoUrl: 'N/A',
      owner: 1,
    } as PetDocument);

    await service.createPet(petDto, {});

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um pet com essas informações',
      },
    ]);
  });

  it('should return by id of pets', async () => {
    const mockPet = {
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

    jest.spyOn(PetModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockPet,
          exec: jest.fn().mockImplementationOnce(() => mockPet),
        };
      }),
    });

    const result = await service.findById(mockPet.id);
    expect(result).toEqual(mockPet);
  });
  it('should return empty by id of pets', async () => {
    const mockPet = {
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

    jest.spyOn(PetModel, 'findById').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockPet,
          exec: jest.fn().mockImplementationOnce(() => null),
        };
      }),
    });

    await service.findById(mockPet.id);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.NOT_FOUND,
        message: 'Não existe um pet com esse id',
      },
    ]);
  });
  it('should return an array of pets', async () => {
    const mockPets = [
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

    jest.spyOn(PetModel, 'countDocuments').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockPets.length),
    });
    jest.spyOn(PetModel, 'find').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          select: jest.fn().mockImplementationOnce(() => {
            return {
              exec: jest.fn().mockImplementationOnce(() => mockPets),
              sort: jest.fn().mockImplementationOnce(() => mockPets),
              skip: jest.fn().mockImplementationOnce(() => {
                return {
                  limit: jest.fn().mockImplementationOnce(() => mockPets),
                };
              }),
            };
          }),
        };
      }),
    });

    const result = await service.findAll();
    expect(result).toEqual({
      items: mockPets,
      page: 0,
      size: 10,
      total: 1,
    });
  });
  it('should return an empty array of pets', async () => {
    const mockPets = [];
    jest.spyOn(PetModel, 'countDocuments').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockPets.length),
    });
    jest.spyOn(PetModel, 'find').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          select: jest.fn().mockImplementationOnce(() => {
            return {
              exec: jest.fn().mockImplementationOnce(() => mockPets),
              sort: jest.fn().mockImplementationOnce(() => mockPets),
              skip: jest.fn().mockImplementationOnce(() => {
                return {
                  limit: jest.fn().mockImplementationOnce(() => mockPets),
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

  it('should update a pet', async () => {
    const petDto: PetDto = {
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

    jest.spyOn(PetModel, 'findOneAndUpdate').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...petDto,
          exec: jest.fn().mockImplementationOnce(() => petDto),
        };
      }),
    });

    const result = await service.updatePet(petDto, {
      path: 'uploads\\teste.jpg',
    });
    expect(result).toEqual(petDto);
  });
  it('should update errorDomainService a NOT_FOUND pet', async () => {
    const petDto: PetDto = {
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
    jest.spyOn(PetModel, 'findOneAndUpdate').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockImplementationOnce(() => null),
        };
      }),
    });

    const result = await service.update(petDto);
    expect(result).toBeNull();
  });

  it('should remove a pet', async () => {
    const mockPet = {
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

    jest.spyOn(PetModel, 'findOneAndDelete').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockPet,
          exec: jest.fn().mockImplementationOnce(() => mockPet),
        };
      }),
    });

    const result = await service.removeById(mockPet.id);

    expect(result).toEqual(mockPet);
  });

  it('should remove errorDomainService a NOT_FOUND pet', async () => {
    const mockPet = {
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

    jest.spyOn(PetModel, 'findOneAndDelete').mockReturnValueOnce({
      populate: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockPet,
          exec: jest.fn().mockImplementationOnce(() => null),
        };
      }),
    });

    const result = await service.removeById(mockPet.id);

    expect(result).toBeNull();
  });
});
