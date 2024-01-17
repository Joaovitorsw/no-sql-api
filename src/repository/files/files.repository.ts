import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Files } from 'src/schemas/files.schema';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class FilesRepository extends BaseRepository<Files> {
  constructor(@InjectModel(Files.name) public fileModel: Model<Files>) {
    super(fileModel);
  }
}
