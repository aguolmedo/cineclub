import Permiso from './permiso.model';

class Perfil {
  public id_perfil: string;
  public name: string;
  public permisos: Permiso[];

  constructor(id_perfil: string, name: string, permisos: Permiso[]) {
    this.id_perfil = id_perfil;
    this.name = name;
    this.permisos = permisos;
  }
}

export default Perfil;
