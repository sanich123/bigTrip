import { humanizeDate  } from './common.js';

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

// const sortList = (arr) => arr.map((it) => `<div class="trip-sort__item  trip-sort__item--${it}">
//   <input id="sort-${it}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${it}" checked data-sort-type=${SortType.date} ${currentSortType === SortType.date ? 'checked' : ''}><label class="trip-sort__btn" for="sort-day" >Day</label></div>`);
// console.log(sortList(sort));

export const duration = (begin, end) => {
  const time1 = new Date(begin);
  const time2 = new Date(end);
  const time1ms = time1.getTime(time1);
  const time2ms = time2.getTime(time2);
  const difference = new Date (Math.max(time2ms, time1ms) - Math.min(time2ms, time1ms));
  const ONE_HOUR = 3600000;
  const ONE_DAY = 86400000;

  if (difference < ONE_HOUR) {
    if (difference.getUTCMinutes() < 10) {
      return `0${difference.getUTCMinutes()}M`;
    }
    return `${difference.getUTCMinutes()}M`;
  }
  if (difference >= ONE_HOUR && difference < ONE_DAY) {
    if (difference.getUTCHours() < 10 && difference.getUTCMinutes() < 10) {
      return `0${difference.getUTCHours()}H 0${difference.getUTCMinutes()}M`;
    }
    if (difference.getUTCHours() > 10 && difference.getUTCMinutes() < 10) {
      return `${difference.getUTCHours()}H 0${difference.getUTCMinutes()}M`;
    }
    if (difference.getUTCHours() < 10 && difference.getUTCMinutes() > 10) {
      return `0${difference.getUTCHours()}H ${difference.getUTCMinutes()}M`;
    }
    return `${difference.getUTCHours()}H ${difference.getUTCMinutes()}M`;
  }
  if (difference >= ONE_DAY) {
    if ((difference.getUTCDate() - 1) < 10 && difference.getUTCHours() < 10 && difference.getUTCMinutes() < 10) {
      return `0${(difference.getUTCDate() - 1)}D 0${difference.getUTCHours()}H 0${difference.getUTCMinutes()}M`;
    }
    if ((difference.getUTCDate() - 1) < 10 && difference.getUTCHours() < 10 && difference.getUTCMinutes() >= 10) {
      return `0${(difference.getUTCDate() - 1)}D 0${difference.getUTCHours()}H ${difference.getUTCMinutes()}M`;
    }
    if ((difference.getUTCDate() - 1) < 10 && difference.getUTCHours() >= 10 && difference.getUTCMinutes() >= 10) {
      return `0${(difference.getUTCDate() - 1)}D ${difference.getUTCHours()}H ${difference.getUTCMinutes()}M`;
    }
    if ((difference.getUTCDate() - 1) >= 10 && difference.getUTCHours() >= 10 && difference.getUTCMinutes() >= 10) {
      return `${(difference.getUTCDate() - 1)}D ${difference.getUTCHours()}H ${difference.getUTCMinutes()}M`;
    }
    if ((difference.getUTCDate() - 1) >= 10 && difference.getUTCHours() < 10 && difference.getUTCMinutes() >= 10) {
      return `${(difference.getUTCDate() - 1)}D 0${difference.getUTCHours()}H ${difference.getUTCMinutes()}M`;
    }
    if ((difference.getUTCDate() - 1) >= 10 && difference.getUTCHours() < 10 && difference.getUTCMinutes() < 10) {
      return `${(difference.getUTCDate() - 1)}D 0${difference.getUTCHours()}H 0${difference.getUTCMinutes()}M`;
    }
    if ((difference.getUTCDate() - 1) >= 10 && difference.getUTCHours() >= 10 && difference.getUTCMinutes() < 10) {
      return `${(difference.getUTCDate() - 1)}D ${difference.getUTCHours()}H 0${difference.getUTCMinutes()}M`;
    }
    if ((difference.getUTCDate() - 1) < 10 && difference.getUTCHours() >= 10 && difference.getUTCMinutes() < 10) {
      return `0${(difference.getUTCDate() - 1)}D ${difference.getUTCHours()}H 0${difference.getUTCMinutes()}M`;
    }
  }
};

export const totalPrice = (arr) => arr.slice().reduce((accumulator, it) => accumulator + it.basePrice, 0);

export const getCities = (arr) => {
  const cities = arr.slice().map((it) => it.destination.name);
  const firstCity = cities[cities.length - 1];
  const thirdCity = cities[0];
  const secondCity = cities.length === 3 ? cities[1] : '...';
  const fromDate = humanizeDate(arr[arr.length - 1].dateFrom, 'MMMM DD');
  const toDate = humanizeDate(arr[0].dateFrom, 'MMMM DD');
  return { firstCity, secondCity, thirdCity, fromDate, toDate };
};


export const getFormatTime = (dateFrom, dateTo) => {
  const fromDate = humanizeDate(dateFrom, 'MMM D');
  const toDate = humanizeDate(dateTo, 'MMM D');
  const fromDateMinutes = humanizeDate(dateFrom, 'HH:mm');
  const toDateMinutes = humanizeDate(dateTo, 'HH:mm');
  const fullDateFrom = humanizeDate(dateFrom, 'DD/MM/YY HH:mm');
  const fullDateTo = humanizeDate(dateTo, 'DD/MM/YY HH:mm');
  return { fromDate, toDate, fromDateMinutes, toDateMinutes, fullDateFrom, fullDateTo };
};

export const getPhotos = (arr) => arr.map(({ src }) => (`<img class="event__photo" src="${src}" alt="Event photo">`)).join('');

export const favoritePoint = (isFavorite) => isFavorite ? 'event__favorite-btn--active' : '';
