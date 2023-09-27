export interface IMovieService {
  createMovie(data: any): Promise<any>;
  editMovie(data: any): Promise<any>;
  deleteMovie(data: any): Promise<any>;
}
