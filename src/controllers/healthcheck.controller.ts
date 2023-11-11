import { HealthcheckService } from '../services/healthcheck.service';
import Types from '../services/types/types';

import container from '../services/inversify.config';

let _HealthcheckService = container.get<HealthcheckService>(
  Types.HealthcheckService,
);

export async function healthCheck(request, response) {
  const respuesta = await _HealthcheckService.healthcheck();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Server Error');
}

export const HealthcheckController = {
  healthCheck,
};
