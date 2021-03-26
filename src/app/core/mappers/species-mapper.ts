import { SpeciesDto } from '../dtos/species-dto';
import { Species } from '../models/species';

/** Mapper for species */
export class SpeciesMapper {
  /** Get correct species format */
  public getSpecies(speciesData: SpeciesDto): Species {
    const species: Species = {
      name: speciesData.fields.name,
      created: speciesData.fields.created,
      edited: speciesData.fields.edited,
      height: speciesData.fields.average_height,
      life: speciesData.fields.average_lifespan,
      classification: speciesData.fields.classification,
      designation: speciesData.fields.designation,
      eye: speciesData.fields.eye_colors,
      hair: speciesData.fields.hair_colors,
      home: speciesData.fields.homeworld,
      language: speciesData.fields.language,
      skin: speciesData.fields.skin_colors,
      pk: speciesData.pk,
    };

    return new Species(species);
  }
}
