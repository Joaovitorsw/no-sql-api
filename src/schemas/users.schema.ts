import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  autoIndex: true,
  versionKey: false,
})
export class User {
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
}

export const UserSchema = SchemaFactory.createForClass(User);
