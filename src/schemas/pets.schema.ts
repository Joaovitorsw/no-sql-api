import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { transformID } from '../helpers/id-transformer';

export type PetDocument = HydratedDocument<Pet>;

@Schema({
  collection: 'pets',
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
export class Pet {
  id?: number;
  @Prop({ type: Number, unique: true })
  _id?: number;
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Date, required: true })
  birthDate: Date;

  @Prop({ type: String, required: true, ref: 'files' })
  photoUrl: number;

  @Prop({ type: Number, ref: 'User' })
  owner: number;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
