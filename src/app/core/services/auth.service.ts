import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import * as shajs from 'sha.js';

import { UserLoginData } from '../models/user';

/** Service for users auth */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userLogin$ = new BehaviorSubject<string | null>(null);
  /** Subject for user data */
  public readonly login$ = this.userLogin$.asObservable();
  /** Text for auth alert */
  public authAler$: Subject<string | null> = new Subject();

  /**
   * @param firestore Firestore for useing base
   * @param router Router for navigate
   */
  public constructor(
    private readonly firestore: AngularFirestore,
    private readonly router: Router,
  ) { }

  /** try to get user from LS */
  get user(): string | null {
    return localStorage.getItem('login');
  }

  /** For hashing password */
  public getHash(str: string): string {
    return shajs('sha256').update(str).digest('hex');
  }

  /** Add user in firebase */
  public addUser(user: UserLoginData): Promise<UserLoginData | boolean | void> {
    return this.firestore.collection('users').doc(user.login).set({
      login: user.login,
      password: this.getHash(user.password),
    }).catch((error: Error) => {
      this.authAler$.next(error.message);
    });
  }

  /** Try to get user from firestore */
  public getUser$(login: string): Observable<UserLoginData | undefined> {
    return this.firestore.collection<UserLoginData>('users').doc(login).valueChanges().pipe(
      first(),
    );
  }

  /** Login logic */
  public login(loginData: UserLoginData): Observable<UserLoginData | undefined> {
    return this.getUser$(loginData.login).pipe(
      tap((userData: UserLoginData | undefined): void | string => {
        if (userData && userData.password === this.getHash(loginData.password)) {
          this.successAuth(loginData);
        } else {
          this.authAler$.next('Login or password don\'t match.');
        }
      }),
    );
  }

  /**
   * Registrate logic
   * @param registrateData User data
   */
  public registrate(registrateData: UserLoginData): Observable<UserLoginData | undefined> {
    return this.getUser$(registrateData.login).pipe(
      tap(async (userData: UserLoginData | undefined) => {
        if (!userData) {
          await this.addUser(registrateData);
          this.successAuth(registrateData);
        } else {
          this.authAler$.next('User already exist.');
        }
      }),
    );
  }

  private successAuth(userData: UserLoginData): void {
    this.setUserData(userData);
    this.router.navigate(['/']);
  }

  /** check aurh for guard */
  public isAuthenticated(): boolean {
    return !!this.user;
  }

  /** Set user data in LS */
  public setUserData(userData: UserLoginData): void {
    localStorage.setItem('login', userData.login);
    localStorage.setItem('password', userData.password);
    this.userLogin$.next(userData.login);
  }

  /** Get user data from LS */
  public getUserData(): void {
    const userData = localStorage.getItem('login');
    this.userLogin$.next(userData);
  }

  /** Clear user data from LS */
  public clearUserData(): void {
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    this.userLogin$.next(null);
  }
}
