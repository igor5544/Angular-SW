/** People from base interface */
export interface PeopleDto {
  /** Main fields */
  fields: PeopleFieldsDto;
  /** Personal key */
  pk: number;
}

interface PeopleFieldsDto {
  /** Name */
  name: string;
  /** Created date */
  created: Date;
  /** Edited date */
  edited: Date;
  /** Birth */
  birth_year: string;
  /** Eyes color */
  eye_color: string;
  /** Gender */
  gender: string;
  /** Hair color */
  hair_color: string;
  /** Height */
  height: string;
  /** Home */
  homeworld: number;
  /** Mass */
  mass: string;
  /** Skin color */
  skin_color: string;
}
