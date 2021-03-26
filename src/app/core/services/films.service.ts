import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentChangeAction, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { FilmDto } from '../dtos/film-dto';
import { SpeciesDto } from '../dtos/species-dto';
import { StarshipDto } from '../dtos/starship-dto';
import { VehicleDto } from '../dtos/vehicle-dto';
import { FilmMapper } from '../mappers/film-mapper';
import { SpeciesMapper } from '../mappers/species-mapper';
import { StarshipMapper } from '../mappers/starship-mapper';
import { VehicleMapper } from '../mappers/vehicle-mapper';
import { Film } from '../models/film';
import { PaginationSettings } from '../models/pagination-settings';
import { Species } from '../models/species';
import { Starship } from '../models/starship';
import { TableFilters } from '../models/table-filters';
import { Vehicle } from '../models/vehicle';

/** Service for films data */
@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  /** Film list to show */
  public filmsList$!: Observable<Film[]>;
  /** Species list */
  public readonly speciesList$: Observable<Species[]>;
  /** Starships list */
  public readonly starshipsList$: Observable<Starship[]>;
  /** Vehicles list */
  public readonly vehiclesList$: Observable<Vehicle[]>;

  /** Count films to show on one page */
  private readonly ITEMS_ON_PAGE = 5;

  /**
   * @param router Router for navigate
   * @param firestore Firestore for useing base
   * @param filmMapper Film mapper to convert data
   * @param speciesMapper Species mapper to convert data
   * @param starshipMapper Starship mapper to convert data
   * @param vehicleMapper Vehicle mapper to convert data
   */
  constructor(
    private readonly router: Router,
    private readonly firestore: AngularFirestore,
    private readonly filmMapper: FilmMapper,
    private readonly speciesMapper: SpeciesMapper,
    private readonly starshipMapper: StarshipMapper,
    private readonly vehicleMapper: VehicleMapper,
  ) {
    /** Get all data for film form */
    this.speciesList$ = this.firestore.collection<SpeciesDto>('species').valueChanges().pipe(
      first(),
      map((dtos: SpeciesDto[]) => {
        return dtos.map((species) => {
          return this.speciesMapper.getSpecies(species);
        });
      }),
    );

    this.starshipsList$ = this.firestore.collection<StarshipDto>('starships').valueChanges().pipe(
      first(),
      map((dtos: StarshipDto[]) => {
        return dtos.map((starship) => {
          return this.starshipMapper.getStarship(starship);
        });
      }),
    );

    this.vehiclesList$ = this.firestore.collection<VehicleDto>('vehicles').valueChanges().pipe(
      first(),
      map((dtos: VehicleDto[]) => {
        return dtos.map((vehicle) => {
          return this.vehicleMapper.getVehicle(vehicle);
        });
      }),
    );
  }

  /** Get first page of films on init or after filters/sorting */
  public getFirstListOfFilms(
    searchSettings: TableFilters,
    paginationSet: PaginationSettings,
  ): Observable<Film[]> {
    paginationSet.startAtItemsIdList = [];

    return this.firestore.collection<FilmDto>('films', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSettings),
    ).snapshotChanges().pipe(
      map((response) => {
        if (response.length !== 0 && paginationSet.startAtItemsIdList.length === 0) {
          paginationSet.startAtItemsIdList.push(response[0].payload.doc.id);
        }
        return this.convertFilmData(response, paginationSet);
      }),
    );
  }

  /** Get next films page */
  public getNextPageOfFilms(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
    startAfter: QueryDocumentSnapshot<FilmDto>,
  ): Observable<Film[]> {
    return this.firestore.collection<FilmDto>('films', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting).startAfter(startAfter),
    ).snapshotChanges().pipe(
      map((response) => {
        return this.convertFilmData(response, paginationSet);
      }),
    );
  }

  /** Get prev films page */
  public getPrevPageOfFilms(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
    startAt: QueryDocumentSnapshot<FilmDto>,
  ): Observable<Film[]> {
    return this.firestore.collection<FilmDto>('films', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting).startAt(startAt),
    ).snapshotChanges().pipe(
      map((response) => {
        return this.convertFilmData(response, paginationSet);
      }),
    );
  }

  /**
   * Set query params for sorting and searching films
   * @param ref Ref from "collection" callback func
   */
  private setAdditionQuerys(ref: any, searchSetting: TableFilters): CollectionReference<DocumentData> {
    if (searchSetting.search) {
      ref = ref.where('fields.title', '==', searchSetting.search);
    }

    if (searchSetting.category !== 'title' || !searchSetting.search) {
      ref = ref.orderBy(`fields.${searchSetting.category}`, searchSetting.direction);
    }

    return ref;
  }

  /**
   * Convert dto to models and set data for pagination
   * @param filmsResponse response after snapshotChanges method
   */
  private convertFilmData(
    filmsResponse: DocumentChangeAction<FilmDto>[],
    paginationSet: PaginationSettings,
  ): Film[] {
    if (filmsResponse.length !== 0) {
      const firstFilm = filmsResponse[0].payload.doc.id;
      const lastFilm = filmsResponse[filmsResponse.length - 1].payload.doc.id;

      paginationSet.firstItemIdInResponse = firstFilm;
      paginationSet.lastItemIdInResponse = lastFilm;

      /** Last item in Start at array */
      const lastItemInStartAtList = paginationSet.startAtItemsIdList[paginationSet.startAtItemsIdList.length - 1];

      /** Check last item if it unic push it */
      if (lastItemInStartAtList && firstFilm !== lastItemInStartAtList) {
        paginationSet.startAtItemsIdList.push(firstFilm);
      }

      /** Enable next brn */
      if (paginationSet.nextPageExist === false) {
        paginationSet.nextPageExist = true;
      }

      /** Disable next brn */
      if (filmsResponse.length < this.ITEMS_ON_PAGE) {
        paginationSet.nextPageExist = false;
      }

      /** Get correct models from dto */
      return filmsResponse.map((film) => {
        const id = film.payload.doc.id;
        const data = film.payload.doc.data();

        return this.filmMapper.getFilm(data, id);
      });
    }

    /** Push last item again if page is void */
    const lastStartAt = paginationSet.startAtItemsIdList[paginationSet.startAtItemsIdList.length - 1];

    paginationSet.startAtItemsIdList.push(lastStartAt);

    /** Disable next brn */
    paginationSet.nextPageExist = false;

    return [];
  }

  /** Get one film once */
  public getFilmById(id: string): Observable<Film> {
    return this.firestore.collection<FilmDto>('films').doc(id).valueChanges().pipe(
      first(),
      map((dto: any) => {
        return this.filmMapper.getFilm(dto, id);
      }),
    );
  }

  /** Get film doc once */
  public getFilmDocById(id: string): Observable<any> {
    return this.firestore.collection('films').doc(id).snapshotChanges().pipe(
      first(),
      map((film) => {
        return film.payload;
      }),
    );
  }

  /** Add new film in base */
  public addNewFilm(film: Film): Promise<void> {
    const filmDto = this.filmMapper.getFilmDto(film);

    return this.firestore.collection<FilmDto>('films').add(filmDto).then();
  }

  /** Update film data in base */
  public updateFilmData(film: Film, filmId: string): Promise<void> {
    const filmDto = this.filmMapper.getFilmDto(film);

    return this.firestore.collection<FilmDto>('films').doc(filmId).update(filmDto);
  }

  /** Remove film */
  public removeFilm(id: string, paginationSet: PaginationSettings): void {
    /** Last item in Start at array */
    const lastItemInSartAtList = paginationSet.startAtItemsIdList[paginationSet.startAtItemsIdList.length - 1];

    /** Remove last item from start at array if it first in current page */
    if (lastItemInSartAtList && paginationSet.firstItemIdInResponse === lastItemInSartAtList) {
      paginationSet.startAtItemsIdList.pop();
    }

    this.firestore.collection('films').doc(id).delete();
  }
}
