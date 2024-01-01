import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { transformID } from '../helpers/id-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  autoIndex: true,
  versionKey: false,
  toJSON: {
    transform: transformID,
  },
  toObject: {
    transform: transformID,
  },
})
export class User {
  id: number;

  @Prop({ type: Number, unique: true })
  @IsOptional()
  @IsNumber()
  _id?: number;
  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, ref: 'Roles' })
  @IsNotEmpty()
  @IsNumber()
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
