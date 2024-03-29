import { getOffersByType } from '../utils/rendering-data-utils.js';
import { addOffers, createTypes, createCities, getFormatTime, getPhotos, matchExistingCity } from '../utils/rendering-data-utils.js';
import Smart from '../view/smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const editPoint = (point, availableOffers, destinations, isEdit) => {
  const { id, type, basePrice, dateTo, dateFrom, offers, destination, isDisabled, isSaving, isDeleting } = point;

  const offersByType = availableOffers.length ? availableOffers.find((offer) => offer.type === type).offers : '';
  const TYPES = availableOffers.map((offer) => offer.type);
  const availableDestinations = destinations.map((it) => it.name);
  const createRollupButton = `${isEdit? `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
  <span class="visually-hidden">Open event</span></button>`: ''}`;

  const createResetOrDelete = () => {
    if (!isEdit) {
      return 'Cancel';
    }
    return (isDeleting) ? 'Deleting...' : 'Delete';
  };

  const createDestinationSection = () => destination.name !== '' ?
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
           ${destination.pictures === [] ? '' : getPhotos(destination.pictures)}
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
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>
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
    <input class="event__input  event__input--destination" id="event-destination-${id}"
    type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-${id}">
    ${createCities(availableDestinations)}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}">From</label>
    <input class="event__input  event__input--time" id="event-start-time-${id}"
    type="text" name="event-start-time" value="${getFormatTime(dateFrom, dateTo).fullDateFrom}" ${isDisabled ? 'disabled' : ''}>
    —
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}"
    type="text" name="event-end-time" value="${getFormatTime(dateFrom, dateTo).fullDateTo}" ${isDisabled ? 'disabled' : ''}>
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      €
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}"
    type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${createResetOrDelete(isEdit, isDeleting)}</button>
  ${createRollupButton}
</header>
${addOffers(offers, id, offersByType)}
${createDestinationSection()}
</section>
</form>`;
};

const TEMPLATE_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  isFavorite: false,
  isDisabled: false,
  isSaving: false,
  type: 'taxi',
  offers: [],
};

export default class EditingPoint extends Smart {
  constructor(point = TEMPLATE_POINT, offers, destinations, isEditForm) {
    super();
    this._data = EditingPoint.parseTaskToData(point);
    this._offers = offers;
    this._destinations = destinations;
    this._datepicker1 = null;
    this._datepicker2 = null;
    this._isEditForm = isEditForm;
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
    this._newPointButton = document.querySelector('.trip-main__event-add-btn');
  }

  getTemplate() {
    return editPoint(this._data, this._offers, this._destinations, this._isEditForm);
  }

  setPriceInputListener() {
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
  }

  setPriceListener() {
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  setOffersListener() {
    this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offersListener);
  }

  setCityInputHandler() {
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._cityInputHandler);
  }

  setCityChangeHandler() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
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
    if (this.getElement().querySelector('.event__rollup-btn')) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
    }
  }

  removeElement() {
    super.removeElement();
    this._resetDatepicker();
  }

  reset(point) {
    this.updateData(
      EditingPoint.parseTaskToData(point),
    );
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

  _isEdit() {
    this._isEditForm ? this._newPointButton.disabled = false : this._newPointButton.disabled = true;
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this._isEdit();
    const inputValue = this.getElement().querySelector('.event__input--price');
    const price = evt.target.value;
    if (!price ||  Math.abs(price) === 0) {
      inputValue.setCustomValidity('Поле цены не может быть пустым или равным нулю');
    } else {
      inputValue.setCustomValidity('');
    }
    inputValue.reportValidity();

  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this._isEdit();
    this.updateData({
      basePrice: Math.abs(evt.target.value),
    }, 'noUpdate');
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditingPoint.parseDataToTask(this._data));
  }

  _offersListener(evt) {
    evt.preventDefault();
    this._isEdit();
    const checkboxElements = this.getElement().querySelectorAll('.event__offer-checkbox');
    const offers = [];
    checkboxElements.forEach((checkbox) => {
      if(checkbox.checked) {
        offers.push({
          title: checkbox.dataset.title,
          price: + checkbox.dataset.price,
        });
      }
    });
    this.updateData(
      {
        offers,
      }, 'noUpdate');
  }

  _cityInputHandler(evt) {
    evt.preventDefault();
    this._isEdit();
    const inputValue = this.getElement().querySelector('.event__input--destination');
    const city = evt.target.value;
    if (!city ||  matchExistingCity(city, this._destinations.map((destination) => destination.name))) {
      inputValue.setCustomValidity('Название города должно соответствовать названию города из списка и не может быть пустым полем');
    } else {
      inputValue.setCustomValidity('');
    }
    inputValue.reportValidity();
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    this._isEdit();
    if (evt.target.value === '' || matchExistingCity(evt.target.value, this._destinations.map((destination) => destination.name))) {
      return;
    }
    this.updateData(
      {
        destination: {
          description: this._destinations.filter((destination) => evt.target.value === destination.name)[0].description,
          name: evt.target.value,
          pictures: this._destinations.filter((destination) => evt.target.value === destination.name)[0].pictures,
        },
      });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this._isEdit();
    this.updateData(
      {
        type: evt.target.value,
        offers: getOffersByType(this._offers, evt.target.value),
      });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditingPoint.parseDataToTask(this._data));
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
    if (this.getElement().querySelector('.event__rollup-btn')) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
    }
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
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
