import { HealthcheckService } from '../services/healthcheck.service';
import Types from '../services/types/types';

import container from '../services/inversify.config';
import { GoogleCloudService } from '../services/google-bucket.service';

let _HealthcheckService = container.get<HealthcheckService>(
  Types.HealthcheckService,
);

let _GoogleCloudService = container.get<GoogleCloudService>(
  Types.GoogleCloudService,
);

export async function healthCheck(request, response) {
  const respuesta = await _HealthcheckService.healthcheck();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Server Error');
}

export async function listFiles(request, response) {
  const respuesta = await _GoogleCloudService.list_files();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Server Error');
}

export const HealthcheckController = {
  healthCheck,
  listFiles,
};
