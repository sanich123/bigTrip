import PriceTripView from './view/price-trip.js';
import NavigationView from './view/navigation.js';
// import Loading from './view/loading.js';
// import NewWithoutDestination from './view/newWithoutDestination.js';
// import NewWithoutOffers from './view/new-without-offers.js';
// import NewPoint from './view/newPoint.js';
import { generatePoint } from './mock/create-data.js';
import { renderPosition, render, remove } from './utils/rendering-utils.js';
import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import { MenuItem } from './utils/constants.js';
import StatisticsView from './view/statistics.js';
import Api from './api.js';

const COUNT_OF_POINTS = 24;
const AUTHORIZATION = 'Basic hD3sb8dfSWcl2sA5j';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';

const points = new Array(COUNT_OF_POINTS).fill().map(generatePoint);
points.sort((a, b) => b.dateFrom - a.dateFrom);
const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((point) => {
  console.log(point);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filtersModel = new FiltersModel();

const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');
const toStat = document.querySelector('main.page-body__page-main .page-body__container');

render(priceAndTripSection, new PriceTripView(pointsModel.getPoints()), renderPosition.AFTERBEGIN);
const navigationView = new NavigationView();
render(toNavigation, navigationView, renderPosition.AFTERBEGIN);

const pointsPresenter = new PointsPresenter(toSort, pointsModel, filtersModel);
const filterPresenter = new FiltersPresenter(toFilters, filtersModel, pointsModel);

let statisticsComponent = null;

const handleNavigationClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      pointsPresenter.destroy();
      pointsPresenter.init();
      remove(statisticsComponent);
      statisticsComponent = null;
      navigationView.addClassItem(MenuItem.POINTS);
      navigationView.removeClassItem(MenuItem.STATISTICS);
      document.querySelector('.trip-main__event-add-btn').disabled = false;
      document.querySelectorAll('.trip-filters__filter-input').forEach((it) => it.disabled = false);
      break;
    case MenuItem.STATISTICS:
      if (statisticsComponent !== null) {
        return;
      }
      pointsPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(toStat, statisticsComponent, renderPosition.AFTERBEGIN);
      navigationView.addClassItem(MenuItem.STATISTICS);
      navigationView.removeClassItem(MenuItem.POINTS);
      document.querySelector('.trip-main__event-add-btn').disabled = true;
      document.querySelectorAll('.trip-filters__filter-input').forEach((it) => it.disabled = true);
      break;
  }
};

navigationView.setMenuClickHandler(handleNavigationClick);
pointsPresenter.init();
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
