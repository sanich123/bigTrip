import PriceTripView from './view/price-trip.js';
import NavigationView from './view/navigation.js';
// import Loading from './view/loading.js';
// import NewWithoutDestination from './view/newWithoutDestination.js';
// import NewWithoutOffers from './view/new-without-offers.js';
// import NewPoint from './view/newPoint.js';
import { generatePoint } from './mock/create-data.js';
import { renderPosition, render } from './utils/rendering-utils.js';
import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import { MenuItem, UpdateType, FilterType } from './utils/constants.js';
import StatisticsView from './view/statistics.js';

const COUNT_OF_POINTS = 14;

const points = new Array(COUNT_OF_POINTS).fill().map(generatePoint);
points.sort((a, b) => b.dateFrom - a.dateFrom);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filtersModel = new FiltersModel();

const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');

render(priceAndTripSection, new PriceTripView(pointsModel.getPoints()), renderPosition.AFTERBEGIN);
const navigationView = new NavigationView();
render(toNavigation, navigationView, renderPosition.AFTERBEGIN);

const pointsPresenter = new PointsPresenter(toSort, pointsModel, filtersModel);
const filterPresenter = new FiltersPresenter(toFilters, filtersModel, pointsModel);

const handleNavigationClick = (menuItem) => {
  switch (menuItem) {
    // case MenuItem.ADD_NEW_TASK:
    //   // Скрыть статистику
    //   // Показать доску
    //   // Показать форму добавления новой задачи
    //   // Убрать выделение с ADD NEW TASK после сохранения
    //   break;
    case MenuItem.POINTS:
      pointsPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      pointsPresenter.destroy();
      // Показать статистику
      break;
  }
};

navigationView.setMenuClickHandler(handleNavigationClick);
// pointsPresenter.init();
render(toSort, new StatisticsView(pointsModel.getPoints()), renderPosition.BEFOREEND);
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  pointsPresenter.createPoint();
});

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
