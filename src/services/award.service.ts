import { injectable } from 'inversify';
import { IAwardService } from './interface/iaward.interface';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class AwardService implements IAwardService {
  async get_awards(): Promise<any> {
    const awards = await db
      .select('NOMBRE', 'DESCRIPCION', 'AÑO')
      .from('PREMIO');

    return awards;
  }

  async create_award(award: any) {
    const newAward = await db
      .insert({
        NOMBRE: award.nombre,
        DESCRIPCION: award.descripcion,
        AÑO: award.anio,
      })
      .into('PREMIO');

    if (!newAward) throw 'Error inserting user in db';

    return true;
  }
}
