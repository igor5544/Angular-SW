/** Starship from base interface */
export interface StarshipDto {
  /** Main fields */
  fields: StarshipFieldsDto;
  /** Personal key */
  pk: number;
}

interface StarshipFieldsDto {
  /** MGLT */
  MGLT: number;
  /** Hyperdrive */
  hyperdrive_rating: number;
  /** Starship class */
  starship_class: string;
}
