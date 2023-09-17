import { injectable } from 'inversify';
import { IHealthcheckService } from './interface/IHealthcheckService';
// @ts-ignore
@injectable()
export class HealthcheckService implements IHealthcheckService {
  public async healthCheck() {
    return { version: '1.0.0' };
  }
}
