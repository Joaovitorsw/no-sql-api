import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../../models/user.dto';
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
    .mockImplementation((param: any) => param.transform(0, this.data));
}
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ErrorDomainService,
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

    jest.spyOn(UserModel, 'create').mockImplementationOnce(() => ({
      ...userDto,
      save: jest.fn().mockResolvedValue(userDto),
      populate: jest.fn().mockImplementationOnce(() => userDto),
      toObject: jest
        .fn()
        .mockImplementationOnce((param: any) => param.transform(0, userDto)),
    }));
    jest.spyOn(UserModel, 'findOne').mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
    const result = await service.create(userDto);
    expect(result).toEqual(userDto);
  });

  it('should return domain validation ALREADY_EXISTS', async () => {
    const userDto: UserDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    };

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => ({
      exec: jest.fn().mockResolvedValue({
        _id: '6590214c754d1e36278d8553',
        username: 'Giselida',
        email: 'giselidac@gmail.com',
      }),
    }));

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
        ...userDto,
        password: '12346',
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

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => null);

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
        ...userDto,
        password:
          '$2b$10$H1WLmkjM1694RJz5GsRgJe.jvJCSlBZIzWqD9PYWGWgCiO4a06dhG',
        toObject: (param: any) => param.transform(0, userDto),
      };
    });

    const result = await service.login(userDto);
    expect(result).toEqual(userDto);
  });
});
