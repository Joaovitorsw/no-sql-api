import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Cat } from '../schemas/cats.schema';

export class CatDto extends Cat {
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  photoUrl: string;

  @IsNotEmpty()
  owner: number;
  constructor(name: string, birthDate: Date, photoUrl: string, owner: number) {
    super();

    this.name = name;
    this.birthDate = birthDate;
    this.photoUrl = photoUrl;
    this.owner = owner;
  }
}
