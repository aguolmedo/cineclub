import Perfil from './perfil.model';

class User {
  public idUsername: number;
  public username: string;
  public password: string;
  public email: string;
  public perfil: Perfil;

  constructor(
    username: string,
    password: string,
    email: string,
    perfil: Perfil,
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.perfil = perfil;
  }
}

export default User;
