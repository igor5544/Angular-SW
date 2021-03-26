/** Planet from base interface */
export interface PlanetDto {
  /** Main fields */
  fields: PlanetFieldsDto;
  /** Personal key */
  pk: number;
}

interface PlanetFieldsDto {
  /** Name */
  name: string;
  /** Created date */
  created: Date;
  /** Edited date */
  edited: Date;
  /** Climate */
  climate: string;
  /** Diametr */
  diameter: string;
  /** Gravity */
  gravity: string;
  /** Orbital period */
  orbital_period: string;
  /** Population */
  population: string;
  /** Rotation period */
  rotation_period: string;
  /** Water */
  surface_water: string;
  /** Terrain */
  terrain: string;
}
