import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { transformID } from '../helpers/id-transformer';

export type FileDocument = HydratedDocument<Files>;

@Schema({
  collection: 'files',
  autoIndex: true,
  versionKey: false,
  toJSON: {
    transform: transformID,
  },
  toObject: {
    transform: transformID,
  },
})
export class Files {
  id?: number;
  @Prop({ type: Number, unique: true })
  _id?: number;
  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true })
  mimetype: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true })
  buffer: string;

  @Prop({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  size: number;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
