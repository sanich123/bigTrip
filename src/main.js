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

const renderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

render(priceAndTripSection, priceAndTrip(), renderPosition.AFTERBEGIN);
render(toNavigation, navigationMenu(), renderPosition.AFTERBEGIN);
render(toFilters, filters(), renderPosition.AFTERBEGIN);
render(toSort, sort(), renderPosition.AFTERBEGIN);
render(toSort, eventsList(), renderPosition.BEFOREEND);
render(toSort, loading(), renderPosition.BEFOREEND);
render(toSort, empty(), renderPosition.BEFOREEND);


const eventItem = document.querySelector('.trip-events__item:first-child');
const eventItem2 = document.querySelector('.trip-events__item:nth-child(2)');
const eventItem3 = document.querySelector('.trip-events__item:nth-child(3)');
const eventItem4 = document.querySelector('.trip-events__item:last-child');

render(eventItem, editPoint(), renderPosition.AFTERBEGIN);
render(eventItem2, addNewPointWithoutDestination(), renderPosition.AFTERBEGIN);
render(eventItem3, addNewPointWithoutOffers(), renderPosition.AFTERBEGIN);
render(eventItem4, addNewPoint(), renderPosition.AFTERBEGIN);
