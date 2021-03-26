import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentChangeAction, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { PeopleDto } from '../dtos/people-dto';
import { PeopleMapper } from '../mappers/people-mapper';
import { PaginationSettings } from '../models/pagination-settings';
import { People } from '../models/people';
import { TableFilters } from '../models/table-filters';

/** Service for people data */
@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  /** Peoples list */
  public readonly staticPeoplesList$: Observable<People[]>;

  /** Count peoples to show on one page */
  private readonly ITEMS_ON_PAGE = 10;

  /**
   * @param firestore Firestore for useing base
   * @param peopleMapper People mapper to convert data
   */
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly peopleMapper: PeopleMapper,
  ) {
    /** Get people onse */
    this.staticPeoplesList$ = this.firestore.collection<PeopleDto>('people').valueChanges().pipe(
      first(),
      map((dtos: PeopleDto[]) => {
        return dtos.map((people) => {
          return this.peopleMapper.getPeople(people);
        });
      }),
    );
  }

  /** Get first page of peoples on init or after filters/sorting */
  public getFirstListOfPeople(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
  ): Observable<People[]> {
    paginationSet.startAtItemsIdList = [];

    return this.firestore.collection<PeopleDto>('people', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting),
    ).snapshotChanges().pipe(
      map((response) => {
        if (response.length !== 0 && paginationSet.startAtItemsIdList.length === 0) {
          paginationSet.startAtItemsIdList.push(response[0].payload.doc.id);
        }
        return this.convertPeopleData(response, paginationSet);
      }),
    );
  }

  /** Get next peoples page */
  public getNextPageOfPeople(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
    startAfter: QueryDocumentSnapshot<PeopleDto>,
  ): Observable<People[]> {
    return this.firestore.collection<PeopleDto>('people', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting).startAfter(startAfter),
    ).snapshotChanges().pipe(
      map((response) => {
        return this.convertPeopleData(response, paginationSet);
      }),
    );
  }

  /** Get prev peoples page */
  public getPrevPageOfPeople(
    searchSetting: TableFilters,
    paginationSet: PaginationSettings,
    startAt: QueryDocumentSnapshot<PeopleDto>,
    ): Observable<People[]> {
    return this.firestore.collection<PeopleDto>('people', ref =>
      this.setAdditionQuerys(ref.limit(this.ITEMS_ON_PAGE), searchSetting).startAt(startAt),
    ).snapshotChanges().pipe(
      map((response) => {
        return this.convertPeopleData(response, paginationSet);
      }),
    );
  }

  /** Set query params for sorting and searching peoples */
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
   * @param filmsResponse Response after snapshotChanges method
   */
  private convertPeopleData(
    peoplesResponse: DocumentChangeAction<PeopleDto>[],
    paginationSet: PaginationSettings,
  ): People[] {
    if (peoplesResponse.length !== 0) {
      const firstPeople = peoplesResponse[0].payload.doc.id;
      const lastPeople = peoplesResponse[peoplesResponse.length - 1].payload.doc.id;

      paginationSet.firstItemIdInResponse = firstPeople;
      paginationSet.lastItemIdInResponse = lastPeople;

      /** Last item in Start at array */
      const lastItemInSartAtList = paginationSet.startAtItemsIdList[paginationSet.startAtItemsIdList.length - 1];

      /** Check last item if it unic push it */
      if (lastItemInSartAtList && firstPeople !== lastItemInSartAtList) {
        paginationSet.startAtItemsIdList.push(firstPeople);
      }

      /** Enable next brn */
      if (paginationSet.nextPageExist === false) {
        paginationSet.nextPageExist = true;
      }

      /** Disable next brn */
      if (peoplesResponse.length < this.ITEMS_ON_PAGE) {
        paginationSet.nextPageExist = false;
      }

      /** Get correct models from dto */
      return peoplesResponse.map((people) => {
        const data = people.payload.doc.data();

        return this.peopleMapper.getPeople(data);
      });
    }

    /** Push last item again if page is void */
    const lastStartAt = paginationSet.startAtItemsIdList[paginationSet.startAtItemsIdList.length - 1];
    paginationSet.startAtItemsIdList.push(lastStartAt);

    /** Disable next brn */
    paginationSet.nextPageExist = false;

    return [];
  }

  /** Get people doc once */
  public getFilmDocById(id: string): Observable<any> {
    return this.firestore.collection('people').doc(id).snapshotChanges().pipe(
      first(),
      map((people) => {
        return people.payload;
      }),
    );
  }
}
