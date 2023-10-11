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
    throw new Error('Method not implemented.');
  }
}
