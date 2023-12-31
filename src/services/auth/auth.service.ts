import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserDto } from '../../models/user.dto';
import { User, UserDocument } from '../../schemas/users.schema';
import {
  ErrorDomainService,
  eTypeDomainError,
} from '../error-domain/error-domain.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private errorDomainService: ErrorDomainService,
  ) {}

  async create(userDto: UserDto): Promise<UserDocument> {
    const password = await bcrypt.hash(userDto.password, 10);

    const createUser = new this.userModel({
      ...userDto,
    });

    const user = await this.userModel
      .findOne({
        $or: [{ username: createUser.username }, { email: createUser.email }],
      })
      .exec();

    if (user) {
      this.errorDomainService.addError({
        type: eTypeDomainError.ALREADY_EXISTS,
        message: 'Já existe um usuario(a) com essas informações',
      });
      return;
    }

    const createdUser = await this.userModel.create({
      ...userDto,
      password,
    });

    createdUser.save();

    return createdUser.toObject({
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    });
  }

  async login(userDto: UserDto) {
    const user = await this.userModel.findOne({
      $or: [{ email: userDto.email }, { username: userDto.username }],
    });
    const equalPasswords = await bcrypt.compare(
      userDto.password,
      user?.password,
    );

    const invalidCredentials = !user || !equalPasswords;
    if (invalidCredentials) {
      this.errorDomainService.addError({
        type: eTypeDomainError.UNAUTHORIZED,
        message: 'Credenciais inválidas!',
      });
      return;
    }
    delete user.password;

    return user.toObject({
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    });
  }
}
