import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/repository/user.repository';
import { UserDto } from '../../models/user.dto';
import { UserDocument } from '../../schemas/users.schema';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private errorDomainService: ErrorDomainService,
  ) {}

  async create(userDto: UserDto): Promise<UserDocument> {
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
      email: userDto.email?.toLowerCase(),
      username: userDto.username?.toLowerCase(),
      password,
    });

    return createdUser;
  }

  async login(userDto: UserDto) {
    const user = await this.usersRepository.findOne({
      $or: [
        { email: userDto.email?.toLowerCase() },
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
    delete user.password;
    return user;
  }

  async findAll(userDto?: Partial<UserDto>): Promise<UserDocument[]> {
    const users = await this.usersRepository.findAll(
      {
        ...userDto,
      },
      '-password -__v',
    );

    return users;
  }
}
