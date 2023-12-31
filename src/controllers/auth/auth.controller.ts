import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserDto } from '../../models/user.dto';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async createUser(@Body() newUser: UserDto) {
    const user = await this.authService.create(newUser);
    return user;
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: UserDto) {
    const user = await this.authService.login(credentials);
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const users = await this.authService.findAll();
    return users;
  }
}
