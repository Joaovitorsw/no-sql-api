import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { IsPublic } from '../../decorators/is-public-route';
import {
  PaginationRequest,
  PaginationResponse,
} from '../../models/pagination-response';
import { Roles } from '../../schemas/roles.schema';
import { RolesService } from '../../services/roles/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  findAll(
    @Query() roles?: PaginationRequest<Partial<Roles>>,
  ): Promise<PaginationResponse<Roles>> {
    return this.rolesService.findAll(roles);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id: string | number | Types.ObjectId): Promise<Roles> {
    return this.rolesService.findById(id);
  }
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() role: Roles): Promise<Roles> {
    return this.rolesService.update(role);
  }
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string | number | Types.ObjectId): Promise<Roles> {
    return this.rolesService.removeById(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() role: Roles): Promise<Roles> {
    return this.rolesService.create(role);
  }
}
