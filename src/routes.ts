import { AuthController } from './controllers/auth.controller';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { UserController } from './controllers/user.controller';
import { MovieController } from './controllers/movie.controller';
import { AwardController } from './controllers/award.controller';
import { GenreController } from './controllers/genre.controller';
export const AppRoutes = [
  {
    path: '/healthCheck',
    auth: false,
    method: 'get',
    action: HealthcheckController.healthCheck,
  },
  {
    path: '/token',
    auth: false,
    method: 'get',
    action: AuthController.accessToken,
  },
  {
    path: '/verifyToken',
    auth: false,
    method: 'post',
    action: AuthController.verifyToken,
  },
  {
    path: '/user',
    auth: false,
    method: 'post',
    action: UserController.createUser,
  },
  {
    path: '/modifyUser',
    auth: true,
    method: 'put',
    action: UserController.modifyUser,
  },
  {
    path: '/tokenPassword',
    auth: false,
    method: 'post',
    action: UserController.genereteTokenRecoverPassword,
  },
  {
    path: '/recoverPassword',
    auth: false,
    method: 'post',
    action: UserController.recoverPassword,
  },
  {
    path: '/uploadFrontPageVideo',
    auth: false,
    method: 'post',
    action: MovieController.uploadFrontPageVideo,
  },
  {
    path: '/getFrontPageVideo',
    auth: false,
    method: 'get',
    action: MovieController.getFrontPageVideo,
  },
  {
    path: '/createMovie',
    auth: false,
    method: 'post',
    action: MovieController.createMovie,
  },
  {
    path: '/genres',
    auth: false,
    method: 'get',
    action: GenreController.getAllGenres,
  },
  {
    path: '/roles',
    auth: false,
    method: 'get',
    action: GenreController.getAllRoles,
  },
  {
    path: '/awards',
    auth: false,
    method: 'get',
    action: AwardController.getAllAwards,
  },
  {
    path: '/award',
    auth: false,
    method: 'post',
    action: AwardController.createAward,
  },
];
