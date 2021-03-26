import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../core/services/auth.service';

/** Component header */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** User login */
  public login: string | null = '';
  private authSub$: Subscription;

  /**
   * @param router Router for navigate
   * @param authService Service for login, registrate
   */
  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.authSub$ = this.authService.login$.subscribe((userLogin: string | null) => {
      this.login = userLogin;
    });
  }

  /** try to get user data */
  public ngOnInit(): void {
    this.authService.getUserData();
  }

  /** unsubscribe */
  public ngOnDestroy(): void {
    this.authSub$.unsubscribe();
  }

  /** Logout */
  public logout(): void {
    this.authService.clearUserData();
    this.login = '';
    this.router.navigate(['auth']);
  }

  /** Set login value */
  public setLogin(login: string): void {
    this.login = login;
  }
}
