import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Popup with confirm logic */
@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss'],
})
export class ConfirmPopupComponent {
  /** Show popup condition */
  @Input()
  public showPopup!: boolean;
  /** Change show popup condition  */
  @Output()
  public showPopupChange = new EventEmitter<boolean>();
  /** Action func after confirm */
  @Input()
  public action!: Function;

  /** Close popup */
  public closePopup(): void {
    this.showPopupChange.emit(false);
  }

  /** Close popup and start action */
  public confirm(): void {
    this.showPopupChange.emit(false);
    this.action();
  }
}
