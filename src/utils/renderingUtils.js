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
