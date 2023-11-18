import { StatisticsService } from '../services/statistics.service';
import Types from '../services/types/types';

import container from '../services/inversify.config';

let _StatisticsService = container.get<StatisticsService>(
  Types.StatisticsService,
);

export async function getMostViewedMovie(request, response) {
  const respuesta = await _StatisticsService.get_most_viewed_movie();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Server Error');
}

export const StatisticsController = {
  getMostViewedMovie,
};
