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
    const respuesta = await _MovieService.upload_front_page_video(
      request.files.video,
    );
    if (respuesta) response.status(200).json('Video uploaded');
  } catch (e) {
    response.status(500).json(e.toString());
  }
}

export const MovieController = {
  uploadFrontPageVideo,
};
