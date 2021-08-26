import Abstract from './abstract.js';
import { FilterType } from '../utils/common.js';

const generateFilters = (currentFilterType = FilterType.EVERYTHING) =>
  Object.values(FilterType).map((filterType) =>
    `<div class="trip-filters__filter">
  <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}"
  ${filterType === currentFilterType ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
  </div>`).join('');

export const filters = (currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">
  ${generateFilters(currentFilterType)}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends Abstract {
  constructor(currentFilterType) {
    super();
    // this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return filters(this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
