import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../schemas/users.schema';

export class UserDto extends User {
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsNumber()
  role: number;
  constructor(
    username: string,
    email: string,
    password: string,
    roleID: number,
  ) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = roleID;
  }
}
