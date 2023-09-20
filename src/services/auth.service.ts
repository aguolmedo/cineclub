import { injectable } from 'inversify';
import { IAuthService } from './interface/iauth.interface';
import User from '../model/user.model';

const jwt = require('jsonwebtoken');
const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class AuthService implements IAuthService {
  public async accesToken(basicAuth: string) {
    try {
      const email = basicAuth.split(':')[0];
      const password = basicAuth.split(':')[1];

      const userDB: User = await db
        .select()
        .from('user')
        .where({
          email: email,
          password: password,
        })
        .first();

      console.log(userDB);

      if (!userDB) return;

      return jwt.sign(
        {
          email: userDB.email,
          password: userDB.password,
          username: userDB.username,
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
