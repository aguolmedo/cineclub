import Types from '../services/types/types';

import container from '../services/inversify.config';
import { MovieService } from '../services/movie.service';

let _MovieService = container.get<MovieService>(Types.MovieService);

export async function uploadFrontPageVideo(request, response) {
  try {
    if (!request.files || !request.files.video) {
      console.log(request.files);
      console.log(request.files?.video);
      return response.status(400).json('No video file provided');
    }
    const resourceUrl = await _MovieService.upload_front_page_video(
      request.files.video,
    );
    if (resourceUrl) response.status(200).json(resourceUrl);
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export async function getFrontPageVideo(request, response) {
  try {
    const frontPageVideoUrl = await _MovieService.get_front_page_video();
    if (frontPageVideoUrl) response.status(200).json(frontPageVideoUrl);
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export async function getAllMovies(request, response) {
  const respuesta = await _MovieService.get_movies();
  if (respuesta) response.status(200).json(respuesta);
  else response.status(500).json('Error getting movies');
}

export async function createMovie(request, response) {
  try {
    request.body.premios = JSON.parse(request.body.premios);
    request.body.elenco = JSON.parse(request.body.elenco);

    const movieCreated = await _MovieService.create_movie(
      request.body,
      request.files.poster,
      request.files.estreno,
    );
    if (movieCreated) response.status(200).json('Movie created succesfully');
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export async function switchBooleanEstreno(request, response) {
  try {
    const estrenoBooleanSwitched = _MovieService.switch_boolean_estreno(
      request.body.nombrePelicula,
    );

    if (estrenoBooleanSwitched)
      response.status(200).json('Estreno switched succesfully');
    else {
      response.status(400).json('Error while switching BL_ESTRENO');
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e.toString());
  }
}

export async function switchBooleanOculta(request, response) {
  try {
    const ocultaBooleanSwitched = _MovieService.switch_boolean_oculta(
      request.body.nombrePelicula,
    );

    if (ocultaBooleanSwitched)
      response.status(200).json('BL_OCULTA switched succesfully');
    else {
      response.status(400).json('Error while switching BL_OCULTAO');
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e.toString());
  }
}
export async function updateMovie(request, response) {
  try {
    request.body.premios = JSON.parse(request.body.premios);
    request.body.elenco = JSON.parse(request.body.elenco);

    const movieCreated = await _MovieService.update_movie(
      request.body,
      request.files.poster,
      request.files.estreno,
    );
    if (movieCreated) response.status(200).json('Movie updated succesfully');
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export async function deleteMovie(request, response) {
  try {
    if (!request.body.nombrePelicula)
      response.status(400).json('No nombrePelicula was sended');
    const movieDeleted = _MovieService.deleteMovie(request.body.nombrePelicula);

    if (movieDeleted) response.status(200).json('Movie deleted succesfully');
    else {
      response
        .status(400)
        .json('Error while deleting movie: ' + request.body.nombrePelicula);
    }
  } catch (e) {
    console.log(e);
    response.status(500).json(e.toString());
  }
}

export const MovieController = {
  uploadFrontPageVideo,
  getFrontPageVideo,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  switchBooleanEstreno,
  switchBooleanOculta,
};
