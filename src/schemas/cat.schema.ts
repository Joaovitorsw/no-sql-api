import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema({
  collection: 'cats',
})
export class Cat {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: String, required: true })
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
