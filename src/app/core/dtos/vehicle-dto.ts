/** Vehicle from base interface */
export interface VehicleDto {
  /** Main fields */
  fields: VehicleFieldsDto;
  /** Personal key */
  pk: number;
}

interface VehicleFieldsDto {
  /** Vehicle class */
  vehicle_class: string;
}
