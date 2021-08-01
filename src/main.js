import { priceAndTrip } from './view/price&trip.js';
import { navigationMenu, filters } from './view/navigation&filters.js';
import { sort } from './view/sort.js';
import { eventsList } from './view/eventsList.js';
import { editPoint
  //, addNewPointWithoutDestination, addNewPointWithoutOffers, addNewPoint
} from './view/editing-point.js';
import { loading, empty } from './view/loading.js';
import './mock/createPoint.js';
import { generatePoint } from './mock/createPoint.js';

const NUMBER_COPIES = 15;

const points = new Array(NUMBER_COPIES).fill().map(generatePoint);
points.sort((a,b) => a.dateFrom - b.dateFrom);
// console.log(points);

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

for (let i = 0; i < NUMBER_COPIES; i++) {
  render(toSort, eventsList(points[i]), renderPosition.BEFOREEND);
}

render(toSort, loading(), renderPosition.BEFOREEND);
render(toSort, empty(), renderPosition.BEFOREEND);

const eventItem = document.querySelector('.trip-events__item');
// const eventItem2 = document.querySelector('.trip-events__item:nth-child(2)');
// const eventItem3 = document.querySelector('.trip-events__item:nth-child(3)');
// const eventItem4 = document.querySelector('.trip-events__item:last-child');

render(eventItem, editPoint(), renderPosition.BEFOREEND);
// render(eventItem2, addNewPointWithoutDestination(), renderPosition.AFTERBEGIN);
// render(eventItem3, addNewPointWithoutOffers(), renderPosition.AFTERBEGIN);
// render(eventItem4, addNewPoint(), renderPosition.AFTERBEGIN);

export { points };
