import TripListUl from '../view/trip-list-ul.js';
import TripListLi from '../view/trip-list-li.js';
import Empty from '../view/empty.js';
import PointsList from '../view/points-list.js';
import EditingPoint from '../view/point-edit.js';
import { renderPosition, render, remove } from '../utils/rendering-utils.js';
import TripPoint from '../presenter/trip-point.js';
import { SortType, UpdateType, UserAction } from '../utils/common.js';
import dayjs from 'dayjs';
import SortMenu from '../view/sort.js';

export default class PointsPresenter {
  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;
    this._container = container;
    this._tripPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._sortMenu = null;
    this._empty = new Empty();
    this._tripListUl = new TripListUl();
    this._tripListLi = new TripListLi();
    this._editingPoint = new EditingPoint();
    this._pointsList = new PointsList();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    if (this._pointsModel.getPoints().length === 0) {
      this._renderEmpty();
    } else {
      this._renderSort();
    }
  }

  _renderEmpty() {
    render(this._container, this._empty, renderPosition.BEFOREEND);
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

  _handleViewAction(actionType, updateType, update) {
    // console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
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
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._taskPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        // - обновить всю доску (например, при переключении фильтра)
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

  _clearBoard({resetSortType = false} = {}) {
    this._tripPresenter.forEach((presenter) => presenter.destroy());
    this._tripPresenter.clear();

    remove(this._sortMenu);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._pointsModel.getPoints() === 0) {
      this._renderEmpty();
      return;
    }
    this._renderSort();
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
