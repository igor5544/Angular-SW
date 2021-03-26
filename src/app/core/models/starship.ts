/** Starship class */
export class Starship {
  /** Mglt */
  public mglt: number;
  /** Hyperdrive */
  public hyperdrive: number;
  /** Starshio class */
  public class: string;
  /** Personal key */
  public pk: number;

  constructor(data: ConstructorInitArg<Starship>) {
    this.mglt = data.mglt;
    this.hyperdrive = data.hyperdrive;
    this.class = data.class;
    this.pk = data.pk;
  }
}
