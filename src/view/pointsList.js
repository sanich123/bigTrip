import { differenceTime, humanizeDate } from '../utils/utils.js';

const eventsList = (points) => {
  const { basePrice, dateFrom, dateTo, destination, offers, type, isFavorite } = points;
  const titlePrice = offers.map(({ title, price }) => (
    `<li class="event__offer">
  <span class="event__offer-title">${title}</span>
  +€&nbsp;
  <span class="event__offer-price">${price}</span>
</li>`
  )).join('');

  const favoritePoint = isFavorite ? 'event__favorite-btn--active' : '';

  const fromDate = humanizeDate(dateFrom, 'MMM D');
  const fromDateMinutes = humanizeDate(dateFrom, 'HH:mm');
  const toDateMinutes = humanizeDate(dateTo, 'HH:mm');

  const ONE_HOUR = 3600000;
  const ONE_DAY = 86400000;

  const duration = (begin, end) => {
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

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${fromDate}">${fromDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${fromDateMinutes}</time>
          —
          <time class="event__end-time" datetime="${dateTo}">${toDateMinutes}</time>
        </p>
        <p class="event__duration">${duration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        €&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${titlePrice}
      </ul>
      <button class="event__favorite-btn ${favoritePoint}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
`;
};

const tripListUl = () => ('<ul class="trip-events__list"></ul>');

export {tripListUl, eventsList};
