import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Cat } from '../schemas/cats.schema';

export class CatDto extends Cat {
  @ValidateIf((ob: any) => ob.createAt || ob.updateAt)
  @IsNotEmpty()
  _id?: number;

  constructor(name: string, age: number, breed: string) {
    super();
    this.name = name;
    this.age = age;
    this.breed = breed;
  }
}
