import Movie from '../../model/movie.model';

export interface IMovieService {
  createMovie(data: Movie, imgPoster: any, imgEstreno);
  editMovie(data: any): Promise<any>;
  deleteMovie(data: any): Promise<any>;
  get_movies(): Promise<any>;
}
