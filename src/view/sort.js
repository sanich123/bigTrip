import Abstract from '../view/abstract.js';
import { sortList, sortWords } from '../utils/rendering-data-utils.js';

const sort = (currentSortType = 'DAY') =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${sortList(sortWords, currentSortType).join('')}
</form>`;

export default class SortMenu extends Abstract {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler =  this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return sort(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
