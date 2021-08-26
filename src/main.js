import PriceTripView from './view/price-trip.js';
import FiltersView from './view/filters.js';
import NavigationView from './view/navigation.js';
// import Loading from './view/loading.js';
// import NewWithoutDestination from './view/newWithoutDestination.js';
// import NewWithoutOffers from './view/new-without-offers.js';
// import NewPoint from './view/newPoint.js';
import { generatePoint } from './mock/create-data.js';
import { renderPosition, render } from './utils/rendering-utils.js';
import PointsPresenter from './presenter/trip-list.js';
import PointsModel from './model/points.js';

const COUNT_OF_POINTS = 12;

const points = new Array(COUNT_OF_POINTS).fill().map(generatePoint);
points.sort((a, b) => b.dateFrom - a.dateFrom);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);


const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');

render(priceAndTripSection, new PriceTripView(points), renderPosition.AFTERBEGIN);
render(toNavigation, new NavigationView(), renderPosition.AFTERBEGIN);
render(toFilters, new FiltersView(), renderPosition.AFTERBEGIN);

const pointsPresenter = new PointsPresenter(toSort, pointsModel);
pointsPresenter.init();


// render(toSort, new Loading().getElement(), renderPosition.BEFOREEND);
// render(toSort, new Empty().getElement(), renderPosition.BEFOREEND);

// const eventItem = document.querySelector('.trip-events__item');

//Удаление div временное, чтобы просто вывести данные в надлежащем виде
// document.querySelector('.event:nth-child(1)').remove();
// document.querySelector('.trip-events__item:nth-child(2) .event').remove();
// document.querySelector('.trip-events__item:nth-child(3) .event').remove();
// document.querySelector('.trip-events__item:nth-child(4) .event').remove();

// renderElement(eventItem, new EditingPoint(points[1]).getElement(), renderPosition.BEFOREEND);

// const eventItem1 = document.querySelector('.trip-events__item:nth-child(3)');
// const eventItem2 = document.querySelector('.trip-events__item:nth-child(4)');
// const eventItem3 = document.querySelector('.trip-events__item:nth-child(5)');

// render(eventItem1, new NewWithoutDestination(points[1]).getElement(), renderPosition.AFTERBEGIN);
// render(eventItem2, new NewWithoutOffers(points[2]).getElement(), renderPosition.AFTERBEGIN);
// render(eventItem3, new NewPoint(points[3]).getElement(), renderPosition.AFTERBEGIN);
