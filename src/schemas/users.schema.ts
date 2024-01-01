import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  autoIndex: true,
  versionKey: false,
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
  roleID: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
