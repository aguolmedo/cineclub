import { AuthController } from './controllers/AuthController';
import { HealthcheckController } from './controllers/HealthcheckController';
import { requireAuth } from './middleware/auth.middleware';
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
