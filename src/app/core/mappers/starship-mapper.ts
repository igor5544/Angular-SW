import { StarshipDto } from '../dtos/starship-dto';
import { Starship } from '../models/starship';

/** Mapper for starship */
export class StarshipMapper {
  /** Get correct starship format */
  public getStarship(starshipData: StarshipDto): Starship {
    const starship: Starship = {
      mglt:  starshipData.fields.MGLT,
      hyperdrive:  starshipData.fields.hyperdrive_rating,
      class:  starshipData.fields.starship_class,
      pk: starshipData.pk,
    };

    return new Starship(starship);
  }
}
