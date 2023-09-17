class Permiso {
  public id_permiso: string;
  public endpoint: string;

  constructor(id_permiso: string, endpoint: string) {
    this.id_permiso = id_permiso;
    this.endpoint = endpoint;
  }
}

export default Permiso;
