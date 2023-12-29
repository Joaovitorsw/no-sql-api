import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateCatDto } from '../../models/create-cat.dto';
import { Cat } from '../../schemas/cat.schema';
import { CatsService } from '../../services/cats/cats.service';

@Controller()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  finAllCats(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCat(@Body() cat: CreateCatDto): Promise<Cat> {
    return this.catsService.create(cat);
  }
}
