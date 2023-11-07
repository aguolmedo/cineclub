import Movie from '../../model/movie.model';

export interface IMovieService {
  createMovie(data: Movie, moviePoster: any);
  editMovie(data: any): Promise<any>;
  deleteMovie(data: any): Promise<any>;
}
