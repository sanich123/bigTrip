import Abstract from '../view/abstract.js';
import { SortType } from '../utils/common.js';

const sort = (currentSortType) => {

  const sortWords = ['day', 'event', 'time', 'price', 'offers'];

  const sortList = (arr) => arr.map((it) =>`<div class="trip-sort__item  trip-sort__item--${it}">
  <input id="sort-${it}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${it}" data-sort-type="${it === 'offers' || it === 'event' ? '' : SortType[it]}" ${it === 'offers' || it === 'event' ? 'disabled' : ''} ${currentSortType === SortType[it] ? 'checked' : ''}>
  <label class="trip-sort__btn"  for="sort-${it}">${it}</label>
  </div>`);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${sortList(sortWords).join('')}
</form>`;
};

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


{/* <div class="trip-sort__item  trip-sort__item--day">
  <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked data-sort-type="${SortType.day}"${currentSortType === SortType.date ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-day" >Day</label>
</div>

<div class="trip-sort__item  trip-sort__item--event">
  <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled="">
  <label class="trip-sort__btn" for="sort-event">Event</label>
</div>

<div class="trip-sort__item  trip-sort__item--time">
  <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SortType.time}"${currentSortType === SortType.time ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-time"  >Time</label>
</div>

<div class="trip-sort__item  trip-sort__item--price">
  <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.price}"${currentSortType === SortType.price ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-price" >Price</label>
</div>

<div class="trip-sort__item  trip-sort__item--offer">
  <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled="">
  <label class="trip-sort__btn" for="sort-offer">Offers</label>
</div> */}
