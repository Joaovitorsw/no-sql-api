import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Pet } from '../schemas/pets.schema';

export class PetDto extends Pet {
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  photoUrl: number;
  @IsNotEmpty()
  owner: number;

  constructor(name: string, birthDate: Date, photoUrl: number, owner: number) {
    super();

    this.name = name;
    this.birthDate = birthDate;
    this.photoUrl = photoUrl;
    this.owner = owner;
  }
}
