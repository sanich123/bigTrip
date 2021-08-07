import PriceTripView from './view/priceTrip.js';
import FiltersView from './view/filters.js';
import NavigationView from './view/navigation.js';
import SortMenuView from './view/sort.js';
import TripListUl from './view/tripListUl.js';
// import TripListLi from './view/tripListLi.js';
import Loading from './view/loading.js';
import Empty from './view/empty.js';
import PointsList from './view/pointsList.js';
import EditingPoint from './view/editingPoint.js';
import NewWithoutDestination from './view/newWithoutDestination.js';
import NewWithoutOffers from './view/newWithoutOffers.js';
import NewPoint from './view/newPoint.js';
import { generatePoint } from './mock/createData.js';
import { renderPosition, renderElement } from './utils/utils.js';

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
// const createLi = new TripListLi().getElement();
// points.forEach((it) => renderElement(createUl.getElement(it), createLi, renderPosition.BEFOREEND));

// points.forEach((it) => renderElement(createUl.getElement(), new PointsList(it).getElement(), renderPosition.BEFOREEND));


const renderPoint = (place, point) => {
  const pointEvent = new PointsList(point);//Одна карточка
  const editPoint = new EditingPoint(point); //Форма редактирования

  const replaceCardToForm = () => {
    place.replaceChild(editPoint.getElement(), pointEvent.getElement());
  };

  const replaceFormToCard = () => {
    place.replaceChild(pointEvent.getElement(), editPoint.getElement());
  };

  pointEvent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });

  editPoint.getElement().querySelector('.event__rollup-btn').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });
  renderElement(place, pointEvent.getElement(), renderPosition.BEFOREEND);
};
for (let i = 0; i < points.length; i++) {
  renderPoint(createUl.getElement(), points[i]);
}


// renderElement(toSort, new Loading().getElement(), renderPosition.BEFOREEND);
// renderElement(toSort, new Empty().getElement(), renderPosition.BEFOREEND);

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

// renderElement(eventItem1, new NewWithoutDestination(points[1]).getElement(), renderPosition.AFTERBEGIN);
// renderElement(eventItem2, new NewWithoutOffers(points[2]).getElement(), renderPosition.AFTERBEGIN);
// renderElement(eventItem3, new NewPoint(points[3]).getElement(), renderPosition.AFTERBEGIN);

