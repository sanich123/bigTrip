import { humanizeDate, currentTime} from '../utils/utils.js';
import {CITIES, TYPES } from '../mock/createData.js';
import { addOffers, createTypes, createCities } from '../utils/renderingUtils.js';

export const addNewPoint = (points = {}) => {
  const {
    basePrice = 0,
    dateFrom = currentTime,
    dateTo = currentTime,
    destination = 'Undefined',
    offers,
    type = 'taxi' } = points;

  const descriptionOfDestination = destination.description.join('');
  const fromDate = humanizeDate(dateFrom, 'DD/MM/YY HH:mm');
  const toDate = humanizeDate(dateTo, 'DD/MM/YY HH:mm');

  const addPhotos = destination.pictures.map(({src}) => (`<img class="event__photo" src="${src}" alt="Event photo">`)).join('');

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
        ${createTypes(TYPES)}
          </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
      ${createCities(CITIES)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${fromDate}">
      —
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${toDate}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        €
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
    <button class="event__rollup-btn" type="button">
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
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${addPhotos}
        </div>
      </div>
    </section>
  </section>
</form>`;
};

/* <div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked="">
<label class="event__offer-label" for="event-offer-luggage-1">
  <span class="event__offer-title">Add luggage</span>
  +€&nbsp;
  <span class="event__offer-price">30</span>
</label>
</div>

<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked="">
<label class="event__offer-label" for="event-offer-comfort-1">
  <span class="event__offer-title">Switch to comfort class</span>
  +€&nbsp;
  <span class="event__offer-price">100</span>
</label>
</div>

<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
<label class="event__offer-label" for="event-offer-meal-1">
  <span class="event__offer-title">Add meal</span>
  +€&nbsp;
  <span class="event__offer-price">15</span>
</label>
</div>

<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
<label class="event__offer-label" for="event-offer-seats-1">
  <span class="event__offer-title">Choose seats</span>
  +€&nbsp;
  <span class="event__offer-price">5</span>
</label>
</div>

<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
<label class="event__offer-label" for="event-offer-train-1">
  <span class="event__offer-title">Travel by train</span>
  +€&nbsp;
  <span class="event__offer-price">40</span>
</label>
</div>
</div> */