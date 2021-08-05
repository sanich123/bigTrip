import { priceAndTrip } from './view/priceTrip.js';
import { navigationMenu, filters } from './view/navigation&filters.js';
import { sort } from './view/sort.js';
import { eventsList, tripListUl } from './view/pointsList.js';
import { editPoint } from './view/editingPoint.js';
import { addNewPointWithoutDestination } from './view/newWithoutDestination.js';
import { addNewPointWithoutOffers } from './view/newWithoutOffers.js';
import { addNewPoint } from './view/newPoint.js';
import { loading, empty } from './view/loading.js';
import { generatePoint } from './mock/createData.js';

const COUNT_OF_POINTS = 15;

const points = new Array(COUNT_OF_POINTS).fill().map(generatePoint);
points.sort((a,b) => a.dateFrom - b.dateFrom);

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

render(priceAndTripSection, priceAndTrip(points), renderPosition.AFTERBEGIN);
render(toNavigation, navigationMenu(), renderPosition.AFTERBEGIN);
render(toFilters, filters(), renderPosition.AFTERBEGIN);
render(toSort, sort(), renderPosition.AFTERBEGIN);
render(toSort, tripListUl(), renderPosition.BEFOREEND);

const tripList = document.querySelector('.trip-events__list');

points.forEach((it) => render(tripList, eventsList(it), renderPosition.BEFOREEND));


render(toSort, loading(), renderPosition.BEFOREEND);
render(toSort, empty(), renderPosition.BEFOREEND);

const eventItem = document.querySelector('.trip-events__item');

//Удаление div временное, чтобы просто вывести данные в надлежащем виде
document.querySelector('.event:nth-child(1)').remove();
document.querySelector('.trip-events__item:nth-child(2) .event').remove();
document.querySelector('.trip-events__item:nth-child(3) .event').remove();
document.querySelector('.trip-events__item:nth-child(4) .event').remove();

render(eventItem, editPoint(points[0]), renderPosition.BEFOREEND);

const eventItem1 = document.querySelector('.trip-events__item:nth-child(3)');
const eventItem2 = document.querySelector('.trip-events__item:nth-child(4)');
const eventItem3 = document.querySelector('.trip-events__item:nth-child(5)');

render(eventItem1, addNewPointWithoutDestination(points[1]), renderPosition.AFTERBEGIN);
render(eventItem2, addNewPointWithoutOffers(points[2]), renderPosition.AFTERBEGIN);
render(eventItem3, addNewPoint(points[3]), renderPosition.AFTERBEGIN);

