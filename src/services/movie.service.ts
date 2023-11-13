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

  async get_movies(): Promise<any> {
    try {
      let allMovies: Movie[] = [];

      const peliculasData = await db
        .select('PELICULA.*', 'FICHATECNICA.*')
        .from('PELICULA')
        .join(
          'FICHATECNICA',
          'PELICULA.ID_FICHA',
          '=',
          'FICHATECNICA.ID_FICHA_TECNICA',
        );

      const urlsData = await db
        .select(
          'URL.TX_URL',
          'URL.ID_PELICULA',
          'TIPO_URL.TX_DESCRIPCION as TIPO_URL',
        )
        .from('URL')
        .leftJoin('TIPO_URL', 'URL.ID_TIPO_URL', '=', 'TIPO_URL.ID_TIPO_URL');

      const elencoData = await db

        .select(
          'ELENCO.NOMBRE',
          'ELENCO.APELLIDO',
          'ROL.DESCRIPCION as NOMBRE_ROL',
          'PELICULASXELENCO.ID_FICHA_TECNICA',
        )
        .from('ELENCO')
        .leftJoin('ROL', 'ELENCO.ID_ROL', '=', 'ROL.ID_ROL')
        .leftJoin(
          'PELICULASXELENCO',
          'ELENCO.ID_ELENCO',
          '=',
          'PELICULASXELENCO.ID_ELENCO',
        );

      const generosData = await db
        .select('GENERO.NOMBRE as GENERO', 'PELICULASXGENERO.ID_PELICULA')
        .from('PELICULASXGENERO')
        .leftJoin(
          'GENERO',
          'PELICULASXGENERO.ID_GENERO',
          '=',
          'GENERO.ID_GENERO',
        );

      const premiosData = await db
        .select(
          'PREMIO.NOMBRE',
          'PREMIO.DESCRIPCION',
          'PREMIO.AÑO',
          'PELICULASXPREMIO.ID_FICHA_TECNICA',
        )
        .from('PREMIO')
        .leftJoin(
          'PELICULASXPREMIO',
          'PREMIO.ID_PREMIO',
          '=',
          'PELICULASXPREMIO.ID_PREMIO',
        );

      peliculasData.forEach((pelicula) => {
        let newMovie: Movie = new Movie(
          pelicula.NOMBRE,
          pelicula.DURACION,
          pelicula.SINOPSIS,
          [],
          pelicula.PAIS,
          pelicula.AÑO,
          pelicula.IDIOMA,
          pelicula.SOPORTE,
          [], // Initial value for premios
          [], // Initial value for elenco
          pelicula.ID_FICHA_TECNICA,
          pelicula.CALIFICACION,
          '', // Initial value for linkTrailer
          '', // Initial value for linkPelicula
          '', // Initial value for linkPoster
          '', // Initial value for linkEstreno
        );
        newMovie.oculta = pelicula.BL_OCULTA === 's';

        urlsData.forEach((url) => {
          if (url.ID_PELICULA === pelicula.ID_PELICULA) {
            switch (url.TIPO_URL) {
              case 'TRAILER':
                newMovie.linkTrailer = url.TX_URL;
                break;
              case 'PELICULA':
                newMovie.linkPelicula = url.TX_URL;
                break;
              case 'POSTER':
                newMovie.linkPoster = url.TX_URL;
                break;
              case 'ESTRENO':
                newMovie.linkEstreno = url.TX_URL;
                break;
            }
          }
        });

        generosData.forEach((genero) => {
          // Assuming genero.ID_PELICULA matches pelicula.ID_PELICULA
          if (genero.ID_PELICULA === pelicula.ID_PELICULA) {
            newMovie.generos.push(genero.GENERO);
          }
        });

        elencoData.forEach((actor) => {
          if (actor.ID_FICHA_TECNICA === pelicula.ID_FICHA_TECNICA) {
            const newElenco: Elenco = {
              nombre: actor.NOMBRE,
              apellido: actor.APELLIDO,
              nombreRol: actor.NOMBRE_ROL,
            };
            newMovie.elenco.push(newElenco);
          }
        });

        premiosData.forEach((premio) => {
          if (premio.ID_FICHA_TECNICA === pelicula.ID_FICHA_TECNICA) {
            const newPremio: Award = {
              anio: premio.AÑO,
              descripcion: premio.DESCRIPCION,
              nombre: premio.NOMBRE,
            };
            newMovie.premios.push(newPremio);
          }
        });

        allMovies.push(newMovie);
      });

      return allMovies;
    } catch (e) {
      console.log(e);
    }
  }

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
