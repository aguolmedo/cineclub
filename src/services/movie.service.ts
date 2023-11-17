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
        newMovie.oculta = pelicula.BL_OCULTA === 'S';
        newMovie.estreno = pelicula.BL_ESTRENO === 'S';

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
        newMovie.idPelicula = pelicula.ID_PELICULA;
        allMovies.push(newMovie);
      });

      return allMovies;
    } catch (e) {
      console.log(e);
    }
  }

  async create_movie(movie: Movie, imgPoster, imgEstreno) {
    try {
      await db.raw(`Call PR_INSERTAR_PELICULA(
      "${movie.nombre}",${movie.duracion},"${movie.sinopsis}","${movie.pais}",${movie.anioEstreno},"${movie.idioma}","${movie.soporte}","${movie.calificacion}"
      );`);

      await db.raw(`Call SP_AGREGAR_GENERO_A_PELICULA(
        "${movie.nombre}","${movie.generos.toString()}"
      );`);

      let movieDb = await db
        .select('ID_FICHA', 'ID_PELICULA')
        .from('PELICULA')
        .where({
          NOMBRE: movie.nombre,
        })
        .first();

      let moviePosterFormat = imgPoster.mimetype.split('/')[1];
      let movieEstrenoFormat = imgEstreno.mimetype.split('/')[1];

      movie.linkPoster = await this._GoogleCloudService.upload_file(
        `movie-posters/movieId${movieDb.ID_PELICULA}-poster.${moviePosterFormat}`,
        imgPoster,
      );
      movie.linkEstreno = await this._GoogleCloudService.upload_file(
        `movie-posters/movieId${movieDb.ID_PELICULA}-estreno.${movieEstrenoFormat}`,
        imgEstreno,
      );

      movie.elenco.forEach(async (elenco: Elenco) => {
        await db.raw(
          `Call INSERTAR_ELENCO("${elenco.nombreRol}","${elenco.nombre}","${elenco.apellido}","${movieDb.ID_FICHA}")`,
        );
      });
      if (movie.premios.length > 0) {
        movie.premios.forEach(async (award: Award) => {
          await db.raw(
            `Call PR_INSERTAR_PREMIO("${award.nombre}","${award.descripcion}","${award.anio}","${movie.nombre}")`,
          );
        });
      }

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

  async deleteMovie(movieName: string): Promise<any> {
    try {
      const movieDb = await db('PELICULA')
        .where({ NOMBRE: movieName })
        .select('ID_PELICULA')
        .first();

      if (!movieDb) return false;

      await db.raw(`Call SP_BAJA_PELICULA(${movieDb.ID_PELICULA});`);
    } catch (error) {
      console.error('Error updating movie:', error);
      return false;
    }
  }

  async update_movie(movie: Movie, imgPoster, imgEstreno) {
    try {
      // Update the movie details in the PELICULA table
      const movieDb = await db('PELICULA')
        .where({ ID_PELICULA: movie.idPelicula })
        .select('ID_PELICULA', 'ID_FICHA')
        .first();

      await db('FICHATECNICA')
        .where({ ID_FICHA_TECNICA: movieDb.ID_FICHA })
        .update({
          DURACION: movie.duracion,
          SINOPSIS: movie.sinopsis,
          PAIS: movie.pais,
          AÑO: movie.anioEstreno,
          IDIOMA: movie.idioma,
          SOPORTE: movie.soporte,
          CALIFICACION: movie.calificacion,
        });

      // Update the genres associated with the movie in PELICULASxGENERO table
      await db('PELICULASXGENERO')
        .where({ ID_PELICULA: movieDb.ID_PELICULA })
        .del(); // Delete existing genre associations

      // Insert new genre associations
      await db.raw(`Call SP_AGREGAR_GENERO_A_PELICULA(
        "${movie.nombre}","${movie.generos.toString()}"
      );`);

      // Update the elenco associated with the movie in PELICULASXELENCO table
      await db('PELICULASXELENCO')
        .where({ ID_FICHA_TECNICA: movieDb.ID_FICHA })
        .del(); // Delete existing elenco associations

      // Insert new elenco information
      movie.elenco.forEach(async (elenco: Elenco) => {
        await db.raw(
          `Call INSERTAR_ELENCO("${elenco.nombreRol}","${elenco.nombre}","${elenco.apellido}","${movieDb.ID_FICHA}")`,
        );
      });

      // Update the genres associated with the movie in PELICULASXPREMIO table
      await db('PELICULASXPREMIO')
        .where({ ID_FICHA_TECNICA: movieDb.ID_FICHA })
        .del(); // Delete existing premios information

      // Insert new premios information
      if (movie.premios.length > 0) {
        movie.premios.forEach(async (award: Award) => {
          await db.raw(
            `Call PR_INSERTAR_PREMIO("${award.nombre}","${award.descripcion}","${award.anio}","${movie.nombre}")`,
          );
        });
      }

      // Update the URL information in the URL table
      await db('URL')
        .where({
          ID_PELICULA: movieDb.ID_PELICULA,
        })
        .whereIn('ID_TIPO_URL', [3, 4])
        .del(); // Delete existing URL information

      // Insert new URL information
      await db.raw(
        `Call INSERTAR_URL("${movie.nombre}","PELICULA","${movie.linkPelicula}")`,
      );

      if (imgEstreno) {
        await db('URL')
          .where({
            ID_PELICULA: movieDb.ID_PELICULA,
            ID_TIPO_URL: 4, //4 es ESTRENO
          })
          .del();
        let movieEstrenoFormat = imgEstreno.mimetype.split('/')[1];

        movie.linkEstreno = await this._GoogleCloudService.upload_file(
          `movie-posters/movieId${movieDb.ID_PELICULA}-estreno.${movieEstrenoFormat}`,
          imgEstreno,
        );

        await db.raw(
          `Call INSERTAR_URL("${movie.nombre}","ESTRENO","${movie.linkEstreno}")`,
        );
      }
      if (imgPoster) {
        await db('URL')
          .where({
            ID_PELICULA: movieDb.ID_PELICULA,
            ID_TIPO_URL: 3, // 3 es POSTER
          })
          .del();
        let moviePosterFormat = imgPoster.mimetype.split('/')[1];

        movie.linkPoster = await this._GoogleCloudService.upload_file(
          `movie-posters/movieId${movieDb.ID_PELICULA}-poster.${moviePosterFormat}`,
          imgPoster,
        );

        await db.raw(
          `Call INSERTAR_URL("${movie.nombre}","POSTER","${movie.linkPoster}")`,
        );
      }
      if (movie.linkTrailer) {
        await db.raw(
          `Call INSERTAR_URL("${movie.nombre}","TRAILER","${movie.linkTrailer}")`,
        );
      }

      console.log('-- Movie updated successfully.');
      return true;
    } catch (error) {
      console.error('Error updating movie:', error);
      return false;
    }
  }

  async switch_boolean_estreno(nombrePelicula: string) {
    try {
      await db('PELICULA')
        .where({ NOMBRE: nombrePelicula })
        .update({
          BL_ESTRENO: db.raw(
            "CASE WHEN BL_ESTRENO = 'N' THEN 'S' ELSE 'N' END",
          ),
        });

      console.log(`Toggled BL_ESTRENO for ${nombrePelicula}`);
      return true;
    } catch (error) {
      console.error('Error toggling BL_ESTRENO:', error.message);
    }
  }

  async switch_boolean_oculta(nombrePelicula: string) {
    try {
      await db('PELICULA')
        .where({ NOMBRE: nombrePelicula })
        .update({
          BL_OCULTA: db.raw("CASE WHEN BL_OCULTA = 'N' THEN 'S' ELSE 'N' END"),
        });

      console.log(`Toggled BL_OCULTA for ${nombrePelicula}`);
      return true;
    } catch (error) {
      console.error('Error toggling BL_OCULTA:', error.message);
    }
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
