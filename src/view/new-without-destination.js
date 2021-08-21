import { TYPES, CITIES } from '../mock/create-data.js';
import { addOffers, createTypes, createCities, getFormatTime } from '../utils/rendering-utils.js';
import Abstract from '../view/abstract.js';

const addNewPointWithoutDestination = (points) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type, id } = points;

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
    ${createTypes(TYPES)}
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
    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getFormatTime(dateFrom).fullDateFrom}">
    —
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getFormatTime(dateTo).fullDateTo}">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      €
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
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
</section>
</form>`;
};

export default class NewWithoutDestination extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return addNewPointWithoutDestination(this._points);
  }
}
