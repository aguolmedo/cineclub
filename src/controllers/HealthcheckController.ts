import { HealthcheckService } from "../services/HealthcheckService";
import Types from "../services/types/types";

import container from "../services/inversify.config";

let _HealthcheckService = container.get<HealthcheckService>(
  Types.HealthcheckService,
);

export async function healthCheck(request, response) {
  if (!request.headers.authorization) {
    response.status(401).json("auth error \n debes mandar un token (jwt)");
    return;
  }
  const respuesta = await _HealthcheckService.healthCheck();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json("Server Error");
}

export const HealthcheckController = {
  healthCheck,
};
