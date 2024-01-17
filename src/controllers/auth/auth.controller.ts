import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { GetUserId } from 'src/decorators/get-user';
import { IsPublic } from 'src/decorators/is-public-route';
import { UserDto } from '../../dtos/user.dto';
import {
  PaginationRequest,
  PaginationResponse,
} from '../../models/pagination-response';
import { User } from '../../schemas/users.schema';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @IsPublic()
  async createUser(@Body() newUser: UserDto) {
    const user = await this.authService.create(newUser);
    return user;
  }

  @Post('sign-in')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: Omit<UserDto, 'role' | 'email'>) {
    const user = await this.authService.login(credentials);
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() user?: PaginationRequest<Partial<UserDto>>,
    @GetUserId() userId?: string,
  ): Promise<PaginationResponse<User>> {
    return this.authService.findAll(user);
  }
}
