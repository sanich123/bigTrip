import TripListUl from '../view/trip-list-ul.js';
import TripListLi from '../view/trip-list-li.js';
import PointsList from '../view/points-list.js';
import Loading from '../view/loading.js';
import Empty from '../view/empty.js';
import SortMenu from '../view/sort.js';
import EditingPoint from '../view/point-edit.js';
import NewTripPoint from './new-point-presenter.js';
import PriceTripView from '../view/price-trip.js';
import TripPoint from './point-presenter.js';
import { render, remove } from '../utils/rendering-utils.js';
import { SortType, UpdateType, UserAction, FilterType, State, RenderPosition } from '../utils/constants.js';
import dayjs from 'dayjs';
import { filter } from '../utils/filter.js';

export default class PointsPresenter {
  constructor(priceTripContainer, container, pointsModel, filtersModel, api, destinationsModel, offersModel) {
    this._priceTripContainer = priceTripContainer;
    this._container = container;
    this._pointsModel = pointsModel;
    this._filtersModel = filtersModel;
    this._api = api;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;

    this._tripPresenter = new Map();

    this._infoComponent = null;
    this._sortMenu = null;
    this._empty = null;

    this._tripListUl = new TripListUl();
    this._tripListLi = new TripListLi();
    this._editingPoint = new EditingPoint();
    this._pointsList = new PointsList();
    this._loading = new Loading();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._newTripPoint = new NewTripPoint(this._tripListUl, this._handleViewAction, this._pointsModel);
    this._newPointButton = document.querySelector('.trip-main__event-add-btn');
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    if (this._pointsModel.getPoints().length === 0) {
      this._renderEmpty();
    } else {
      this._renderPriceTrip();
      this._renderSort();
    }
  }

  destroy() {
    this._clearBoard({resetSortType: true});
    remove(this._sortMenu);
    remove(this._tripListUl);
  }

  createPoint() {
    if (this._pointsModel.getPoints().length === 0) {
      render(this._container, this._tripListUl, RenderPosition.BEFOREEND);
    }
    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();
    this._currentSortType = SortType.DAY;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newTripPoint.init(this._offers, this._destinations);
    if (this._empty) {
      remove(this._empty);
    }
  }

  _renderEmpty() {
    this._empty = new Empty(this._filterType);
    render(this._container, this._empty, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._container, this._loading, RenderPosition.BEFOREEND);
  }

  _renderPriceTrip() {
    if(this._infoComponent !== null) {
      this._infoComponent = null;
    }
    this._infoComponent = new PriceTripView(this._pointsModel.getPoints());
    render(this._priceTripContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._empty) {
      remove(this._empty);
    }
    if (this._sortMenu !== null) {
      this._sortMenu = null;
    }
    this._sortMenu = new SortMenu(this._currentSortType);
    render(this._container, this._sortMenu, RenderPosition.AFTERBEGIN);
    this._sortMenu.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._renderTripListUl();
  }

  _renderTripListUl() {
    render(this._container, this._tripListUl, RenderPosition.BEFOREEND);
    this._renderPointsList();
  }

  _renderPointsList() {
    this._getPoints().forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();
    const tripPoint = new TripPoint(this._tripListUl, this._handleViewAction, this._handleModeChange);
    tripPoint.init(point, this._offers, this._destinations);
    this._tripPresenter.set(point.id, tripPoint);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    this._filterType = this._filtersModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[this._filterType](points);
    if (filtredPoints.length === 0) {
      this._renderEmpty();
      return;
    }
    this._renderPriceTrip();
    this._renderSort();
  }

  _getPoints() {
    this._filterType = this._filtersModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[this._filterType](points);
    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort((a, b) => Math.abs(dayjs(a.dateFrom).diff(dayjs(a.dateTo))) - Math.abs(dayjs(b.dateFrom).diff(dayjs(b.dateTo))));
      case SortType.PRICE:
        return filtredPoints.sort((a, b) => a.basePrice - b.basePrice);
    }
    return filtredPoints.sort((a, b) => dayjs(b.dateFrom) - dayjs(a.dateFrom));
  }

  _clearBoard({resetSortType = false} = {}) {
    this._newTripPoint.destroy();
    this._tripPresenter.forEach((presenter) => presenter.destroy());
    this._tripPresenter.clear();
    remove(this._infoComponent);
    remove(this._sortMenu);
    remove(this._loading);

    if (this._empty) {
      remove(this._empty);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
    this._newPointButton.disabled = false;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._tripPresenter.get(update.id).setViewState(State.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
          .catch(() => {
            this._tripPresenter.get(update.id).setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newTripPoint.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
          .catch(() => {
            this._newTripPoint.setAborting();
            this._newPointButton.disabled = true;
          });
        break;
      case UserAction.DELETE_POINT:
        this._tripPresenter.get(update.id).setViewState(State.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
          .catch(() => {
            this._tripPresenter.get(update.id).setViewState(State.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loading);
        remove(this._empty);
        this._clearBoard();
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _handleModeChange() {
    this._newTripPoint.destroy();
    this._tripPresenter.forEach((presenter) => presenter.resetView());
  }
}
