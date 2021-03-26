import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './core/services/auth.guard';
import { FilmFormComponent } from './film-form/film-form.component';
import { TableFilmsComponent } from './tables/table-films/table-films.component';
import { TablePeopleComponent } from './tables/table-people/table-people.component';
import { TablePlanetsComponent } from './tables/table-planets/table-planets.component';

const routes: Routes = [
  { path: 'table-films', component: TableFilmsComponent, canActivate: [AuthGuard] },
  { path: 'table-people', component: TablePeopleComponent, canActivate: [AuthGuard] },
  { path: 'table-planets', component: TablePlanetsComponent, canActivate: [AuthGuard] },
  { path: 'film-form', component: FilmFormComponent, canActivate: [AuthGuard] },
  { path: 'film-form/:id', component: FilmFormComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: 'table-films', pathMatch: 'full' },
];

/** Main routing module */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
