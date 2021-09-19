import Abstract from '../view/abstract.js';
import { createSortList } from '../utils/rendering-data-utils.js';
import { SortType } from '../utils/constants.js';

const createSortButtons = (currentSortType = SortType.DAY) =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${createSortList(currentSortType).join('')}
</form>`;

export default class SortMenu extends Abstract {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler =  this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortButtons(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
