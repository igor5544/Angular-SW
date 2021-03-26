import { Component} from '@angular/core';

/** Component main navigation */
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent {
  /** All tables list */
  public readonly categories = ['films', 'people', 'planets'];
}
