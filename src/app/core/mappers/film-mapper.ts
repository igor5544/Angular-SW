import { FilmDto } from '../dtos/film-dto';
import { Film } from '../models/film';

/** Mapper for film */
export class FilmMapper {
  /** Get correct film format */
  public getFilm(filmData: FilmDto, id: string): Film {
    const film: Film = {
      title: filmData.fields.title,
      created: new Date(filmData.fields.created),
      edited: new Date(filmData.fields.edited),
      director: filmData.fields.director,
      opening: filmData.fields.opening_crawl,
      producer: filmData.fields.producer,
      release: new Date(filmData.fields.release_date),
      characters: filmData.fields.characters,
      planets: filmData.fields.planets,
      species: filmData.fields.species,
      starships: filmData.fields.starships,
      vehicles: filmData.fields.vehicles,
      id: id,
    };

    return new Film(film);
  }

  /** Convert Film model to Film Dto */
  public getFilmDto(filmData: Film): FilmDto {
    const filmDto: FilmDto = {
      fields: {
        title: filmData.title,
        created: filmData.created,
        edited: filmData.edited,
        director: filmData.director,
        opening_crawl: filmData.opening,
        producer: filmData.producer,
        release_date: filmData.release,
        characters: filmData.characters,
        planets: filmData.planets,
        species: filmData.species,
        starships: filmData.starships,
        vehicles: filmData.vehicles,
      },
    };

    return filmDto;
  }
}
