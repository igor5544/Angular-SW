import { Component, Input} from '@angular/core';

/** Component for pagination */
@Component({
  selector: 'app-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss'],
})
export class PaginationControlsComponent {
  /** Current page */
  @Input()
  public currentPage = 1;
  /** If false block next page */
  @Input()
  public nextPageExist = true;
  /** Get next page function */
  @Input()
  public getNextPage!: Function;
  /** Get prev page function */
  @Input()
  public getPrevPage!: Function;

  /** Trigger get next page function */
  public nextPage(): void {
    this.getNextPage();
  }

  /** Trigger get prev page function */
  public prevPage(): void {
    this.getPrevPage();
  }
}
