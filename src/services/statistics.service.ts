import { injectable } from 'inversify';
import { IStatisticsService } from './interface/istatistics.interface';
import Types from '../services/types/types';

import { MovieService } from '../services/movie.service';
import Movie from '../model/movie.model';
import axios, { all } from 'axios';
import container from '../services/inversify.config';

// @ts-ignore
@injectable()
export class StatisticsService implements IStatisticsService {
  _MovieService = container.get<MovieService>(Types.MovieService);

  async get_most_viewed_movie() {
    const allMovies: Movie[] = await this._MovieService.get_movies();
    let vimeoData = {
      mostViewed: 0,
      mostViewdIdVimeo: '',
    };

    for (const movie of allMovies) {
      try {
        let idVimeo = movie.linkPelicula.split('vimeo.com/')[1];

        if (idVimeo) {
          const response = await axios.get(
            `https://vimeo.com/api/v2/video/${idVimeo}.json`,
          );
          const vimeoStats = response.data[0];

          if (vimeoStats.stats_number_of_plays > vimeoData.mostViewed) {
            vimeoData.mostViewed = vimeoStats.stats_number_of_plays;
            vimeoData.mostViewdIdVimeo = vimeoStats.id;
          }
        }
      } catch (e) {
        console.log(e);
        // Handle the error as needed
      }
    }

    return vimeoData;
  }
}
