import { injectable } from 'inversify';
import { IUserService } from './interface/iuser.interface';
import sha256 from '../utils/sha256.helper';
import sha256Helper from '../utils/sha256.helper';
import User from '../model/user.model';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class UserService implements IUserService {
  public async create_user(data: any) {
    data.password = sha256.encrypt(data.password);

    data.profile = await this.get_id_profile(data.profile);

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

  public async get_id_profile(nameProfile: string) {
    const perfil = await db
      .select('ID_PERFIL')
      .from('PERFILES')
      .where({
        TX_NOMBRE: nameProfile.toLowerCase(),
      })
      .first();

    return perfil.ID_PERFIL;
  }

  public async get_profile_by_id(idProfile: number) {
    const perfil = await db
      .select('TX_NOMBRE')
      .from('PERFILES')
      .where({
        ID_PERFIL: idProfile,
      })
      .first();

    return perfil.ID_PERFIL;
  }

  public async genere_token_password_recovery(email: string) {
    const crypto = require('crypto');
    let randomBytes = crypto.randomBytes(60);
    const token = sha256Helper.encrypt(randomBytes.toString('utf8'));
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 20 * 60 * 1000); // Agrega 20 minutos a la fecha actual
    const formattedDate = expirationDate
      .toISOString()
      .slice(0, 19)
      .replace('T', ' '); // Formatea como 'YYYY-MM-DD HH:MM:SS'

    const userDb = await db
      .select('ID_USUARIO')
      .from('USUARIOS')
      .where({
        TX_MAIL: email,
      })
      .first();

    if (!userDb) return false;

    await db
      .insert({
        TX_Token: token,
        ID_USUARIO: userDb.ID_USUARIO,
        EXPIRATION_DATE: formattedDate,
      })
      .into('TOKENS');

    return token;
  }

  public async regenerate_password(token: string, newPassword: string) {
    const userDb = await db
      .select('ID_USUARIO')
      .from('TOKENS')
      .where({
        TX_TOKEN: token,
      })
      .first();

    if (!userDb) return false;

    await db('USUARIOS')
      .update({
        TX_CONTRASEÑA: sha256Helper.encrypt(newPassword),
      })
      .where({
        ID_USUARIO: userDb.ID_USUARIO,
      });

    await db.del().from('TOKENS').where({
      TX_TOKEN: token,
    });

    return true;
  }

  public async modify_user(idUsuario, field, updatedField) {
    try {
      if (field === 'TX_CONTRASEÑA') {
        updatedField = sha256Helper.encrypt(updatedField);
      }

      const updatedRows = await db('USUARIOS')
        .where({ ID_USUARIO: idUsuario })
        .update({
          [field]: [updatedField],
        });

      if (!updatedRows) {
        console.log('Error updating user');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }
}
