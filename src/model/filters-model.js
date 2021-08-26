import AbstractObserver from '../utils/abstract-observer.js';
import { FilterType } from '../utils/common.js';

export default class FiltersModel extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
