import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { transformID } from '../helpers/id-transformer';

export type CatDocument = HydratedDocument<Cat>;

@Schema({
  collection: 'cats',
  autoIndex: true,
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform: transformID,
  },
  toObject: {
    transform: transformID,
  },
})
export class Cat {
  id?: number;
  @Prop({ type: Number, unique: true })
  _id?: number;
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Date, required: true })
  birthDate: Date;

  @Prop({ type: String, required: true })
  photoUrl: string;

  @Prop({ type: Number, ref: 'User' })
  owner: number;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
