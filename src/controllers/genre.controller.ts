import Types from '../services/types/types';

import container from '../services/inversify.config';
import { GenreService } from '../services/genre.service';

let _GenreService = container.get<GenreService>(Types.GenreService);

export async function getAllGenres(request, response) {
  const respuesta = await _GenreService.get_genres();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Error getting genres');
}

export async function getAllRoles(request, response) {
  const respuesta = await _GenreService.get_roles();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Error getting roles');
}

export const GenreController = {
  getAllGenres,
  getAllRoles,
};
