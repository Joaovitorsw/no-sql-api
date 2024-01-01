import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { transformID } from '../helpers/id-transformer';

export type CatDocument = HydratedDocument<Cat>;

@Schema({
  collection: 'cats',
  autoIndex: true,
  versionKey: false,
  toJSON: {
    transform: transformID,
  },
  toObject: {
    transform: transformID,
  },
})
export class Cat {
  id: number;
  @Prop({ type: Number, unique: true })
  @IsOptional()
  @IsNumber()
  _id?: number;
  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  breed: string;

  @Prop({ type: String, default: new Date().toISOString() })
  @IsDateString()
  @IsOptional()
  createAt: string;

  @Prop({ type: String, default: new Date().toISOString() })
  @IsOptional()
  @IsDateString()
  updateAt: string;
  @Prop({ type: Number, ref: 'User' })
  @IsNotEmpty()
  @IsNumber()
  owner: number;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
