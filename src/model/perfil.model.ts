import Permiso from './permiso.model';

class Perfil {
  public id_perfil: string;
  public name: string;
  public permisos: Permiso[];

  constructor(name: string) {
    this.name = name;
  }
}

export default Perfil;
