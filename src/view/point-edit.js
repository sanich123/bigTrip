import { TYPES, CITIES } from '../mock/create-data.js';
import { addOffers, createTypes, createCities, getFormatTime } from '../utils/rendering-data-utils.js';
import Abstract from './abstract.js';
// import Smart from '../view/smart.js';

const editPoint = (point) => {

  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type, id } = point;

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
        <div class="event__type-list">
      <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
    ${createTypes(id, TYPES)}
      </fieldset>
    </div>
  </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-${id}">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
    <datalist id="destination-list-${id}">
    ${createCities(CITIES)}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}">From</label>
    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getFormatTime(dateFrom, dateTo).fullDateFrom}">
    —
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getFormatTime(dateFrom, dateTo).fullDateTo}">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      €
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
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
    <p class="event__destination-description">${destination.description.join('')}</p>
  </section>
</section>
</form>`;
//
};

export default class EditingPoint extends Abstract {
  constructor(point) {
    super();
    this._data = EditingPoint.parseTaskToData(point);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    // this.getElement()
    //   .querySelector('.event__type-group')
    //   .addEventListener('change', this._typeChangeHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        type: evt.target.value,
      });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit( );
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  getTemplate() {
    return editPoint(this._data);
  }

  setTypeChangeHandler() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  static parseTaskToData(point) {
    return Object.assign(
      {},
      point,
      {

      },
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    return data;
  }
}