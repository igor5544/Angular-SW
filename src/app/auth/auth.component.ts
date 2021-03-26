import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../core/services/auth.service';

/** Component with auth forms */
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  /** Form mode condition */
  public isLogin = true;
  /** Text for warning alert */
  public alertText: string | null = '';
  private userLogin!: string | null;
  private authSub$!: Subscription;
  private authLoginSub$!: Subscription;
  /** Login fields */
  public loginForm!: FormGroup;
  /** Registration fields */
  public registrationForm!: FormGroup;

  /**
   * @param authService Service for login, registrate
   * @param router Router for navigate
   * @param formBuilder FormBuilder for create forms
   */
  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) { }

  /** Try to get user data ande create forms */
  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registrationForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });

    this.authLoginSub$ = this.authService.login$.subscribe((login: string | null) => {
      this.userLogin = login;
    });

    this.authSub$ = this.authService.authAler$.subscribe((text: string | null) => {
      this.alertText = text;
    });

    this.authService.getUserData();

    if (this.userLogin) {
      this.router.navigate(['/']);
    }
  }

  /** Unsubscribe */
  public ngOnDestroy(): void {
    this.authSub$.unsubscribe();
    this.authLoginSub$.unsubscribe();
  }

  /** Switch login - registrate */
  public switchMode(): void {
    this.isLogin = !this.isLogin;
    this.alertText = '';
  }

  /** Login or registrate */
  public onSubmit(): void {
    if (this.isLogin) {
      this.login();
      return;
    }

    if (this.registrationForm.value.password === this.registrationForm.value.repeatPassword) {
      this.registrate();
      return;
    }

    this.authService.authAler$.next('Passwords don\'t match.');
  }

  private login(): void {
    this.authService.login(this.loginForm.value).subscribe();
  }

  private registrate(): void {
    this.authService.registrate(this.registrationForm.value).subscribe();
  }
}
