import SortMenuView from '../view/sort.js';
import TripListUl from '../view/trip-list-ul.js';
import TripListLi from '../view/trip-list-li.js';
import Empty from '../view/empty.js';
import PointsList from '../view/points-list.js';
import EditingPoint from '../view/editing-point.js';
import { renderPosition, render } from '../utils/rendering-utils.js';
import TripPoint from '../presenter/trip-point.js';
import { updateItem } from '../utils/common.js';

export default class Points {
  constructor(container) {
    this._container = container;
    this._tripPoint = new Map();
    this._sortMenu = new SortMenuView();
    this._empty = new Empty();
    this._tripListUl = new TripListUl();
    this._tripListLi = new TripListLi();
    this._editingPoint = new EditingPoint();
    this._pointsList = new PointsList();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._renderEmpty(points);
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._tripPoint.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._tripPoint.forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._container, this._sortMenu, renderPosition.AFTERBEGIN);
    this._renderTripListUl();
  }

  _renderTripListUl() {
    render(this._container, this._tripListUl, renderPosition.BEFOREEND);
    this._renderPointsList();
  }

  _renderPoint(point) {
    const tripPoint = new TripPoint(this._tripListUl, this._handlePointChange, this._handleModeChange);
    tripPoint.init(point);
    this._tripPoint.set(point.id, tripPoint);
  }

  _clearTaskList() {
    this._tripPoint.forEach((presenter) => presenter.destroy());
    this._tripPoint.clear();
  }

  _renderPointsList() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderEmpty() {
    if (this._points.length === 0) {
      render(this._container, this._empty, renderPosition.BEFOREEND);
    } else {
      this._renderSort();
    }
  }
}
