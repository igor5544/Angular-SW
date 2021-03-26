/** Species class */
export class Species {
  /** Name */
  public name!: string;
  /** Created date */
  public created!: Date;
  /** Edited date */
  public edited!: Date;
  /** Height */
  public height!: number;
  /** Life */
  public life: number;
  /** Classification */
  public classification: string;
  /** Designation */
  public designation: string;
  /** Eye color */
  public eye: string;
  /** Hair color */
  public hair: string;
  /** Home */
  public home: string;
  /** Language */
  public language: string;
  /** Skin color */
  public skin: string;
  /** Personal key */
  public pk: number;

  constructor(data: ConstructorInitArg<Species>) {
    this.name = data.name;
    this.created = data.created;
    this.edited = data.edited;
    this.height = data.height;
    this.life = data.height;
    this.classification = data.classification ;
    this.designation = data.designation;
    this.eye = data.eye;
    this.hair = data.hair;
    this.home = data.home;
    this.language = data.language;
    this.skin = data.skin;
    this.pk = data.pk;
  }
}
