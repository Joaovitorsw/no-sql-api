import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../../models/user.dto';
import { UsersRepository } from '../../repository/users/users.repository';
import { User, UserDocument } from '../../schemas/users.schema';
import { AuthService } from '../../services/auth/auth.service';
import { ErrorDomainService } from '../../services/error-domain/error-domain.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersRepository,
        ErrorDomainService,
        { provide: getModelToken(User.name), useValue: jest.fn() },
      ],
    }).compile();
    authService = app.get<AuthService>(AuthService);
    authController = app.get<AuthController>(AuthController);
  });

  it('should create and return a user', async () => {
    const userDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    };
    jest
      .spyOn(authService, 'create')
      .mockImplementation(async () => userDto as UserDocument);
    const result = await authController.createUser(userDto as UserDto);
    expect(result).toEqual(userDto);
  });

  it('should return a user', async () => {
    const userDto = {
      username: 'Test',
      password: '123456',
    };
    jest
      .spyOn(authService, 'login')
      .mockImplementation(async () => userDto as UserDocument);
    const result = await authController.login(userDto);
    expect(result).toEqual(userDto);
  });
  it('should return an array of users', async () => {
    const result = [
      {
        _id: 1,
        username: 'joaovitorsw',
        email: 'joaovitorwbr@gmail.com',
        password: '123456',
        role: 1,
      },
    ];
    const response = {
      items: result as UserDocument[],
      total: result.length,
      page: 1,
      size: 10,
    };
    jest
      .spyOn(authService, 'findAll')
      .mockImplementation(() => Promise.resolve(response));

    expect(await authController.findAll()).toBe(response);
  });
});
