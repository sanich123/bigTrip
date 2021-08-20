import { TYPES, CITIES } from '../mock/create-data.js';
import { addOffers, createTypes, createCities, getFormatTime } from '../utils/rendering-data-utils.js';
import Abstract from '../view/abstract.js';

const editPoint = (points, index) => {

  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type } = points;

  const descriptionOfDestination = destination.description.join('');

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-${index}">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${index}" type="checkbox">
        <div class="event__type-list">
      <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
    ${createTypes(TYPES)}
      </fieldset>
    </div>
  </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-${index}">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${index}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${index}">
    <datalist id="destination-list-${index}">
    ${createCities(CITIES)}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${index}">From</label>
    <input class="event__input  event__input--time" id="event-start-time-${index}" type="text" name="event-start-time" value="${getFormatTime(dateFrom, dateTo).fullDateFrom}">
    —
    <label class="visually-hidden" for="event-end-time-${index}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${index}" type="text" name="event-end-time" value="${getFormatTime(dateFrom, dateTo).fullDateTo}">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${index}">
      <span class="visually-hidden">Price</span>
      €
    </label>
    <input class="event__input  event__input--price" id="event-price-${index}" type="text" name="event-price" value="${basePrice}">
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Delete</button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</header>
<section class="event__details">
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${addOffers(offers)}
    </div>
  </section>

  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${descriptionOfDestination}</p>
  </section>
</section>
</form>`;
};

export default class EditingPoint extends Abstract {
  constructor(points, index) {
    super();
    this._index = index;
    this._points = points;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }


  getTemplate() {
    return editPoint(this._points, this._index);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}
