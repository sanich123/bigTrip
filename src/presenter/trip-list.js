import TripListUl from '../view/trip-list-ul.js';
import TripListLi from '../view/trip-list-li.js';
import Empty from '../view/empty.js';
import PointsList from '../view/points-list.js';
import EditingPoint from '../view/point-edit.js';
import { renderPosition, render, remove } from '../utils/rendering-utils.js';
import TripPoint from '../presenter/trip-point.js';
import { SortType } from '../utils/common.js';
import dayjs from 'dayjs';
import SortMenu from '../view/sort.js';

export default class PointsPresenter {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;
    this._container = container;
    this._tripPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._sortMenu = new SortMenu();
    this._empty = new Empty();
    this._tripListUl = new TripListUl();
    this._tripListLi = new TripListLi();
    this._editingPoint = new EditingPoint();
    this._pointsList = new PointsList();
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    if (this._pointsModel.getPoints().length === 0) {
      render(this._container, this._empty, renderPosition.BEFOREEND);
    } else {
      this._renderSort();
    }
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort((a, b) => Math.abs(dayjs(a.dateFrom).diff(dayjs(a.dateTo))) - Math.abs(dayjs(b.dateFrom).diff(dayjs(b.dateTo))));
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort((a, b) => a.basePrice - b.basePrice);
    }
    return this._pointsModel.getPoints();
  }

  _renderSort() {
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
    const tripPoint = new TripPoint(this._tripListUl, this._handlePointChange, this._handleModeChange);
    tripPoint.init(point);
    this._tripPresenter.set(point.id, tripPoint);
  }

  _handlePointChange(updatedPoint) {
  // Здесь будем вызывать обновление модели
    this._tripPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearPointsList();
    remove(this._sortMenu);
    this._sortMenu = new SortMenu(this._currentSortType);
    render(this._container, this._sortMenu, renderPosition.AFTERBEGIN);
    this._sortMenu.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._renderPointsList();
  }

  _handleModeChange() {
    this._tripPresenter.forEach((presenter) => presenter.resetView());
  }

  _clearPointsList() {
    this._tripPresenter.forEach((presenter) => presenter.destroy());
    this._tripPresenter.clear();
  }
}
