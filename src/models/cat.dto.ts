import { Cat } from '../schemas/cats.schema';

export class CatDto extends Cat {
  id: number;

  constructor(name: string, birthDate: Date, photoUrl: string, owner: number) {
    super();
    this.name = name;
    this.birthDate = birthDate;
    this.photoUrl = photoUrl;
    this.owner = owner;
  }
}
