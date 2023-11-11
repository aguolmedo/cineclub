import { injectable } from 'inversify';
import { IMovieService } from './interface/imovie.interface';
import container from './inversify.config';
import { GoogleCloudService } from './google-bucket.service';
import Types from './types/types';
import Movie from '../model/movie.model';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class MovieService implements IMovieService {
  _GoogleCloudService = container.get<GoogleCloudService>(
    Types.GoogleCloudService,
  );

  async createMovie(movie: Movie, moviePoster) {
    try {
      let moviePosterFormat = moviePoster.mimetype.split('/')[1];

      await this._GoogleCloudService.upload_file(
        `movie-posters/${movie.nombre}-${movie.anioEstreno}.${moviePosterFormat}`,
        moviePoster,
      );

      await db.raw(`Call PR_INSERTAR_PELICULA(
      "${movie.nombre}",${movie.duracion},"${movie.sinopsis}","${movie.pais}",${movie.anioEstreno},"${movie.idioma}","${movie.soporte}","${movie.calificacion}"
      );`);

      await db.raw(`CALL SP_AGREGAR_GENERO_A_PELICULA(
        "${movie.nombre}","${movie.generos.toString()}"
      )`);

      console.log('Movie created Succesfully.');
      return true;
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }
  editMovie(data: any): Promise<any> {
    throw new Error('Method not implementado capo.');
  }
  deleteMovie(data: any): Promise<any> {
    throw new Error('Metodo no implementado');
  }

  async upload_front_page_video(videoFile: any) {
    let resourceUrl = await this._GoogleCloudService.upload_file(
      'front-page/front-page-video.mp4',
      videoFile,
    );

    if (!resourceUrl) return false;

    console.log('Front page video updated succesfully.');
    return resourceUrl;
  }

  async get_front_page_video() {
    let frontPageVideoUrl = await this._GoogleCloudService.get_file_url(
      'front-page/front-page-video.mp4',
    );

    if (!frontPageVideoUrl) return false;

    return frontPageVideoUrl;
  }
}
