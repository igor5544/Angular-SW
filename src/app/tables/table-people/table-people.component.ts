import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationSettings } from 'src/app/core/models/pagination-settings';

import { People } from '../../core/models/people';
import { PeopleService } from '../../core/services/people.service';

/** Component with people table */
@Component({
  selector: 'app-table-people',
  templateUrl: './table-people.component.html',
  styleUrls: ['./table-people.component.scss'],
})
export class TablePeopleComponent implements OnInit, OnDestroy {
  /** ALl categories for titles */
  public peopleCategories: (keyof People)[] = ['name', 'created', 'edited', 'birth', 'eyes', 'gender', 'hair', 'height', 'home', 'mass', 'skin', 'pk'];

  /** Category for sorting */
  private sortBy = 'fields.name';
  /** Direction for sorting */
  private sortDirection = 'asc';
  /** Category for sorting */
  private searchBy = '';

  /** Category for searching people */
  public searchBy$ = new BehaviorSubject('');
  /** Category for sorting people */
  public sortBy$ = new BehaviorSubject('fields.name');
  /** Direction for sorting people */
  public sortDirection$ = new BehaviorSubject('asc');
  /** Data length subscription */
  public dataLength$!: Subscription;
  /** People to show */
  public people$!: Observable<People[]>;
  /** Subscription on filters */
  public peopleFilters$!: Subscription;

  /** Pagination params */
  public paginationSet: PaginationSettings = {
    firstItemIdInResponse: '',
    lastItemIdInResponse: '',
    startAtItemsIdList: [],
    nextPageExist: false,
  };

  /** Geter for current page from service */
  get currentPage(): number {
    return this.paginationSet.startAtItemsIdList.length;
  }

  /**
   * Geter for condition next btn,
   *  disable btn if 'false'
   */
  get nextPageExist(): boolean {
    return this.paginationSet.nextPageExist;
  }

  /**
   * @param peopleService Service for people
   */
  constructor(private readonly peopleService: PeopleService) {
  }

  /** Set subscribes */
  public ngOnInit(): void {
    this.peopleFilters$ = combineLatest([this.searchBy$, this.sortBy$, this.sortDirection$]).pipe(
      tap(([search, category, direction]) => {
        this.searchBy = search;
        this.sortBy = category;
        this.sortDirection = direction;

        this.people$ = this.peopleService.getFirstListOfPeople(
          { search, category, direction },
          this.paginationSet,
        );
      }),
    ).subscribe();
  }

  /** Unsubscribes */
  public ngOnDestroy(): void {
    this.peopleFilters$.unsubscribe();
  }

  /** Search string change */
  public handleSearchChange(str: string): void {
    this.searchBy$.next(str);
  }

  /** Sort category change */
  public handleSortChange(category: string): void {
    this.setSortBy(category);
  }

  /** Sort direction change */
  public handleDirectionChange(direction: 'top' | 'bottom'): void {
    this.setSortDirection(direction);
  }

  /** Next page function for pagination */
  public nextPage(): void {
    this.peopleService.getFilmDocById(this.paginationSet.lastItemIdInResponse).subscribe(doc => {
      this.people$ = this.peopleService.getNextPageOfPeople({
        search: this.searchBy,
        category: this.sortBy,
        direction: this.sortDirection,
      },
        this.paginationSet,
        doc,
      );
    });
  }

  /** Prev page function for pagination */
  public prevPage(): void {
    /** Remove current startAt id */
    this.paginationSet.startAtItemsIdList.pop();
    const startAtId = this.paginationSet.startAtItemsIdList[this.paginationSet.startAtItemsIdList.length - 1];

    this.peopleService.getFilmDocById(startAtId).subscribe(doc => {
      this.people$ = this.peopleService.getPrevPageOfPeople({
        search: this.searchBy,
        category: this.sortBy,
        direction: this.sortDirection,
      },
        this.paginationSet,
        doc,
      );
    });
  }

  /** Set sort by category */
  public setSortBy(category: string): void {

    /** Switch category to Dto field */
    switch (category) {
      case 'birth':
        category = 'fields.birth_year';
        break;
      case 'eyes':
        category = 'fields.eye_color';
        break;
      case 'hair':
        category = 'fields.hair_color';
        break;
      case 'home':
        category = 'fields.homeworld';
        break;
      case 'skin':
        category = 'fields.skin_color';
        break;
      case 'pk':
        category = 'pk';
        break;
      default:
        category = `fields.${category}`;
    }

    this.sortBy$.next(category);
  }

  /** Set sort direction */
  public setSortDirection(direction: string): void {
    switch (direction) {
      case 'top':
        direction = 'asc';
        break;
      case 'bottom':
        direction = 'desc';
        break;
    }

    if (this.sortDirection !== direction) {
      this.sortDirection$.next(direction);
    }
  }

  /** Track peoples for ngFor */
  public trackPeople(i: number, people: People): string {
    return people.name;
  }
}
