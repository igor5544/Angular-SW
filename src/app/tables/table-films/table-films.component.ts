import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationSettings } from 'src/app/core/models/pagination-settings';

import { Film } from '../../core/models/film';
import { FilmsService } from '../../core/services/films.service';

/** Component with films table */
@Component({
  selector: 'app-table-films',
  templateUrl: './table-films.component.html',
  styleUrls: ['./table-films.component.scss'],
})
export class TableFilmsComponent implements OnInit, OnDestroy {
  /** ALl categories for titles */
  public filmCategories: (keyof Film)[] = ['title', 'created', 'edited', 'director', 'opening', 'producer', 'release'];
  /** Condition for showing confirm popup */
  public showConfirmPopup = false;
  /** Condition for showing form popup */
  public showFormPopup = false;
  /** Id for removeing film */
  public removeId!: string;
  /** Id for popup form */
  public popupId!: string;

  /** Category for sorting */
  private sortBy = 'title';
  /** Direction for sorting */
  private sortDirection = 'asc';
  /** Category for sorting */
  private searchBy = '';

  /** Category for searching films */
  public searchBy$ = new BehaviorSubject('');
  /** Category for sorting films */
  public sortBy$ = new BehaviorSubject('title');
  /** Direction for sorting films */
  public sortDirection$ = new BehaviorSubject('asc');
  /** Data length subscription */
  public dataLength$!: Subscription;
  /** Films to show */
  public films$!: Observable<Film[]>;
  /** Subscription on filters */
  public filmsFilters$!: Subscription;

  /** Pagination params */
  public paginationSet: PaginationSettings = {
    firstItemIdInResponse: '',
    lastItemIdInResponse: '',
    startAtItemsIdList: [],
    nextPageExist: false,
  };

  /** Geter current page for disable prev page */
  get currentPage(): number {
    return this.paginationSet.startAtItemsIdList.length;
  }

  /**
   * @param router Router for navigate
   * @param filmsService Service for films
   */
  constructor(private readonly filmsService: FilmsService) {
  }

  /** Set subscribes */
  public ngOnInit(): void {
    this.filmsFilters$ = combineLatest([
      this.searchBy$,
      this.sortBy$,
      this.sortDirection$,
    ]).pipe(
      tap(([search, category, direction]) => {
        this.searchBy = search;
        this.sortBy = category;
        this.sortDirection = direction;

        this.films$ = this.filmsService.getFirstListOfFilms(
          { search, category, direction },
          this.paginationSet,
        );
      }),
    ).subscribe();
  }

  /** Unsubscribes */
  public ngOnDestroy(): void {
    this.filmsFilters$.unsubscribe();
  }

  /** Open from popup for edit film */
  public showEditForm(id: string): void {
    this.popupId = id;
    this.showFormPopup = true;
  }

  /** Open confirm popup for removeing film */
  public openRemovePopup(id: string): void {
    this.removeId = id;
    this.showConfirmPopup = true;
  }

  /** Remove film func */
  public removeFilm(): void {
    this.filmsService.removeFilm(this.removeId, this.paginationSet);
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
    this.filmsService.getFilmDocById(this.paginationSet.lastItemIdInResponse).subscribe(doc => {
      this.films$ = this.filmsService.getNextPageOfFilms({
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

    this.filmsService.getFilmDocById(startAtId).subscribe(doc => {
      this.films$ = this.filmsService.getPrevPageOfFilms({
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
      case 'opening':
        category = 'opening_crawl';
        break;
      case 'release':
        category = 'release_date';
        break;
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

  /** Track film for ngFor */
  public trackFilm(i: number, film: Film): string {
    return film.title;
  }
}
