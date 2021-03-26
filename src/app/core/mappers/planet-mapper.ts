import { PlanetDto } from '../dtos/planet-dto';
import { Planet } from '../models/planet';

/** Mapper for planet */
export class PlanetMapper {
  /** Get correct planet format */
  public getPlanet(planetData: PlanetDto): Planet {
    const planet: Planet = {
      name: planetData.fields.name,
      created: planetData.fields.created,
      edited: planetData.fields.edited,
      climate: planetData.fields.climate,
      diameter: planetData.fields.diameter,
      gravity: planetData.fields.gravity,
      orbitalPeriod: planetData.fields.orbital_period,
      population: planetData.fields.population,
      rotationPeriod: planetData.fields.rotation_period,
      water: planetData.fields.surface_water,
      terrain: planetData.fields.terrain,
      pk: planetData.pk,
    };

    return new Planet(planet);
  }
}
