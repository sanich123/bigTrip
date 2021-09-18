import dayjs from 'dayjs';
import { SortType } from './constants.js';

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const getFormatTime = (dateFrom, dateTo) => {
  const fromDate = humanizeDate(dateFrom, 'MMM D');
  const toDate = humanizeDate(dateTo, 'MMM D');
  const fromDateMinutes = humanizeDate(dateFrom, 'HH:mm');
  const toDateMinutes = humanizeDate(dateTo, 'HH:mm');
  const fullDateFrom = humanizeDate(dateFrom, 'DD/MM/YY HH:mm');
  const fullDateTo = humanizeDate(dateTo, 'DD/MM/YY HH:mm');
  return { fromDate, toDate, fromDateMinutes, toDateMinutes, fullDateFrom, fullDateTo };
};

export const getPhotos = (pictures) => pictures.map(({ src }) => (`<img class="event__photo" src="${src}" alt="Event photo">`)).join('');

export const favoritePoint = (isFavorite) => isFavorite ? 'event__favorite-btn--active' : '';

const generateOffers = (offers, id, offersByType, isDisabled) => {

  const checkedOffers = (title) => offers.map((item) => item.title).includes(title) ? 'checked' : '';

  return offersByType.map(({title, price}) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-${id}" type="checkbox" name="event-offer-${title}" data-title="${title}" data-price="${price}" ${isDisabled ? 'disabled' : ''} ${checkedOffers(title)}>
    <label class="event__offer-label" for="event-offer-${title}-${id}">
      <span class="event__offer-title">${title}</span>
      +€&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`).join('\n');};

export const addOffers = (offers, id, offersByType) =>
  offersByType.length ? `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">${generateOffers(offers, id, offersByType)}</div></section>` :
    `<section class="event__section  event__section--offers">
    <div class="event__available-offers"></div></section>`;

const upperCaseFirstLetter = (type) => type[0].toUpperCase() + type.split('').splice(1).join('');

export const createTypes = (id, types) =>
  types.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${upperCaseFirstLetter(type)}</label>
</div>`).join('');

export const createCities = (cities) => cities.map((city) => (`<option value="${city}"></option>`)).join('');

export const getOffersByType = (arr, value) => arr.find((offer) => offer.type === value).offers;

export const sortList = (currentSortType) =>
  Object.keys(SortType).map((sortType) =>
    `<div class="trip-sort__item  trip-sort__item--${sortType.toLowerCase()}">
  <input id="sort-${sortType.toLowerCase()}" class="trip-sort__input visually-hidden"
  type="radio" name="trip-sort" value="sort-${sortType.toLowerCase()}"
  data-sort-type="${sortType === SortType.OFFERS || sortType === SortType.EVENT ? '' : SortType[sortType]}"
  ${SortType[sortType] === currentSortType  ? 'checked' : ''}
  ${sortType === SortType.OFFERS || sortType === SortType.EVENT ? 'disabled' : ''}>
  <label class="trip-sort__btn"  for="sort-${sortType.toLowerCase()}">${sortType}</label>
  </div>`);

export const duration2 = (it) => {
  const difference = new Date(it);
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

export const duration = (begin, end) => {
  const time1 = new Date(begin);
  const time2 = new Date(end);
  const time1ms = time1.getTime(time1);
  const time2ms = time2.getTime(time2);
  const difference2 = Math.max(time2ms, time1ms) - Math.min(time2ms, time1ms);
  return duration2(difference2);
};

export const totalPrice = (points) => {
  const totalCost = points.reduce((total, point) => {
    const { basePrice, offers } = point;
    let offersTotal = 0;
    if (offers.length) {
      offersTotal = offers.reduce((accumulator, offer) => (accumulator += offer.price), 0);
    }
    return total += basePrice + offersTotal;
  }, 0);
  return totalCost;
};

export const getCities = (towns) => {
  const cities = towns.slice().sort((a, b) => dayjs(b.dateFrom) - dayjs(a.dateFrom)).map((it) => it.destination.name);
  const firstCity = cities[cities.length - 1];
  const thirdCity = cities[0];
  const secondCity = cities.length === 3 ? cities[1] : '...';
  const fromDate = humanizeDate(towns[towns.length - 1].dateFrom, 'MMMM DD');
  const toDate = humanizeDate(towns[0].dateFrom, 'MMMM DD');
  return { firstCity, secondCity, thirdCity, fromDate, toDate };
};

export const existingCity = (city, array) => {
  if (city && array.some((it) => it === city)) {
    return '';
  }
  return 'disabled';
};
