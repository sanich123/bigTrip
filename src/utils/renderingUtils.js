export const addOffers = (arr) => arr.map(({title, price}) => (
  `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked=""
    >
    <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${title}</span>
      +€&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`)).join('');

export const createTypes = (arr) => arr.map((it, index) => (`<div class="event__type-item">
          <input id="event-type-${it}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${it}">
          <label class="event__type-label  event__type-label--${it}" for="event-type-${it}-${index}">${it}</label>
        </div>`)).join('');

export const createCities = (arr) => arr.map((it) => (`<option value="${it}"></option>`)).join('');

