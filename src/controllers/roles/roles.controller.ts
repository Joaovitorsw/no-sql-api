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
  finAllCats(
    @Query() roles?: PaginationRequest<Partial<Roles>>,
  ): Promise<PaginationResponse<Roles>> {
    return this.rolesService.findAll(roles);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findCat(@Param('id') id: string | number | Types.ObjectId): Promise<Roles> {
    return this.rolesService.findById(id);
  }
  @Put()
  @HttpCode(HttpStatus.OK)
  updateCat(@Body() role: Roles): Promise<Roles> {
    return this.rolesService.update(role);
  }
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  removeCat(@Param('id') id: string | number | Types.ObjectId): Promise<Roles> {
    return this.rolesService.removeById(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCat(@Body() role: Roles): Promise<Roles> {
    return this.rolesService.create(role);
  }
}
