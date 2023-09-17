import Perfil from './perfil.model';

class User {
  public idUsername: number;
  public username: string;
  public password: string;
  public email: string;
  public perfil: Perfil;

  constructor(
    idUsername: number,
    username: string,
    password: string,
    email: string,
    perfil: Perfil,
  ) {
    this.idUsername = idUsername;
    this.username = username;
    this.password = password;
    this.email = email;
    this.perfil = perfil;
  }
}

export default User;
