import { Container } from 'inversify';
import Types from './types/types';
import { IAuthService } from './interface/iauth.interface';
import { AuthService } from './auth.service';
import { IHealthcheckService } from './interface/ihealthcheck.interface';
import { HealthcheckService } from './healthcheck.service';

const container = new Container();

container.bind<IAuthService>(Types.AuthService).to(AuthService);
container
  .bind<IHealthcheckService>(Types.HealthcheckService)
  .to(HealthcheckService);

export default container;
