class Movie {
  public nombre: string;
  public duracion: number;
  public sinopsis: string;
  public generos: string[];
  public pais: string;
  public anioEstreno: number;
  public idioma: string;
  public soporte: string;
  public calificacion: string;

  constructor(
    nombre: string,
    duracion: number,
    sinopsis: string,
    generos: string[],
    pais: string,
    anioEstreno: number,
    idioma: string,
    soporte: string,
    calificacion: string,
  ) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.sinopsis = sinopsis;
    this.generos = generos;
    this.pais = pais;
    this.anioEstreno = anioEstreno;
    this.idioma = idioma;
    this.calificacion = calificacion;
  }
}

export default Movie;
