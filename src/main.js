import PriceTripView from './view/price-trip.js';
import FiltersView from './view/filters.js';
import NavigationView from './view/navigation.js';
import SortMenuView from './view/sort.js';
import TripListUl from './view/trip-list-ul.js';
import TripListLi from './view/trip-list-li.js';
// import Loading from './view/loading.js';
import Empty from './view/empty.js';
import PointsList from './view/points-list.js';
import EditingPoint from './view/editing-point.js';
// import NewWithoutDestination from './view/newWithoutDestination.js';
// import NewWithoutOffers from './view/new-without-offers.js';
// import NewPoint from './view/newPoint.js';
import { generatePoint } from './mock/create-data.js';
import { renderPosition, render, replace } from './utils/rendering-utils.js';

const COUNT_OF_POINTS = 15;

const points = new Array(COUNT_OF_POINTS).fill().map(generatePoint);
points.sort((a,b) => a.dateFrom - b.dateFrom);


const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');

render(priceAndTripSection, new PriceTripView(points), renderPosition.AFTERBEGIN);
render(toNavigation, new NavigationView(), renderPosition.AFTERBEGIN);
render(toFilters, new FiltersView(), renderPosition.AFTERBEGIN);

if (points.length === 0) {
  render(toSort, new Empty(), renderPosition.BEFOREEND);
} else {
  render(toSort, new SortMenuView(), renderPosition.AFTERBEGIN);
}

const createUl = new TripListUl();
render(toSort, createUl, renderPosition.BEFOREEND);

const renderPoint = (point) => {
  const pointEvent = new PointsList(point);
  const editPoint = new EditingPoint(point);
  const tripListLi = new TripListLi();
  render(createUl, tripListLi, renderPosition.BEFOREEND);

  const replaceCardToForm = () => {
    replace(editPoint, pointEvent);
  };

  const replaceFormToCard = () => {
    replace(pointEvent, editPoint);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointEvent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editPoint.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  editPoint.setEditClickHandler(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(tripListLi, pointEvent, renderPosition.BEFOREEND);
};

points.forEach((point) => renderPoint(point));

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
