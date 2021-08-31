import { TYPES, CITIES, OPTIONS, getOffersByType, generateDestination } from '../mock/create-data.js';
import { addOffers, createTypes, createCities, getFormatTime, getPhotos } from '../utils/rendering-data-utils.js';
import Smart from '../view/smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const editPoint = (point) => {

  const { basePrice, dateFrom, dateTo, destination, offers, type, id, isDisabled } = point;

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
    <input class="event__input  event__input--price" id="event-price-${id}" name="event-price" value="${basePrice}">
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled}>Save</button>
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
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${getPhotos(destination.pictures)}
        </div>
       </div>
  </section>
</section>
</form>`;
};

export default class EditingPoint extends Smart {
  constructor(point) {
    super();
    this._data = EditingPoint.parseTaskToData(point);
    this._datepicker1 = null;
    this._datepicker2 = null;
    this._offersListener = this._offersListener.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._timeFromHandler = this._timeFromHandler.bind(this);
    this._timeToHandler = this._timeToHandler.bind(this);
    this._setDatePicker = this._setDatePicker.bind(this);
  }

  reset(point) {
    this.updateData(
      EditingPoint.parseTaskToData(point),
    );
  }

  getTemplate() {
    return editPoint(this._data);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditingPoint.parseDataToTask(this._data));
  }

  setOffersListener() {
    this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offersListener);
  }

  _offersListener(evt) {
    evt.preventDefault();
    const checkedOffers = Array.from(this.getElement().querySelectorAll('[type="checkbox"]:checked'));
    // const summaryPrice = checkedOffers.slice().reduce((accumulator, it) => accumulator + parseInt(it.labels[0].childNodes[3].outerText, 10), 0);
    const offersPrice = checkedOffers.slice().map((it) => parseInt(it.labels[0].childNodes[3].outerText, 10));
    const offersTitles = Array.from(this.getElement().querySelectorAll('[type="checkbox"]:checked')).slice().map((it) => it.labels[0].childNodes[1].outerText);

    const result = {};
    offersTitles.forEach((title, price) => result[title] = offersPrice[price]);

    // const result2 = Object.entries(result).map((it) => ({ title: it[0], price: it[1] }));
    // this.updateData(
    //   {
    //     basePrice: summaryPrice,
    //   });
  }

  setPriceListener() {
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }

  _priceChangeHandler(evt) {
    this.updateData({
      basePrice: Math.abs(evt.target.value),
      isDisabled: Math.abs(evt.target.value) === 0 || !Math.abs(evt.target.value) ? 'disabled' : '',
    });
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditingPoint.parseDataToTask(this._data));
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setCityChangeHandler() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    // const inputValue = this.getElement().querySelector('.event__input--destination');
    const city = evt.target.value;
    // if (city !== 'Amsterdam' || inputValue.value !== 'Brussel') {
    //   inputValue.setCustomValidity('Название города должно соответствовать названию города из списка');
    // } else {
    //   inputValue.setCustomValidity('');
    // }
    // inputValue.reportValidity();

    this.updateData(
      {
        destination: {
          description: generateDestination().description,
          name: city,
          pictures: generateDestination().pictures,
        },
        isDisabled: !city ? 'disabled' : '',
      });
  }

  setTypeChangeHandler() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        type: evt.target.value,
        offers: getOffersByType(OPTIONS, evt.target.value),
      });
  }


  _setDatePicker() {
    if (this._datepicker1) {
      this._datepicker1.destroy();
      this._datepicker1 = null;
    }
    if (this._datepicker2) {
      this._datepicker2.destroy();
      this._datepicker2 = null;
    }

    this._datepicker1 = flatpickr(
      this.getElement().querySelector('[name = "event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        onChange: this._timeFromHandler,
      },
    ),
    this._datepicker2 = flatpickr(
      this.getElement().querySelector('[name = "event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        minDate: this._datepicker1.input.value,
        'time_24hr': true,
        onChange: this._timeToHandler,
      },
    );
  }

  removeElement() {
    super.removeElement();
    this._resetDatepicker();
  }

  _resetDatepicker() {
    if (this._datepicker1) {
      this._datepicker1.destroy();
      this._datepicker1 = null;
    }
    if (this._datepicker2) {
      this._datepicker2.destroy();
      this._datepicker2 = null;
    }
  }

  _timeFromHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _timeToHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().addEventListener('submit', this._formSubmitHandler);
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
  }

  restoreHandlers() {
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatePicker();
    this._setInnerHandlers();
    this.setOffersListener(this._offersListener);
    this.setPriceListener(this._priceChangeHandler);
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
