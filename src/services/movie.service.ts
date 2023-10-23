import { injectable } from 'inversify';
import { IMovieService } from './interface/imovie.interface';

// @ts-ignore
@injectable()
export class MovieService implements IMovieService {
  createMovie(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  editMovie(data: any): Promise<any> {
    throw new Error('Method not implementado capo.');
  }
  deleteMovie(data: any): Promise<any> {
    throw new Error('Metodo no implementado');
  }

  upload_front_page_video(videoFile: any) {
    const uploadPath = 'assets/' + videoFile.name;

    videoFile.mv(
      uploadPath,
      (err) => {
        if (err) {
          console.error(err);
          return false;
        }
      },
      console.log('File received:', videoFile.name),
    );
    return true;
  }
}
