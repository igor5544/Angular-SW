import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Film } from '../core/models/film';
import { People } from '../core/models/people';
import { Planet } from '../core/models/planet';
import { Species } from '../core/models/species';
import { Starship } from '../core/models/starship';
import { Vehicle } from '../core/models/vehicle';
import { FilmsService } from '../core/services/films.service';
import { PeopleService } from '../core/services/people.service';
import { PlanetsService } from '../core/services/planets.service';

/** Component for adding or update films */
@Component({
  selector: 'app-film-form',
  templateUrl: './film-form.component.html',
  styleUrls: ['./film-form.component.scss'],
})
export class FilmFormComponent implements OnInit, OnDestroy {
  private privatePropId!: string;
  /** Getter for id component attr */
  public get propId(): string {
    return this.privatePropId;
  }
  /**
   * Id from component attr
   * Change fields data
   */
  @Input()
  public set propId(id: string) {
    this.privatePropId = id;
    this.filmId = this.propId;
    this.getFilmData(this.propId);
  }
  /** Change "film was saved" event */
  @Output()
  public wasSavedChange = new EventEmitter<boolean>();
  /** Film id for update films */
  public paramsId!: string | null;
  /** Film id form attr or url */
  public filmId!: string | null;
  /**
   * Save data from base
   * for reset form after closing without saveing
  */
  private filmDataFromBase!: Film;

  /** Condition for block submit btn */
  public isSending = false;
  /** Condition for show loader */
  public isLoading = false;
  /** Condition for skip confirm data */
  public skipConfirm = false;
  /** Condition for showing popup */
  public showPopup = false;
  /** Url to navigate after accept unsaved data */
  private url!: string;
  /** Form for adding or update films */
  public filmForm!: FormGroup;
  private readonly fields: (keyof Film)[] = ['title', 'created', 'edited', 'director', 'opening', 'producer', 'release', 'characters', 'planets', 'species', 'starships', 'vehicles'];
  private startFormValues: Film = {
    title: '',
    created: new Date(),
    edited: new Date(),
    director: '',
    opening: '',
    producer: '',
    release: new Date(),
    characters: [''],
    planets: [''],
    species: [''],
    starships: [''],
    vehicles: [''],
    id: '',
  };

  /** People for select */
  public peoples$!: Observable<People[]>;
  /** Planets for select */
  public planets$!: Observable<Planet[]>;
  /** Species for select */
  public species$!: Observable<Species[]>;
  /** Starships for select */
  public starships$!: Observable<Starship[]>;
  /** Vehicles for select */
  public vehicles$!: Observable<Vehicle[]>;
  /** Film id subscription (from url params) */
  private paramsId$!: Subscription;
  /**
   * Url events subscription
   * for confirmation before leaving the page
  */
  private urlEvents$!: Subscription;
  /** Subscription for checking popup close event */
  private closeFormSub$!: Subscription;

  /**
  * @param router Router for navigate
  * @param activateRoute ActivatedRoute for check params
  * @param formBuilder FormBuilder for create forms
  * @param filmsService Service for films
  * @param peopleService Service for people
  * @param planetsService Service for planets
  */
  constructor(
    private readonly router: Router,
    private readonly activateRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly filmsService: FilmsService,
    private readonly peopleService: PeopleService,
    private readonly planetsService: PlanetsService,
  ) {
    this.paramsId$ = activateRoute.params.subscribe((params) => {
      this.paramsId = params['id'];

      if (this.paramsId) {
        this.getFilmData(this.paramsId);
      }
    });

    /** Check unsave data before leaving */
    this.urlEvents$ = router.events.pipe(
      filter((event: any) => {
        return (event instanceof NavigationStart);
      }),
    ).subscribe((event: NavigationStart) => {
      if (this.skipConfirm) {
        return;
      }

      /** Stop navigation and show popup if wasn't saved */
      if (this.checkUnsaveData()) {
        this.showPopup = true;

        this.url = event.url;
        this.router.navigate([]);
      }
    });
  }

  /** Set form */
  public ngOnInit(): void {
    this.filmForm = this.formBuilder.group({
      title: ['', Validators.required],
      created: ['', Validators.required],
      edited: ['', Validators.required],
      director: ['', Validators.required],
      opening: ['', Validators.required],
      producer: ['', Validators.required],
      release: ['', Validators.required],
      characters: ['', Validators.required],
      planets: ['', Validators.required],
      species: ['', Validators.required],
      starships: ['', Validators.required],
      vehicles: ['', Validators.required],
    });

    /** Set related data if it's not popup. Prop id has only popup form */
    if (!this.propId) {
      this.peoples$ = this.peopleService.staticPeoplesList$;
      this.planets$ = this.planetsService.staticPlanetsList$;
      this.species$ = this.filmsService.speciesList$;
      this.starships$ = this.filmsService.starshipsList$;
      this.vehicles$ = this.filmsService.vehiclesList$;
    }
  }

  /** Get film data by id */
  private getFilmData(id: string): void {
    this.filmId = id;
    this.isLoading = true;

    this.filmsService.getFilmById(id).subscribe((film: Film) => {
      this.filmDataFromBase = film;
      this.setFormData(film);
      this.isLoading = false;
    });
  }

  /** Check trying close popup. Prop id has only popup form */
  public canDeactivate(): void {
    if (this.checkUnsaveData()) {
      this.showPopup = true;
      return;
    }

    this.wasSavedChange.emit(true);
  }

  /** Set form data after loading for update film */
  private setFormData(filmData: Film): void {
    this.fields.map(field => {
      let fieldData = filmData[field];

      if (fieldData instanceof Date) {
        fieldData = fieldData.toISOString().substr(0, 10);
      }

      this.filmForm.get(field)?.setValue(fieldData);
      this.startFormValues[field] = this.filmForm.get(field)?.value;
    });
  }

  /** Return true if there is unsaved data in form */
  private checkUnsaveData(): boolean {
    return this.fields.some(field => {
      /** Data conversion for comparison if arrays is void */
      let startValue = this.startFormValues[field];
      if (Array.isArray(startValue) && startValue[0] === '') {
        startValue = '';
      }

      /** Drop value if it's a date */
      if (startValue instanceof Date) {
        startValue = '';
      }

      let formValue = this.filmForm.get(field)?.value;
      if (Array.isArray(formValue) && formValue.length === 0) {
        formValue = '';
      }

      return (formValue !== startValue);
    });
  }

  /** Action after accept unsave data */
  public confirmPopupHandler(): void {
    if (this.propId) {
      this.setFormData(this.filmDataFromBase);
      this.wasSavedChange.emit(true);
      return;
    }

    this.skipConfirm = true;
    this.router.navigate([this.url]);
  }

  /** Unsubscribe for subscriptions */
  public ngOnDestroy(): void {
    this.paramsId$.unsubscribe();
    this.urlEvents$.unsubscribe();
    if (this.closeFormSub$) {
      this.closeFormSub$.unsubscribe();
    }
  }

  /** Save/add new film data */
  public onSubmit(): void {
    this.isSending = true;
    this.skipConfirm = true;

    if (this.filmId) {
      this.filmsService.updateFilmData(this.filmForm.value, this.filmId).then(() => {
        this.router.navigate(['/table-films']);
        this.isSending = false;
        this.wasSavedChange.emit(true);
      });

      return;
    }

    this.filmsService.addNewFilm(this.filmForm.value).then(() => {
      this.router.navigate(['/table-films']);
      this.isSending = false;
    });
  }
}
