import { Component, EventEmitter, Input, Output } from '@angular/core';

/** Component with sorting and search fields */
@Component({
  selector: 'app-sort-form-controls',
  templateUrl: './sort-form-controls.component.html',
  styleUrls: ['./sort-form-controls.component.scss'],
})
export class SortFormControlsComponent {
  /** Search string */
  public searchStr!: string;
  /** Change search string event */
  @Output()
  public searchStrChange = new EventEmitter<string>();
  /** Sort category */
  public sortCategory!: string;
  /** Change sort category event */
  @Output()
  public sortCategoryChange = new EventEmitter<string>();
  /** Change sort direction event */
  @Output()
  public sortDirectionChange = new EventEmitter<'top' | 'bottom'>();
  /** List of categories for sorting */
  @Input()
  public sortCategories!: string[];

  /** Pass sort data to parant */
  public setSort(): void {
    this.sortCategoryChange.emit(this.sortCategory);
  }

  /** Pass sort direction to parant */
  public setSortDirection(direction: 'top' | 'bottom'): void {
    this.sortDirectionChange.emit(direction);
  }

  /** Pass search data to parant */
  public setSearch(): void {
    this.searchStrChange.emit(this.searchStr);
  }
}
