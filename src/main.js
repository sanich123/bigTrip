import { priceAndTrip } from './view/price&trip.js';
import { navigationMenu, filters } from './view/navigation&filters.js';
import { sort } from './view/sort.js';
import { eventsList } from './view/eventsList.js';
import { editPoint, addNewPointWithoutDestination, addNewPointWithoutOffers, addNewPoint  } from './view/editing-point.js';
import { loading, empty } from './view/loading.js';


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
render(toSort, eventsList(), 'beforeend');
render(toSort, loading(), 'beforeend');
render(toSort, empty(), 'beforeend');


const eventItem = document.querySelector('.trip-events__item:first-child');
const eventItem2 = document.querySelector('.trip-events__item:nth-child(2)');
const eventItem3 = document.querySelector('.trip-events__item:nth-child(3)');
const eventItem4 = document.querySelector('.trip-events__item:last-child');

render(eventItem, editPoint(), 'afterbegin');
render(eventItem2, addNewPointWithoutDestination(), 'afterbegin');
render(eventItem3, addNewPointWithoutOffers(), 'afterbegin');
render(eventItem4, addNewPoint(), 'afterbegin');
