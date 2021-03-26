import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

/** Auth user guard */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * @param authService Service for login, registrate
   * @param router Router for navigate
   */
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /** Protect pages from unauth users */
  public canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/auth']);
    }
  }
}
