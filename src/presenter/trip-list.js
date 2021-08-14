import SortMenuView from '../view/sort.js';
import TripListUl from '../view/trip-list-ul.js';
import TripListLi from '../view/trip-list-li.js';
import Empty from '../view/empty.js';
import PointsList from '../view/points-list.js';
import EditingPoint from '../view/editing-point.js';
import { renderPosition, render } from '../utils/rendering-utils.js';
import TripPoint from '../presenter/trip-point.js';

export default class Points {
  constructor(container) {

    this._container = container;
    this._sortMenu = new SortMenuView();
    this._empty = new Empty();
    this._tripListUl = new TripListUl();
    this._tripListLi = new TripListLi();
    this._editingPoint = new EditingPoint();
    this._pointsList = new PointsList();
  }

  init(points) {
    this._points = points.slice();
    this._renderEmpty(points);
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
    // const pointEvent = new PointsList(point);
    // const editPoint = new EditingPoint(point);
    // const tripListLi = new TripListLi();

    // render(this._tripListUl, tripListLi, renderPosition.BEFOREEND);

    // const replaceCardToForm = () => {
    //   replace(editPoint, pointEvent);
    // };

    // const replaceFormToCard = () => {
    //   replace(pointEvent, editPoint);
    // };

    // const onEscKeyDown = (evt) => {
    //   if (evt.key === 'Escape' || evt.key === 'Esc') {
    //     evt.preventDefault();
    //     replaceFormToCard();
    //     document.removeEventListener('keydown', onEscKeyDown);
    //   }
    // };

    // pointEvent.setEditClickHandler(() => {
    //   replaceCardToForm();
    //   document.addEventListener('keydown', onEscKeyDown);
    // });

    // editPoint.setFormSubmitHandler(() => {
    //   replaceFormToCard();
    //   document.removeEventListener('keydown', onEscKeyDown);
    // });

    // editPoint.setEditClickHandler(() => {
    //   replaceFormToCard();
    //   document.removeEventListener('keydown', onEscKeyDown);
    // });
    // render(tripListLi, pointEvent, renderPosition.BEFOREEND);
    const tripPoint = new
    TripPoint(this._tripListUl);
    tripPoint.init(point);
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
