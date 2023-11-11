import { injectable } from 'inversify';
import { IAwardService } from './interface/iaward.interface';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class AwardService implements IAwardService {
  async get_awards(): Promise<any> {
    const awards = await db
      .select('NOMBRE', 'DESCRIPCION', 'ANIO')
      .from('PREMIO');

    return awards;
  }
}
