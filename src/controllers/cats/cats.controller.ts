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
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { CatDto } from '../../models/cat.dto';
import {
  PaginationRequest,
  PaginationResponse,
} from '../../models/pagination-response';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { CatsService } from '../../services/cats/cats.service';
let selfCatsService;
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {
    selfCatsService = catsService;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllCats(
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

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  removeCat(
    @Param('id') id: string | number | Types.ObjectId,
  ): Promise<CatDocument> {
    return this.catsService.removeById(id);
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      limits: {
        fieldSize: 500 * 1024,
      },
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  createCat(@UploadedFile() file, @Body() cat: CatDto): Promise<CatDocument> {
    return this.catsService.createCat(cat, file);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('photoUrl', {
      limits: {
        fieldSize: 500 * 1024,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          if (req.body.id) {
            selfCatsService.findById(+req.body.id).then((cat) => {
              if (cat) {
                const path = cat.photoUrl;
                cb(null, `${path}`);
              }
            });
          } else {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');

            cb(null, `${randomName}`);
          }
        },
      }),
    }),
  )
  updateCat(@UploadedFile() file, @Body() cat: CatDto): Promise<CatDocument> {
    return this.catsService.updateCat(cat, file);
  }

  @Get('image/:imgpath') seeUploadedFile(@Param('imgpath') image, @Res() res) {
    res.set({ 'Content-Type': 'image/jpeg' });
    return res.sendFile(image, { root: './uploads' });
  }
}
