import { injectable } from 'inversify';
import { IAuthService } from './interface/iauth.interface';
import User from '../model/user.model';
import sha256 from '../utils/sha256Helper';
import { UserService } from '../services/user.service';
import Types from './types/types';
import container from './inversify.config';

const jwt = require('jsonwebtoken');
const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class AuthService implements IAuthService {
  public async accesToken(basicAuth: string) {
    try {
      const email = basicAuth.split(':')[0];
      const password = sha256.encrypt(basicAuth.split(':')[1]);

      const userDB = await db
        .select()
        .from('USUARIOS')
        .where({
          TX_MAIL: email,
          TX_CONTRASEÑA: password,
        })
        .first();

      if (!userDB) return;

      return jwt.sign(
        {
          email: userDB.TX_MAIL,
          password: userDB.TX_CONTRASEÑA,
          nombre: userDB.TX_NOMBRE,
          profile: userDB.ID_PERFIL,
        },
        process.env.SECRET,
        { expiresIn: '3600s' },
      );
    } catch (e) {
      return e;
    }
  }

  public async verifyToken(token: string) {
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

    const userDB: User = await db
      .select()
      .from('user')
      .where({
        email: decodedToken.email,
        password: decodedToken.password,
      })
      .first();

    if (!userDB) return false;

    return decodedToken;
  }
}
