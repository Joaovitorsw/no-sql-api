import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Cat } from '../schemas/cat.schema';

export class CatDto extends Cat {
  @ValidateIf((ob: any) => ob.createAt)
  @IsNotEmpty()
  _id?: string;

  constructor(name: string, age: number, breed: string) {
    super();
    this.name = name;
    this.age = age;
    this.breed = breed;
  }
}
