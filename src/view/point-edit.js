import { TYPES, getOffersByType } from '../utils/rendering-data-utils.js';
import { addOffers, createTypes, createCities, getFormatTime, getPhotos } from '../utils/rendering-data-utils.js';
import { isCityExist } from '../utils/common.js';
import Smart from '../view/smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const editPoint = (point, availableOffers, destinations) => {

  const { basePrice, dateFrom, dateTo, type, id, isDisabled, destination, offers } = point;

  const availableDestinations = destinations.map((it) => it.name);
  const destinationListener = () => destination.name !== '' ? `<section class="event__section  event__section--destination"><h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
           ${destination.pictures === '' ? '' : getPhotos(destination.pictures)}
        </div>
       </div>
  </section>` : '';

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
    ${createCities(availableDestinations)}
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
    <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}">
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled}>Save</button>
  <button class="event__reset-btn" type="reset">Delete</button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</header>
    ${addOffers(offers)}
${destinationListener()}
</section>
</form>`;
};

export default class EditingPoint extends Smart {
  constructor(point, offers, destinations) {
    super();
    this._data = EditingPoint.parseTaskToData(point);
    this._offers = offers;
    this._destinations = destinations;
    this._datepicker1 = null;
    this._datepicker2 = null;
    this._timeFromHandler = this._timeFromHandler.bind(this);
    this._timeToHandler = this._timeToHandler.bind(this);
    this._setDatePicker = this._setDatePicker.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._cityInputHandler = this._cityInputHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersListener = this._offersListener.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _getDestinations() {
    return this._destinations.map((it) => it.name);
  }

  _getOffers() {
    return this._offers;
  }

  setPriceInputListener() {
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    const inputValue = this.getElement().querySelector('.event__input--price');
    const price = evt.target.value;
    if (!price ||  Math.abs(price) === 0) {
      inputValue.setCustomValidity('Поле цены не может быть пустым или равным нулю');
    } else {
      inputValue.setCustomValidity('');
    }
    inputValue.reportValidity();
  }

  setPriceListener() {
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: Math.abs(evt.target.value),
      // isDisabled: Math.abs(evt.target.value) === 0 || !Math.abs(evt.target.value) ? 'disabled' : '',
    });
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

  setCityInputHandler() {
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._cityInputHandler);
  }

  _cityInputHandler(evt) {
    evt.preventDefault();
    const inputValue = this.getElement().querySelector('.event__input--destination');
    const city = evt.target.value;
    if (!city ||  isCityExist(city, this._getDestinations())) {
      inputValue.setCustomValidity('Название города должно соответствовать названию города из списка и не может быть пустым полем');
    } else {
      inputValue.setCustomValidity('');
    }
    inputValue.reportValidity();
  }

  setCityChangeHandler() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        destination: {
          description: this._destinations.filter((destination) => evt.target.value === destination.name)[0].description,
          name: evt.target.value,
          pictures: this._destinations.filter((destination) => evt.target.value === destination.name)[0].pictures,
        },
        // isDisabled: isCityExist(evt.target.value, CITIES),
      });
  }

  setTypeChangeHandler() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    if (this._offers.length === 0) {
      this.getElement().querySelector('.event__type-group').disabled = true;
    }
    this.updateData(
      {
        type: evt.target.value,
        offers: getOffersByType(this._offers, evt.target.value),
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

  _setDatePicker() {
    this._resetDatepicker();
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

  reset(point) {
    this.updateData(
      EditingPoint.parseTaskToData(point),
    );
  }

  getTemplate() {
    return editPoint(this._data, this._offers, this._destinations);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().addEventListener('submit', this._formSubmitHandler);
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }

  restoreHandlers() {
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatePicker();
    this._setInnerHandlers();
    this.setOffersListener(this._offersListener);
    this.setPriceListener(this._priceChangeHandler);
    this.setCityInputHandler(this._cityInputHandler);
    this.setPriceInputListener(this._priceInputHandler);
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
