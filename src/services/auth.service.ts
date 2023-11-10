import { injectable } from 'inversify';
import { IAuthService } from './interface/iauth.interface';
import sha256 from '../utils/sha256.helper';

const jwt = require('jsonwebtoken');
const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class AuthService implements IAuthService {
  public async acces_token(basicAuth: string) {
    try {
      const email = basicAuth.split(':')[0];
      const password = sha256.encrypt(basicAuth.split(':')[1]);

      const userDB = await db
        .select('USUARIOS.*', 'PERFILES.TX_NOMBRE as NOMBRE_PERFIL') // Reemplaza NOMBRE_DEL_PERFIL por el nombre real de la columna
        .from('USUARIOS')
        .join('PERFILES', 'USUARIOS.ID_PERFIL', 'PERFILES.ID_PERFIL')
        .where({
          'USUARIOS.TX_MAIL': email,
          'USUARIOS.TX_CONTRASEÑA': password,
        })
        .first();

      if (!userDB) return;

      return jwt.sign(
        {
          idUsuario: userDB.ID_USUARIO,
          email: userDB.TX_MAIL,
          nombre: userDB.TX_NOMBRE,
          apellido: userDB.TX_APELLIDO,
          profile: userDB.ID_PERFIL,
        },
        process.env.SECRET,
        { expiresIn: '3600s' },
      );
    } catch (e) {
      return e;
    }
  }

  public async verify_token(token: string) {
    const cleanToken = token.split(' ')[1];

    const decodedToken = jwt.verify(
      cleanToken,
      process.env.SECRET,
      (err: any, decode: any) => {
        if (err) {
          return false;
        }
        return decode;
      },
    );

    if (!decodedToken) return false;

    const userDB = await db
      .select()
      .from('USUARIOS')
      .where({
        TX_MAIL: decodedToken.email,
      })
      .first();

    if (!userDB) return false;

    return decodedToken;
  }
}
