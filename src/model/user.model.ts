class User {
  public idUsuario: string;
  public nombre: string;
  public apellido: string;
  public idPerfil: string;
  public email: string;

  constructor(
    idUsuario: string,
    nombre: string,
    apellido: string,
    idPerfil: string,
    email: string,
  ) {
    this.idUsuario = idUsuario;
    this.nombre = nombre;
    this.apellido = apellido;
    this.idPerfil = idPerfil;
    this.email = email;
  }
}

export default User;
