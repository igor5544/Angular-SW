/** Table filters interfase */
export interface PaginationSettings {
  /** First film on current page for pagination */
  firstItemIdInResponse: string;
  /** Last film on current page for pagination */
  lastItemIdInResponse: string;
  /** First item on each page for pagination */
  startAtItemsIdList: string[];
  /** Condition for disable next page */
  nextPageExist: boolean;
}
