import { priceAndTrip } from './view/price&trip.js';
import { navigationMenu, filters } from './view/navigation&filters.js';
import { sort } from './view/sort.js';


const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(priceAndTripSection, priceAndTrip(), 'afterbegin');
render(toNavigation, navigationMenu(), 'afterbegin');
render(toFilters, filters(), 'afterbegin');
render(toSort, sort(), 'afterbegin');

