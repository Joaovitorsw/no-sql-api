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
import { CreateCatDto } from '../../models/create-cat.dto';
import { Cat } from '../../schemas/cat.schema';
import { CatsService } from '../../services/cats/cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  finAllCats(@Query() cat?: Partial<CreateCatDto>): Promise<Cat[]> {
    return this.catsService.findAll(cat);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findCat(@Param('id') id: number): Promise<Cat> {
    return this.catsService.findById(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCat(@Body() cat: CreateCatDto): Promise<Cat> {
    return this.catsService.create(cat);
  }
}
