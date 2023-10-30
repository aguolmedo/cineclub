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

export const MovieController = {
  uploadFrontPageVideo,
  getFrontPageVideo,
};
