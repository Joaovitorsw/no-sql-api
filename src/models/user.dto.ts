import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { User } from '../schemas/users.schema';

export class UserDto extends User {
  _id?: number;
  @ValidateIf((ob: any) => !ob.email)
  @IsNotEmpty()
  @IsString()
  username: string;

  @ValidateIf((ob: any) => !ob.username)
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsNumber()
  roleID: number;
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
    this.roleID = roleID;
  }
}
