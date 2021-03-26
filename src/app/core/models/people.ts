/** People class */
export class People {
  /** Name */
  public name: string;
  /** Created date */
  public created: Date;
  /** Edited date */
  public edited: Date;
  /** Birth */
  public birth: string;
  /** Eyes color */
  public eyes: string;
  /** Gender */
  public gender: string;
  /** Hair color */
  public hair: string;
  /** Height */
  public height: string;
  /** Home */
  public home: number;
  /** Mass */
  public mass: string;
  /** Skin color */
  public skin: string;
  /** Personal key */
  public pk: number;

  constructor(data: ConstructorInitArg<People>) {
    this.name = data.name;
    this.birth = data.birth;
    this.created = data.created;
    this.edited = data.edited ;
    this.eyes = data.eyes;
    this.gender = data.gender;
    this.hair = data.hair;
    this.height = data.height;
    this.home = data.home;
    this.mass = data.mass;
    this.skin = data.skin;
    this.pk = data.pk;
  }
}
