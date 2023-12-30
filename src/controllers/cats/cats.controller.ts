import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateCatDto } from '../../models/create-cat.dto';
import { CatDocument } from '../../schemas/cat.schema';
import { CatsService } from '../../services/cats/cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  finAllCats(@Query() cat?: Partial<CreateCatDto>): Promise<CatDocument[]> {
    return this.catsService.findAll(cat);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findCat(
    @Param('id') id: string | number | Types.ObjectId,
  ): Promise<CatDocument> {
    return this.catsService.findById(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCat(@Body() cat: CreateCatDto): Promise<CatDocument> {
    return this.catsService.create(cat);
  }
}
