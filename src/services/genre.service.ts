import { injectable } from 'inversify';
import { IGenreService } from './interface/igenre.interface';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class GenreService implements IGenreService {
  async get_roles(): Promise<any> {
    const roles = await db.select('DESCRIPCION').from('ROL');
    return roles;
  }
  async get_genres(): Promise<any> {
    const genres = await db.select('NOMBRE').from('GENERO');

    return genres;
  }
}
