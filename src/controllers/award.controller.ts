import Types from '../services/types/types';

import container from '../services/inversify.config';
import { AwardService } from '../services/award.service';

let _AwardService = container.get<AwardService>(Types.AwardService);

export async function getAllAwards(request, response) {
  const respuesta = await _AwardService.get_awards();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Error getting awards');
}

export async function createAward(request, response) {
  if (!request.body.nombre || !request.body.descripcion || !request.body.anio) {
    response.status(400).json('Incomplete request.');
  }
  const respuesta = await _AwardService.create_award(request.body);
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Error creating award');
}

export const AwardController = {
  getAllAwards,
  createAward,
};
