import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Roles>;

@Schema({
  collection: 'roles',
  autoIndex: true,
  versionKey: false,
  selectPopulatedPaths: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
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
