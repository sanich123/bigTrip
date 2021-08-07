import PriceTripView from './view/priceTrip.js';
import FiltersView from './view/filters.js';
import NavigationView from './view/navigation.js';
import SortMenuView from './view/sort.js';
import TripListUl from './view/tripListUl.js';
import Loading from './view/loading.js';
import Empty from './view/empty.js';
import PointsList from './view/pointsList.js';
import { editPoint } from './view/editingPoint.js';
import { addNewPointWithoutDestination } from './view/newWithoutDestination.js';
import { addNewPointWithoutOffers } from './view/newWithoutOffers.js';
import { addNewPoint } from './view/newPoint.js';
import { generatePoint } from './mock/createData.js';
import { renderPosition, renderTemplate, renderElement } from './utils/utils.js';

const COUNT_OF_POINTS = 15;

const points = new Array(COUNT_OF_POINTS).fill().map(generatePoint);
points.sort((a,b) => a.dateFrom - b.dateFrom);

const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');

renderElement(priceAndTripSection, new PriceTripView(points).getElement(), renderPosition.AFTERBEGIN);
renderElement(toNavigation, new NavigationView().getElement(), renderPosition.AFTERBEGIN);
renderElement(toFilters, new FiltersView().getElement(), renderPosition.AFTERBEGIN);
renderElement(toSort, new SortMenuView().getElement(), renderPosition.AFTERBEGIN);
const createUl = new TripListUl();
renderElement(toSort, createUl.getElement(), renderPosition.BEFOREEND);

points.forEach((it) => renderElement(createUl.getElement(), new PointsList(it).getElement(), renderPosition.BEFOREEND));

renderElement(toSort, new Loading().getElement(), renderPosition.BEFOREEND);
renderElement(toSort, new Empty().getElement(), renderPosition.BEFOREEND);

const eventItem = document.querySelector('.trip-events__item');

//Удаление div временное, чтобы просто вывести данные в надлежащем виде
document.querySelector('.event:nth-child(1)').remove();
document.querySelector('.trip-events__item:nth-child(2) .event').remove();
document.querySelector('.trip-events__item:nth-child(3) .event').remove();
document.querySelector('.trip-events__item:nth-child(4) .event').remove();

renderTemplate(eventItem, editPoint(points[0]), renderPosition.BEFOREEND);

const eventItem1 = document.querySelector('.trip-events__item:nth-child(3)');
const eventItem2 = document.querySelector('.trip-events__item:nth-child(4)');
const eventItem3 = document.querySelector('.trip-events__item:nth-child(5)');

renderTemplate(eventItem1, addNewPointWithoutDestination(points[1]), renderPosition.AFTERBEGIN);
renderTemplate(eventItem2, addNewPointWithoutOffers(points[2]), renderPosition.AFTERBEGIN);
renderTemplate(eventItem3, addNewPoint(points[3]), renderPosition.AFTERBEGIN);

