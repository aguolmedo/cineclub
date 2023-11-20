import { injectable } from 'inversify';
import { IStatisticsService } from './interface/istatistics.interface';
import Types from '../services/types/types';

import { MovieService } from '../services/movie.service';
import Movie from '../model/movie.model';
import axios, { all } from 'axios';
import container from '../services/inversify.config';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class StatisticsService implements IStatisticsService {
  _MovieService = container.get<MovieService>(Types.MovieService);

  async get_most_viewed_movie() {
    try {
      const allMovies: Movie[] = await this._MovieService.get_movies();
      let vimeoData = {
        generos: [],
        nameMovie: '',
        mostViewed: 0,
        mostViewedIdVimeo: '',
      };

      for (const movie of allMovies) {
        let idVimeo = movie.linkPelicula.split('vimeo.com/')[1];

        if (idVimeo) {
          const response = await axios.get(
            `https://vimeo.com/api/v2/video/${idVimeo}.json`,
          );
          const vimeoStats = response.data[0];

          if (vimeoStats.stats_number_of_plays > vimeoData.mostViewed) {
            vimeoData.mostViewed = vimeoStats.stats_number_of_plays;
            vimeoData.mostViewedIdVimeo = vimeoStats.id;
          }
        }
      }
      const filteredMovies = allMovies.filter((movie) =>
        movie.linkPelicula.includes(vimeoData.mostViewedIdVimeo),
      );
      vimeoData.nameMovie = filteredMovies[0].nombre;
      vimeoData.generos = filteredMovies[0].generos;

      return vimeoData;
    } catch (e) {
      console.log(e);
    }
  }
}
