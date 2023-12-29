import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  breed: string;
  
  constructor(name: string, age: number, breed: string) {
    this.name = name;
    this.age = age;
    this.breed = breed;
  }
}
