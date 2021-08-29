import { TYPES, CITIES, OPTIONS, getOffersByType, generateDestination } from '../mock/create-data.js';
import { addOffers, createTypes, createCities, getPhotos } from '../utils/rendering-data-utils.js';
import Smart from '../view/smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const editPoint = (point) => {

  const {
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
    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="19/03/19 00:00">
    —
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="19/03/19 00:00">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      €
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="">
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Cancel</button>
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
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._timeFromHandler = this._timeFromHandler.bind(this);
    this._timeToHandler = this._timeToHandler.bind(this);
    this._setDatePicker = this._setDatePicker.bind(this);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().addEventListener('submit', this._formSubmitHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
  }

  restoreHandlers() {
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDatePicker();
    this._setInnerHandlers();
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

  reset(point) {
    this.updateData(
      EditingPoint.parseTaskToData(point),
    );
  }

  getTemplate() {
    return editPoint(this._data);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditingPoint.parseDataToTask(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditingPoint.parseDataToTask(this._data));
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

  _cityChangeHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        destination: {
          description: generateDestination().description,
          name: evt.target.value,
          pictures: generateDestination().pictures,
        },
      });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        type: evt.target.value,
        offers: getOffersByType(OPTIONS, evt.target.value),
      });
  }

  setCityChangeHandler() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
  }

  setTypeChangeHandler() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
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

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  static parseTaskToData(point) {
    return Object.assign(
      {},
      point,
      {
        // destination: {
        //   description: generateDestination().description,
        //   name: this._data,
        //   pictures: generateDestination().pictures,
        // },
        // type: evt.target.value,
        // offers: getOffersByType(OPTIONS, evt.target.value),
      },
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    return data;
  }
}
