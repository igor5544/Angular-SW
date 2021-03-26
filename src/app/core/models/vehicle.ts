/** Vehicle class */
export class Vehicle {
  /** Vehicle class */
  public class: string;
  /** Personal key */
  public pk: number;

  constructor(data: ConstructorInitArg<Vehicle>) {
    this.class = data.class;
    this.pk = data.pk;
  }
}
