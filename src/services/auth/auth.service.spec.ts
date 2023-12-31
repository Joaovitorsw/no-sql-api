import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../../models/user.dto';
import { UsersRepository } from '../../repository/user.repository';
import { User } from '../../schemas/users.schema';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';
import { AuthService } from './auth.service';

class UserModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static create = jest.fn();
  static exec = jest.fn();
  populate = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn();
  static findOne = jest.fn();
  static findById = jest.fn();
  toObject = jest
    .fn()
    .mockImplementation(
      (param: any) => param?.transform(0, this.data) ?? this.data,
    );
}
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ErrorDomainService,
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should create a new user', async () => {
    const userDto: UserDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    };
    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          };
        }),
      };
    });
    jest.spyOn(UserModel, 'create').mockImplementationOnce(() => ({
      save: jest.fn().mockResolvedValue(userDto),
      populate: jest.fn().mockImplementationOnce(() => userDto),
      toObject: jest
        .fn()
        .mockImplementationOnce(
          (param: any) => param?.transform(0, userDto) ?? userDto,
        ),
    }));

    const result = await service.create(userDto);
    expect(result).toEqual({
      username: userDto.username.toLocaleLowerCase(),
      email: userDto.email.toLocaleLowerCase(),
    });
  });

  it('should return domain validation ALREADY_EXISTS', async () => {
    const userDto: UserDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    };

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue({
              toObject: (param: any) =>
                param.transform(0, {
                  _id: '6590214c754d1e36278d8553',
                  username: 'Giselida',
                  email: 'giselidac@gmail.com',
                }),
            }),
          };
        }),
      };
    });
    await service.create(userDto);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um usuario(a) com essas informações',
      },
    ]);
  });

  it('should return domain validation UNAUTHORIZED', async () => {
    const userDto: UserDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    };

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue({
              toObject: (param: any) =>
                param.transform(0, { ...userDto, password: '12346' }),
            }),
          };
        }),
      };
    });

    await service.login(userDto);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.UNAUTHORIZED,
        message: 'Credenciais inválidas!',
      },
    ]);
  });
  it('should return domain validation UNAUTHORIZED', async () => {
    const userDto: UserDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    };

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue({
              toObject: (param: any) => param.transform(0, null),
            }),
          };
        }),
      };
    });
    await service.login(userDto);

    expect(service['errorDomainService'].errors).toEqual([
      {
        type: eTypeDomainError.UNAUTHORIZED,
        message: 'Credenciais inválidas!',
      },
    ]);
  });
  it('should return domain login', async () => {
    const userDto: UserDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    };

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      return {
        populate: jest.fn().mockImplementationOnce(() => {
          return {
            exec: jest.fn().mockResolvedValue({
              toObject: (param: any) =>
                param.transform(0, {
                  ...userDto,
                  password:
                    '$2b$10$H1WLmkjM1694RJz5GsRgJe.jvJCSlBZIzWqD9PYWGWgCiO4a06dhG',
                }),
            }),
          };
        }),
      };
    });

    const result = await service.login(userDto);
    expect(result).toEqual({
      username: userDto.username,
      email: userDto.email,
    });
  });
  it('should return an array of users', async () => {
    const mockUsers = [
      {
        _id: '65919850e602a4b3ef1baf8f',
        username: 'joaovitorsw',
        email: 'joaovitorwbr@gmail.com',
      },
    ];

    jest.spyOn(UserModel, 'find').mockReturnValueOnce({
      select: jest.fn().mockImplementationOnce(() => {
        return {
          ...mockUsers,
          exec: jest.fn().mockImplementationOnce(() => mockUsers),
        };
      }),
    });

    const result = await service.findAll();
    expect(result).toEqual(mockUsers);
  });
});
