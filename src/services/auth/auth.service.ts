import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../../dtos/user.dto';
import { UsersRepository } from '../../repository/users/users.repository';
import { User } from '../../schemas/users.schema';
import { BaseService } from '../base/base.service';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';

@Injectable()
export class AuthService extends BaseService<User> {
  constructor(
    public usersRepository: UsersRepository,
    public errorDomainService: ErrorDomainService,
    private readonly jwtService: JwtService,
  ) {
    super(usersRepository, errorDomainService);
  }

  async create(userDto: UserDto) {
    const password = await bcrypt.hash(userDto.password, 10);

    const user = await this.usersRepository.findOne({
      $or: [
        { username: userDto.username?.toLowerCase() },
        { email: userDto.email?.toLowerCase() },
      ],
    });

    if (user) {
      this.errorDomainService.addError({
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um usuario(a) com essas informações',
      });
      return;
    }

    const createdUser = await this.usersRepository.create({
      ...userDto,
      email: userDto.email?.toLowerCase(),
      username: userDto.username?.toLowerCase(),
      password,
    });
    delete createdUser.password;
    return { ...createdUser, token: this.jwtService.sign(createdUser) };
  }

  async login(userDto: Omit<UserDto, 'role' | 'email'>) {
    const user = await this.usersRepository.findOne({
      $or: [
        { email: userDto.username?.toLowerCase() },
        { username: userDto.username?.toLowerCase() },
      ],
    });

    if (!user) {
      this.errorDomainService.addError({
        type: eTypeDomainError.UNAUTHORIZED,
        message: 'Credenciais inválidas!',
      });
      return;
    }

    const equalPasswords = await bcrypt.compare(
      userDto.password,
      user?.password,
    );

    if (!equalPasswords) {
      this.errorDomainService.addError({
        type: eTypeDomainError.UNAUTHORIZED,
        message: 'Credenciais inválidas!',
      });
      return;
    }
    const userJSON = user.toJSON();
    delete userJSON.password;
    return {
      ...userJSON,
      token: this.jwtService.sign(userJSON),
    };
  }
}
