/** Species from base interface */
export interface SpeciesDto {
  /** Main fields */
  fields: SpeciesFieldsDto;
  /** Personal key */
  pk: number;
}

interface SpeciesFieldsDto {
  /** Name */
  name: string;
  /** Created date */
  created: Date;
  /** Edited date */
  edited: Date;
  /** Height */
  average_height: number;
  /** Life */
  average_lifespan: number;
  /** Classification */
  classification: string;
  /** Designation */
  designation: string;
  /** Eye color */
  eye_colors: string;
  /** Hair color */
  hair_colors: string;
  /** Home  */
  homeworld: string;
  /** Language */
  language: string;
  /** Skin color */
  skin_colors: string;
}
