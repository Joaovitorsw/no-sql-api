import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
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
    } as UserDocument;
    jest.spyOn(authService, 'create').mockImplementation(async () => userDto);
    const result = await authController.createUser(userDto);
    expect(result).toEqual(userDto);
  });

  it('should return a user', async () => {
    const userDto = {
      username: 'Test',
      email: 'test@teste.com',
      password: '123456',
    } as UserDocument;
    jest.spyOn(authService, 'login').mockImplementation(async () => userDto);
    const result = await authController.login(userDto);
    expect(result).toEqual(userDto);
  });
});
