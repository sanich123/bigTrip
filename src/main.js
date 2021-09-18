import NavigationView from './view/navigation.js';
import { RenderPosition, render, remove } from './utils/rendering-utils.js';
import PriceTripView from './view/price-trip.js';
import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from './model/filters-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import { MenuItem, UpdateType } from './utils/constants.js';
import StatisticsView from './view/statistics.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic hD3sb8dfSWcl2sA5j';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';

const priceAndTripSection = document.querySelector('.trip-main');
const toNavigation = document.querySelector('.trip-controls__navigation');
const toFilters = document.querySelector('.trip-controls__filters');
const toSort = document.querySelector('.trip-events');
const toStat = document.querySelector('main.page-body__page-main .page-body__container');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filtersModel = new FiltersModel();
const api = new Api(END_POINT, AUTHORIZATION);

const navigationView = new NavigationView();
render(toNavigation, navigationView, RenderPosition.AFTERBEGIN);

const pointsPresenter = new PointsPresenter(priceAndTripSection, toSort, pointsModel, filtersModel, api, destinationsModel, offersModel);
const filterPresenter = new FiltersPresenter(toFilters, filtersModel, pointsModel);

let statisticsComponent = null;
let priceTripView = null;

const handleNavigationClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      pointsPresenter.destroy();
      pointsPresenter.init();
      remove(statisticsComponent);
      remove(priceTripView);
      statisticsComponent = null;
      priceTripView = null;
      navigationView.addClassItem(MenuItem.POINTS);
      navigationView.removeClassItem(MenuItem.STATISTICS);
      newPointButton.disabled = false;
      document.querySelectorAll('.trip-filters__filter-input').forEach((it) => it.disabled = false);
      break;
    case MenuItem.STATISTICS:
      if (statisticsComponent !== null) {
        return;
      }
      pointsPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(toStat, statisticsComponent, RenderPosition.AFTERBEGIN);
      navigationView.addClassItem(MenuItem.STATISTICS);
      navigationView.removeClassItem(MenuItem.POINTS);
      newPointButton.disabled = true;
      document.querySelectorAll('.trip-filters__filter-input').forEach((it) => it.disabled = true);
      priceTripView = new PriceTripView(pointsModel.getPoints());
      render(priceAndTripSection, priceTripView, RenderPosition.AFTERBEGIN);
      break;
  }
};

pointsPresenter.init();
filterPresenter.init();

newPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  pointsPresenter.createPoint();
  document.querySelector('.trip-main__event-add-btn').disabled = true;
});

Promise.all([
  api.getDestinations(),
  api.getOffers(),
  api.getPoints(),
]).then((values) => {
  const [destinations, offers, points] = values;
  pointsModel.setPoints(UpdateType.INIT, points);
  offersModel.setOffers(UpdateType.INIT, offers);
  destinationsModel.setDestinations(UpdateType.INIT, destinations);
  newPointButton.disabled = false;
  navigationView.setMenuClickHandler(handleNavigationClick);
}).catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
});

