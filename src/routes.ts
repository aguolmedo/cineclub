import { AuthController } from './controllers/auth.controller';
import { HealthcheckController } from './controllers/healthcheck.controller';
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
];
