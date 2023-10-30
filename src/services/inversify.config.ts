import { Container } from 'inversify';
import Types from './types/types';
import { IAuthService } from './interface/iauth.interface';
import { AuthService } from './auth.service';
import { IHealthcheckService } from './interface/ihealthcheck.interface';
import { HealthcheckService } from './healthcheck.service';
import { IUserService } from './interface/iuser.interface';
import { UserService } from './user.service';
import { IMovieService } from './interface/imovie.interface';
import { MovieService } from './movie.service';
import { GoogleCloudService } from './google-bucket.service';
import { IGoogleCloudService } from './interface/igoogle-bucket.interface';
const container = new Container();

container.bind<IAuthService>(Types.AuthService).to(AuthService);
container
  .bind<IHealthcheckService>(Types.HealthcheckService)
  .to(HealthcheckService);
container.bind<IUserService>(Types.UserService).to(UserService);

container.bind<IMovieService>(Types.MovieService).to(MovieService);

container
  .bind<IGoogleCloudService>(Types.GoogleCloudService)
  .to(GoogleCloudService);

export default container;
