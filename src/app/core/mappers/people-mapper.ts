import { PeopleDto } from '../dtos/people-dto';
import { People } from '../models/people';

/** Mapper for people */
export class PeopleMapper {
  /** Get correct people format */
  public getPeople(peopleData: PeopleDto): People {
    const person: People = {
      name: peopleData.fields.name,
      created: peopleData.fields.created,
      edited: peopleData.fields.edited,
      birth: peopleData.fields.birth_year,
      eyes: peopleData.fields.eye_color,
      gender: peopleData.fields.gender,
      hair: peopleData.fields.hair_color,
      height: peopleData.fields.height,
      home: peopleData.fields.homeworld,
      mass: peopleData.fields.mass,
      skin: peopleData.fields.skin_color,
      pk: peopleData.pk,
    };

    return new People(person);
  }
}
