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
import { CatDto } from '../../models/cat.dto';
import {
  PaginationRequest,
  PaginationResponse,
} from '../../models/pagination-response';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { CatsService } from '../../services/cats/cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  finAllCats(
    @Query() cat?: PaginationRequest<Partial<CatDto>>,
  ): Promise<PaginationResponse<Cat>> {
    return this.catsService.findAll(cat);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findCat(
    @Param('id') id: string | number | Types.ObjectId,
  ): Promise<CatDocument> {
    return this.catsService.findById(id);
  }
  @Put()
  @HttpCode(HttpStatus.OK)
  updateCat(@Body() cat: CatDto): Promise<CatDocument> {
    return this.catsService.update(cat);
  }
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  removeCat(
    @Param('id') id: string | number | Types.ObjectId,
  ): Promise<CatDocument> {
    return this.catsService.removeById(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCat(@Body() cat: CatDto): Promise<CatDocument> {
    return this.catsService.create(cat);
  }
}
