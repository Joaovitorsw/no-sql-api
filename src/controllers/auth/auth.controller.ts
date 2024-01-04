import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  PaginationRequest,
  PaginationResponse,
} from '../../models/pagination-response';
import { UserDto } from '../../models/user.dto';
import { User } from '../../schemas/users.schema';
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
  async login(@Body() credentials: Omit<UserDto, 'role' | 'email'>) {
    const user = await this.authService.login(credentials);
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() user?: PaginationRequest<Partial<UserDto>>,
  ): Promise<PaginationResponse<User>> {
    return this.authService.findAll(user);
  }
}
