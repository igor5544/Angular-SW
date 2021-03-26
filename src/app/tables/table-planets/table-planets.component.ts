import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationSettings } from 'src/app/core/models/pagination-settings';

import { Planet } from '../../core/models/planet';
import { PlanetsService } from '../../core/services/planets.service';

/** Component with planets table */
@Component({
  selector: 'app-table-planets',
  templateUrl: './table-planets.component.html',
  styleUrls: ['./table-planets.component.scss'],
})
export class TablePlanetsComponent implements OnInit, OnDestroy {
  /** ALl categories for titles */
  public planetCategories: (keyof Planet)[] = ['name', 'created', 'edited', 'climate', 'diameter', 'gravity', 'orbitalPeriod', 'population', 'rotationPeriod', 'water', 'terrain', 'pk'];

  /** Category for sorting */
  private sortBy = 'fields.name';
  /** Direction for sorting */
  private sortDirection = 'asc';
  /** Category for sorting */
  private searchBy = '';

  /** Category for searching planets */
  public searchBy$ = new BehaviorSubject('');
  /** Category for sorting planets */
  public sortBy$ = new BehaviorSubject('fields.name');
  /** Direction for sorting planets */
  public sortDirection$ = new BehaviorSubject('asc');
  /** Data length subscription */
  public dataLength$!: Subscription;
  /** Planet to show */
  public planets$!: Observable<Planet[]>;
  /** Subscription on filters */
  public planetsFilters$!: Subscription;

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
   * @param planetService Service for planets
   */
  constructor(private readonly planetService: PlanetsService) {
  }

  /** Set subscribes */
  public ngOnInit(): void {
    this.planetsFilters$ = combineLatest([this.searchBy$, this.sortBy$, this.sortDirection$]).pipe(
      tap(([search, category, direction]) => {
        this.searchBy = search;
        this.sortBy = category;
        this.sortDirection = direction;

        this.planets$ = this.planetService.getFirstListOfPlanets(
          { search, category, direction },
          this.paginationSet,
        );
      }),
    ).subscribe();
  }

  /** Unsubscribes */
  public ngOnDestroy(): void {
    this.planetsFilters$.unsubscribe();
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
    this.planetService.getPeopleDocById(this.paginationSet.lastItemIdInResponse).subscribe(doc => {
      this.planets$ = this.planetService.getNextPageOfPlanets({
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

    this.planetService.getPeopleDocById(startAtId).subscribe(doc => {
      this.planets$ = this.planetService.getPrevPageOfPlanets({
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
      case 'orbitalPeriod':
        category = 'fields.orbital_period';
        break;
      case 'rotationPeriod':
        category = 'fields.rotation_period';
        break;
      case 'water':
        category = 'fields.surface_water';
        break;
      case 'water':
        category = 'fields.surface_water';
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

  /** Track planets for ngFor */
  public trackPlanet(i: number, planet: Planet): string {
    return planet.name;
  }
}
