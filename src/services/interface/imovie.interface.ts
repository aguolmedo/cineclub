import Movie from '../../model/movie.model';

export interface IMovieService {
  create_movie(data: Movie, imgPoster: any, imgEstreno);
  update_movie(data: any, imgPoster: any, imgEstreno): Promise<any>;
  deleteMovie(data: any): Promise<any>;
  get_movies(): Promise<any>;
}
