import { injectable } from 'inversify';
import { IMovieService } from './interface/imovie.interface';
import container from './inversify.config';
import { GoogleCloudService } from './google-bucket.service';
import Types from './types/types';

// @ts-ignore
@injectable()
export class MovieService implements IMovieService {
  _GoogleCloudService = container.get<GoogleCloudService>(
    Types.GoogleCloudService,
  );

  createMovie(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  editMovie(data: any): Promise<any> {
    throw new Error('Method not implementado capo.');
  }
  deleteMovie(data: any): Promise<any> {
    throw new Error('Metodo no implementado');
  }

  async upload_front_page_video(videoFile: any) {
    let resourceUrl = await this._GoogleCloudService.upload_file(
      'front-page/front-page-video',
      videoFile,
    );

    if (!resourceUrl) return false;

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
