import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { User } from '../schemas/users.schema';

export class UserDto extends User {
  _id?: string;
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
  constructor(username: string, email: string, password: string) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
