import PriceTripView from './view/priceTrip.js';
import FiltersView from './view/filters.js';
import NavigationView from './view/navigation.js';
import SortMenuView from './view/sort.js';
import TripListUl from './view/tripListUl.js';
// import Loading from './view/loading.js';
import Empty from './view/empty.js';
import PointsList from './view/pointsList.js';
import EditingPoint from './view/editingPoint.js';
// import NewWithoutDestination from './view/newWithoutDestination.js';
// import NewWithoutOffers from './view/newWithoutOffers.js';
// import NewPoint from './view/newPoint.js';
import { generatePoint } from './mock/createData.js';
import { renderPosition, render } from './view/renderingUtils.js';
const COUNT_OF_POINTS = 15;

const points = new Array(COUNT_OF_POINTS).fill().map(generatePoint);
points.sort((a,b) => a.dateFrom - b.dateFrom);

const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');

render(priceAndTripSection, new PriceTripView(points).getElement(), renderPosition.AFTERBEGIN);
render(toNavigation, new NavigationView().getElement(), renderPosition.AFTERBEGIN);
render(toFilters, new FiltersView().getElement(), renderPosition.AFTERBEGIN);

if (points.length === 0) {
  render(toSort, new Empty().getElement(), renderPosition.BEFOREEND);
} else {
  render(toSort, new SortMenuView().getElement(), renderPosition.AFTERBEGIN);
}

const createUl = new TripListUl();
render(toSort, createUl.getElement(), renderPosition.BEFOREEND);

const renderPoint = (place, point) => {
  const pointEvent = new PointsList(point);
  const editPoint = new EditingPoint(point);
  const replaceCardToForm = () => {
    place.replaceChild(editPoint.getElement(), pointEvent.getElement());
  };

  const replaceFormToCard = () => {
    place.replaceChild(pointEvent.getElement(), editPoint.getElement());
  };
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  pointEvent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editPoint.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  editPoint.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  render(place, pointEvent.getElement(), renderPosition.BEFOREEND);
};

for (const point of points) {
  renderPoint(createUl.getElement(), point);
}

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
