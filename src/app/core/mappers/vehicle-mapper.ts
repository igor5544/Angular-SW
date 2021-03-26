import { VehicleDto } from '../dtos/vehicle-dto';
import { Vehicle } from '../models/vehicle';

/** Mapper for vehicle */
export class VehicleMapper {
  /** Get correct vehicle format */
  public getVehicle(starshipData: VehicleDto): Vehicle {
    const vehicle: Vehicle = {
      class: starshipData.fields.vehicle_class,
      pk: starshipData.pk,
    };

    return new Vehicle(vehicle);
  }
}
