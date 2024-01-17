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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as path from 'path';

import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { memoryStorage } from 'multer';
import { IsPublic } from 'src/decorators/is-public-route';
import { CalendarDTO } from '../../dtos/calendar';
import { FileDto } from '../../dtos/file';
import { PetDto } from '../../dtos/pet.dto';
import {
  PaginationRequest,
  PaginationResponse,
} from '../../models/pagination-response';
import { Pet, PetDocument } from '../../schemas/pets.schema';
import { PetsService } from '../../services/pets/pets.service';
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllPets(
    @Query() pet?: PaginationRequest<Partial<PetDto>>,
  ): Promise<PaginationResponse<Pet>> {
    return this.petsService.findAll(pet);
  }
  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchPet(@Query() pet?: PaginationRequest<Partial<PetDto>>): Promise<any> {
    return this.petsService.searchByField(pet);
  }
  @Get('calendar')
  @HttpCode(HttpStatus.OK)
  searchByDate(@Query() calendar: CalendarDTO): Promise<any> {
    return this.petsService.searchByDate(calendar);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findPet(
    @Param('id') id: string | number | Types.ObjectId,
  ): Promise<PetDocument> {
    return this.petsService.findById(id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  removePet(
    @Param('id') id: string | number | Types.ObjectId,
  ): Promise<PetDocument> {
    return this.petsService.removeById(id);
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      limits: {
        fieldSize: 500 * 1024,
      },
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  createPet(
    @UploadedFile() file: FileDto,
    @Body() pet: PetDto,
  ): Promise<PetDocument> {
    return this.petsService.createPet(pet, file);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      limits: {
        fieldSize: 500 * 1024,
      },
    }),
  )
  updatePet(@UploadedFile() file, @Body() pet: PetDto): Promise<PetDocument> {
    return this.petsService.updatePet(pet, file);
  }
  @IsPublic()
  @Get('image/:id')
  async seeUploadedFile(@Param('id') id, @Res() res) {
    await this.petsService.getImage(id);
    const uploadsPath = path.join(__dirname, '../..', 'uploads');
    res.set({ 'Content-Type': 'image/jpeg' });
    return res.sendFile(id, { root: uploadsPath });
  }
}
