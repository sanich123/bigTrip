import { differenceTime, humanizeDate  } from './utils.js';

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

export const titlePrice = (arr) => arr.map(({ title, price }) => (
  `<li class="event__offer">
  <span class="event__offer-title">${title}</span>
  +€&nbsp;
  <span class="event__offer-price">${price}</span>
</li>`
)).join('');

export const duration = (begin, end) => {
  const ONE_HOUR = 3600000;
  const ONE_DAY = 86400000;
  const millisecs = differenceTime(begin, end);
  if (millisecs < ONE_HOUR) {
    const string = humanizeDate(millisecs, 'mm').toString();
    const finalDate = `${`${string[0] + string[1]  }M`}`;
    return finalDate;
  }
  if (millisecs >= ONE_HOUR && millisecs < ONE_DAY) {
    const string = humanizeDate(millisecs, 'HH mm').toString();
    const finalDate = `${`${string[0] + string[1]  }H ${  string[3] + string [4] }M`}`;
    return finalDate;
  }
  if (millisecs >= ONE_DAY) {
    const string = humanizeDate(millisecs, 'DD HH mm').toString();
    const finalDate = `${`${string[0] + string[1]  }D ${  string[3] + string [4] }H ${  string[6]  }${string[7]  }M`}`;
    return finalDate;
  }
};

export const totalPrice = (arr) => arr.slice().reduce((accumulator, it) => accumulator + it.basePrice, 0);

export const getCities = (arr) => {
  const cities = new Set(arr.slice().map((it) => it.destination.name));
  const threeCities = Array.from(cities);
  const firstCity = threeCities[0];
  const thirdCity = threeCities[threeCities.length - 1];
  const secondCity = threeCities.length === 3 ? threeCities[1] : '...';
  const fromDate = humanizeDate(arr[0].dateFrom, 'MMMM DD');
  const toDate = humanizeDate(arr[arr.length - 1].dateTo, 'MMMM DD');
  return { firstCity, secondCity, thirdCity, fromDate, toDate };
};

export const getFormatTime = (dateFrom, dateTo) => {
  const fromDate = humanizeDate(dateFrom, 'MMM D');
  const fromDateMinutes = humanizeDate(dateFrom, 'HH:mm');
  const toDateMinutes = humanizeDate(dateTo, 'HH:mm');
  return { fromDate, fromDateMinutes, toDateMinutes };
};

export const favoritePoint = (isFavorite) => isFavorite ? 'event__favorite-btn--active' : '';
