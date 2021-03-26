/** Planet class */
export class Planet {
  /** Name */
  public name!: string;
  /** Created date */
  public created: Date;
  /** Edited date */
  public edited!: Date;
  /** Climate */
  public climate: string;
  /** Diametr */
  public diameter: string;
  /** Gravity */
  public gravity!: string;
  /** Orbital period */
  public orbitalPeriod: string;
  /** Population */
  public population: string;
  /** Rotation period */
  public rotationPeriod: string;
  /** Water */
  public water: string;
  /** Terrain */
  public terrain: string;
  /** Personal key */
  public pk: number;

  constructor(data: ConstructorInitArg<Planet>) {
    this.name = data.name;
    this.created = data.created;
    this.edited = data.edited;
    this.climate = data.climate;
    this.diameter = data.diameter;
    this.gravity = data.gravity;
    this.orbitalPeriod = data.orbitalPeriod;
    this.population = data.population;
    this.rotationPeriod = data.rotationPeriod;
    this.water = data.water;
    this.terrain = data.terrain;
    this.pk = data.pk;
  }
}
