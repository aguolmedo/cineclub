import { injectable } from 'inversify';
import { IMovieService } from './interface/imovie.interface';
import container from './inversify.config';
import { GoogleCloudService } from './google-bucket.service';
import Types from './types/types';
import Movie from '../model/movie.model';
import Award from '../model/award.model';
import Elenco from '../model/elenco.model';

const db = require('../dbconfig');

// @ts-ignore
@injectable()
export class MovieService implements IMovieService {
  _GoogleCloudService = container.get<GoogleCloudService>(
    Types.GoogleCloudService,
  );

  async createMovie(movie: Movie, imgPoster, imgEstreno) {
    try {
      let moviePosterFormat = imgPoster.mimetype.split('/')[1];
      let movieEstrenoFormat = imgEstreno.mimetype.split('/')[1];

      movie.linkPoster = await this._GoogleCloudService.upload_file(
        `movie-posters/${movie.nombre}-${movie.anioEstreno}-poster.${moviePosterFormat}`,
        imgPoster,
      );
      movie.linkEstreno = await this._GoogleCloudService.upload_file(
        `movie-posters/${movie.nombre}-${movie.anioEstreno}-estreno.${movieEstrenoFormat}`,
        imgEstreno,
      );

      await db.raw(`Call PR_INSERTAR_PELICULA(
      "${movie.nombre}",${movie.duracion},"${movie.sinopsis}","${movie.pais}",${movie.anioEstreno},"${movie.idioma}","${movie.soporte}","${movie.calificacion}"
      );`);

      await db.raw(`Call SP_AGREGAR_GENERO_A_PELICULA(
        "${movie.nombre}","${movie.generos.toString()}"
      );`);

      let idFicha = await db
        .select('ID_FICHA')
        .from('PELICULA')
        .where({
          NOMBRE: movie.nombre,
        })
        .first();

      movie.elenco.forEach(async (elenco: Elenco) => {
        await db.raw(
          `Call INSERTAR_ELENCO("${elenco.nombreRol}","${elenco.nombre}","${elenco.apellido}","${idFicha.ID_FICHA}")`,
        );
      });
      movie.premios.forEach(async (award: Award) => {
        await db.raw(
          `Call PR_INSERTAR_PREMIO("${award.nombre}","${award.descripcion}","${award.anio}","${movie.nombre}")`,
        );
      });

      await db.raw(
        `Call INSERTAR_URL("${movie.nombre}","PELICULA","${movie.linkPelicula}")`,
      );
      await db.raw(
        `Call INSERTAR_URL("${movie.nombre}","ESTRENO","${movie.linkEstreno}")`,
      );
      await db.raw(
        `Call INSERTAR_URL("${movie.nombre}","POSTER","${movie.linkPoster}")`,
      );

      if (movie.linkTrailer) {
        await db.raw(
          `Call INSERTAR_URL("${movie.nombre}","TRAILER","${movie.linkTrailer}")`,
        );
      }
      console.log('-- Movie created Succesfully.');
      return true;
    } catch (e) {
      console.log(`${e}`);
      return false;
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
