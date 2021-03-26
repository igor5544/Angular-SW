import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentChangeAction, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { PlanetDto } from '../dtos/planet-dto';
import { PlanetMapper } from '../mappers/planet-mapper';
import { PaginationSettings } from '../models/pagination-settings';
import { Planet } from '../models/planet';
import { TableFilters } from '../models/table-filters';

/** Service for planets data */
@Injectable({
  providedIn: 'root',
})
export class PlanetsService {
  /** Planets list */
  public staticPlanetsList$!: Observable<Planet[]>;

  /** Count planets to show on one page */
  private readonly ITEMS_ON_PAGE = 10;

  /**
   * @param firestore Firestore for useing base
   * @param planetMapper Planet mapper to convert data
   */
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly planetMapper: PlanetMapper,
  ) {
    /** Get planets onse */
    this.staticPlanetsList$ = this.firestore.collection<PlanetDto>('planets').valueChanges().pipe(
      first(),
      map((dtos: PlanetDto[]) => {
        return dtos.map((planet) => {
          return this.planetMapper.getPlanet(planet);
        });
      }),
    );
  }

  /** Get first page of planets on init or after filters/sorting */
  public getFirstListOfPlanets(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
  ): Observable<Planet[]> {
    paginationSet.startAtItemsIdList = [];

    return this.firestore.collection<PlanetDto>('planets', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting),
    ).snapshotChanges().pipe(
      map((response) => {
        if (response.length !== 0 && paginationSet.startAtItemsIdList.length === 0) {
          paginationSet.startAtItemsIdList.push(response[0].payload.doc.id);
        }
        return this.convertPlanetData(response, paginationSet);
      }),
    );
  }

  /** Get next planets page */
  public getNextPageOfPlanets(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
    startAfter: QueryDocumentSnapshot<PlanetDto>,
  ): Observable<Planet[]> {
    return this.firestore.collection<PlanetDto>('planets', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting).startAfter(startAfter),
    ).snapshotChanges().pipe(
      map((response) => {
        return this.convertPlanetData(response, paginationSet);
      }),
    );
  }

  /** Get prev planets page */
  public getPrevPageOfPlanets(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
    startAt: QueryDocumentSnapshot<PlanetDto>,
  ): Observable<Planet[]> {
    return this.firestore.collection<PlanetDto>('planets', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting).startAt(startAt),
    ).snapshotChanges().pipe(
      map((response) => {
        return this.convertPlanetData(response, paginationSet);
      }),
    );
  }

  /** Set query params for sorting and searching planets */
  private setAdditionQuerys(ref: any, searchSetting: TableFilters): CollectionReference<DocumentData> {
    if (searchSetting.search) {
      ref = ref.where('fields.name', '==', searchSetting.search);
    }

    if (searchSetting.category !== 'fields.name' || !searchSetting.search) {
      ref = ref.orderBy(searchSetting.category, searchSetting.direction);
    }

    return ref;
  }

  /**
   * Convert dto to models and set data for pagination
   * @param filmsResponse response after snapshotChanges method
   */
  private convertPlanetData(
    planetsResponse: DocumentChangeAction<PlanetDto>[],
    paginationSet: PaginationSettings,
  ): Planet[] {
    if (planetsResponse.length !== 0) {
      const firstPlanet = planetsResponse[0].payload.doc.id;
      const lastPlanet = planetsResponse[planetsResponse.length - 1].payload.doc.id;

      paginationSet.firstItemIdInResponse = firstPlanet;
      paginationSet.lastItemIdInResponse = lastPlanet;

      /** Last item in Start at array */
      const lastItemInSartAtList = paginationSet.startAtItemsIdList[paginationSet.startAtItemsIdList.length - 1];

      /** Check last item if it unic push it */
      if (lastItemInSartAtList && firstPlanet !== lastItemInSartAtList) {
        paginationSet.startAtItemsIdList.push(firstPlanet);
      }

      /** Enable next brn */
      if (paginationSet.nextPageExist === false) {
        paginationSet.nextPageExist = true;
      }

      /** Disable next brn */
      if (planetsResponse.length < this.ITEMS_ON_PAGE) {
        paginationSet.nextPageExist = false;
      }

      /** Get correct models from dto */
      return planetsResponse.map((planet) => {
        const data = planet.payload.doc.data();

        return this.planetMapper.getPlanet(data);
      });
    }

    /** Push last item again if page is void */
    const lastStartAt = paginationSet.startAtItemsIdList[paginationSet.startAtItemsIdList.length - 1];
    paginationSet.startAtItemsIdList.push(lastStartAt);

    /** Disable next brn */
    paginationSet.nextPageExist = false;

    return [];
  }

  /** Get planet doc once */
  public getPeopleDocById(id: string): Observable<any> {
    return this.firestore.collection('planets').doc(id).snapshotChanges().pipe(
      first(),
      map((planet) => {
        return planet.payload;
      }),
    );
  }
}
