import { AuthController } from './controllers/auth.controller';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { UserController } from './controllers/user.controller';

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
    path: '/user',
    auth: false,
    method: 'post',
    action: UserController.createUser,
  },
];
