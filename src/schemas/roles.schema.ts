import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { transformID } from '../helpers/id-transformer';

export type RoleDocument = HydratedDocument<Roles>;

@Schema({
  collection: 'roles',
  autoIndex: true,
  versionKey: false,
  selectPopulatedPaths: true,
  toJSON: {
    transform: transformID,
  },
  toObject: {
    transform: transformID,
  },
})
export class Roles {
  id: number;

  @Prop({ type: Number, unique: true })
  @IsOptional()
  @IsNumber()
  _id?: number;
  @Prop({ type: String, required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
