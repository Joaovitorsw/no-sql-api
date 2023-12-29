import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCatDto } from '../../models/create-cat.dto';
import { Cat } from '../../schemas/cat.schema';
import { AppService } from '../../services/app/app.service';
import { CatsService } from '../../services/cats/cats.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catsService: CatsService,
  ) {}

  @Get()
  getHello(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
  @Post()
  async createCat(@Body() cat: CreateCatDto): Promise<Cat> {
    return this.catsService.create(cat);
  }
}
