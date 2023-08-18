import { AuthController } from "./controllers/AuthController";
import { HealthcheckController } from "./controllers/HealthcheckController";
export const AppRoutes = [
  {
    path: "/healthCheck",
    method: "get",
    action: HealthcheckController.healthCheck,
  },

  {
    path: "/token",
    method: "post",
    action: AuthController.accessToken,
  },
];
