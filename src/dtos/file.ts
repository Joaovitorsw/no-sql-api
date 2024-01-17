import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Files } from 'src/schemas/files.schema';

export class FileDto extends Files {
  id?: number;
  _id?: number;
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @IsNotEmpty()
  @IsString()
  buffer: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;
  constructor(name: string, mimetype: string, buffer: string, size: number) {
    super();
    this.name = name;
    this.mimetype = mimetype;
    this.buffer = buffer;
    this.size = size;
  }
}
