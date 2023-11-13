import Award from './award.model';
import Elenco from './elenco.model';

class Movie {
  public nombre: string;
  public duracion: number;
  public sinopsis: string;
  public generos: string[];
  public pais: string;
  public estreno: boolean;
  public anioEstreno: number;
  public idioma: string;
  public soporte: string;
  public calificacion: string;
  public premios: Award[];
  public elenco: Elenco[];
  public idFichaTecnica: number;
  public idPelicula: number;
  public linkTrailer: string;
  public linkPelicula: string;
  public linkPoster: string;
  public linkEstreno: string;
  public oculta: boolean;

  constructor(
    nombre: string,
    duracion: number,
    sinopsis: string,
    generos: string[],
    pais: string,
    anioEstreno: number,
    idioma: string,
    soporte: string,
    premios: Award[],
    elenco: Elenco[],
    idFichaTecnica: string,
    calificacion: string,
    linkTrailer: string,
    linkPelicula: string,
    linkPoster: string,
    linkEstreno: string,
  ) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.sinopsis = sinopsis;
    this.generos = generos;
    this.pais = pais;
    this.anioEstreno = anioEstreno;
    this.idioma = idioma;
    this.premios = premios;
    this.elenco = elenco;
    this.soporte = soporte;
    this.calificacion = calificacion;
    this.linkTrailer = linkTrailer;
    this.linkPelicula = linkPelicula;
    this.linkPoster = linkPoster;
    this.linkEstreno = linkEstreno;
  }
}

export default Movie;
