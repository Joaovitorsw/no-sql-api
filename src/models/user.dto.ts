import { User } from '../schemas/users.schema';

export class UserDto extends User {
  constructor(username: string, email: string, password: string) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
