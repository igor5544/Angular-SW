import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { FilmMapper } from './core/mappers/film-mapper';
import { PeopleMapper } from './core/mappers/people-mapper';
import { PlanetMapper } from './core/mappers/planet-mapper';
import { SpeciesMapper } from './core/mappers/species-mapper';
import { StarshipMapper } from './core/mappers/starship-mapper';
import { VehicleMapper } from './core/mappers/vehicle-mapper';
import { AuthGuard } from './core/services/auth.guard';
import { FilmFormComponent } from './film-form/film-form.component';
import { FormPopupComponent } from './form-popup/form-popup.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { PaginationControlsComponent } from './pagination-controls/pagination-controls.component';
import { SortFormControlsComponent } from './sort-form-controls/sort-form-controls.component';
import { TableFilmsComponent } from './tables/table-films/table-films.component';
import { TablePeopleComponent } from './tables/table-people/table-people.component';
import { TablePlanetsComponent } from './tables/table-planets/table-planets.component';
import './utils/constructor-Init-arg';

/** Main app module */
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavMenuComponent,
    PaginationControlsComponent,
    SortFormControlsComponent,
    AuthComponent,
    TableFilmsComponent,
    TablePeopleComponent,
    TablePlanetsComponent,
    ConfirmPopupComponent,
    FilmFormComponent,
    LoaderComponent,
    FormPopupComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.fb),
    AngularFireModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    FilmMapper,
    PeopleMapper,
    PlanetMapper,
    SpeciesMapper,
    StarshipMapper,
    VehicleMapper,
  ],
  bootstrap: [AppComponent],
})
export default class AppModule { }
