export class User {
  username: string;

  password: string;

  static map(data: {}): User {
    const user = new User();
    user.username = data.username;
    user.password = data.password;
    return user;
  }
}
