import { injectable } from 'inversify';
import { IUserService } from './interface/iuser.interface';
import sha256 from '../utils/sha256Helper';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class UserService implements IUserService {
  public async createUser(data: any) {
    data.password = sha256.encrypt(data.password);

    data.profile = await this.getIdProfile(data.profile);

    const newUser = await db
      .insert({
        TX_NOMBRE: data.firstName,
        TX_APELLIDO: data.lastName,
        ID_PERFIL: data.profile,
        TX_CONTRASEÑA: data.password,
        TX_MAIL: data.email,
      })
      .into('USUARIOS');

    if (!newUser) throw 'Error inserting user in db';

    return true;
  }

  public async getIdProfile(nameProfile: string) {
    const perfil = await db
      .select('ID_PERFIL')
      .from('PERFILES')
      .where({
        TX_NOMBRE: nameProfile.toLowerCase(),
      })
      .first();

    return perfil.ID_PERFIL;
  }

  public async getProfileById(idProfile: number) {
    const perfil = await db
      .select('TX_NOMBRE')
      .from('PERFILES')
      .where({
        ID_PERFIL: idProfile,
      })
      .first();

    return perfil.ID_PERFIL;
  }
}
