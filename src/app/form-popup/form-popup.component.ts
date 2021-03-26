import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilmsService } from '../core/services/films.service';

/** Interface for form component */
interface FormComponent {
  /** Method for closing form */
  canDeactivate: Function;
}

/** Popup component for film form */
@Component({
  selector: 'app-form-popup',
  templateUrl: './form-popup.component.html',
  styleUrls: ['./form-popup.component.scss'],
})
export class FormPopupComponent {
  /** Film id for load start form data */
  @Input()
  public filmId!: string;
  /** Show popup condition */
  @Input()
  public showPopup!: boolean;
  /** Change show popup condition  */
  @Output()
  public showPopupChange = new EventEmitter<boolean>();
  /** For closing popup after save */
  public filmWasSaved = false;

  /**
   * @param filmsService Service for films
   */
  constructor(private readonly filmsService: FilmsService) {
  }

  /** Sort direction change */
  public handleWasSavedChange(isSaved: boolean): void {
    if (isSaved) {
      this.showPopupChange.emit(false);
    }
  }

  /**
   *  Try close popup
   * @param form form component
   */
  public closePopup(form: FormComponent): void {
    form.canDeactivate();
  }
}
