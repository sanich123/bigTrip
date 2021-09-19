import { getDuration, getFormatTime, favoritePoint } from '../utils/rendering-data-utils.js';
import Abstract from '../view/abstract.js';

const createPointsList = (points) => {

  const { basePrice, dateFrom, dateTo, destination, offers, type, isFavorite } = points;

  const checkedOffers = offers.map(({ title, price }) =>
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
       <span class="event__offer-price">${price}</span>
    </li>`).join('');

  const currentOffersTemplate = () => (`${offers ? `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${checkedOffers}</ul>` : ''}`);

  return `<div class="event">
      <time class="event__date" datetime="${getFormatTime(dateFrom, dateTo).fromDate}">${getFormatTime(dateFrom, dateTo).fromDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getFormatTime(dateFrom, dateTo).fromDate}">${getFormatTime(dateFrom, dateTo).fromDateMinutes}</time>
          —
          <time class="event__end-time" datetime="${getFormatTime(dateFrom, dateTo).toDate}">${getFormatTime(dateFrom, dateTo).toDateMinutes}</time>
        </p>
        <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        €&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${currentOffersTemplate(offers)}
      </ul>
      <button class="event__favorite-btn ${favoritePoint(isFavorite)}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`;
};

export default class PointsList extends Abstract {
  constructor(points) {
    super();
    this._points = points;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointsList(this._points);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
