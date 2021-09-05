import TripListUl from '../view/trip-list-ul.js';
import TripListLi from '../view/trip-list-li.js';
import PointsList from '../view/points-list.js';
import Loading from '../view/loading.js';
import Empty from '../view/empty.js';
import SortMenu from '../view/sort.js';
import EditingPoint from '../view/point-edit.js';
import NewTripPoint from './new-point-presenter.js';
import TripPoint from './point-presenter.js';
import PriceTripView from '../view/price-trip.js';
import { renderPosition, render, remove } from '../utils/rendering-utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../utils/constants.js';
import dayjs from 'dayjs';
import { filter } from '../utils/filter.js';

export default class PointsPresenter {
  constructor(container, pointsModel, filtersModel) {
    this._filtersModel = filtersModel;
    this._pointsModel = pointsModel;
    this._container = container;
    this._tripPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;

    this._sortMenu = null;
    this._empty = null;
    this._priceTrip = new PriceTripView();
    this._tripListUl = new TripListUl();
    this._tripListLi = new TripListLi();
    this._editingPoint = new EditingPoint();
    this._pointsList = new PointsList();
    this._loading = new Loading();
    this._newTripPoint = new NewTripPoint(this._tripListUl, this._handleViewAction, this._pointsModel);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
    if (this._pointsModel.getPoints().length === 0) {
      this._renderEmpty();
    } else {
      this._renderSort();
    }
  }

  _renderPriceTrip() {
    render(document.querySelector('.trip-main'), this._priceTrip(this._pointsModel.getPoints()), renderPosition.AFTERBEGIN);
  }

  _renderEmpty() {
    this._empty = new Empty(this._filterType);
    render(this._container, this._empty, renderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._container, this._loading, renderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortMenu !== null) {
      this._sortMenu = null;
    }
    this._sortMenu = new SortMenu(this._currentSortType);
    render(this._container, this._sortMenu, renderPosition.AFTERBEGIN);
    this._sortMenu.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._renderTripListUl();
  }

  _renderTripListUl() {
    render(this._container, this._tripListUl, renderPosition.BEFOREEND);
    this._renderPointsList();
  }

  _renderPointsList() {
    this._getPoints().slice().forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const tripPoint = new TripPoint(this._tripListUl, this._handleViewAction, this._handleModeChange);
    tripPoint.init(point);
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

    this._renderSort();
    // this._renderPriceTrip();
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._sortMenu);
    remove(this._tripListUl);

    // this._tasksModel.removeObserver(this._handleModelEvent);
    // this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newTripPoint.init();
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
    return filtredPoints.sort((a, b) => b.dateFrom - a.dateFrom);
  }

  _clearBoard({resetSortType = false} = {}) {
    this._newTripPoint.destroy();
    this._tripPresenter.forEach((presenter) => presenter.destroy());
    this._tripPresenter.clear();

    remove(this._sortMenu);
    remove(this._loading);
    if (this._empty) {
      remove(this._empty);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    // console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // console.log(updateType, data);
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
