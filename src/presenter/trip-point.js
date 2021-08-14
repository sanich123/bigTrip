import EditingPoint from '../view/editing-point.js';
import TripListLi from '../view/trip-list-li.js';
import PointsList from '../view/points-list.js';
import { renderPosition, render, replace } from '../utils/rendering-utils.js';

export default class TripPoint {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;

    this._pointEvent = null;
    this._editPoint = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClickBack = this._handleEditClickBack.bind(this);
  }

  init(point) {
    this._point = point;

    this._tripListLi = new TripListLi();
    this._pointEvent = new PointsList(point);
    this._editPoint = new EditingPoint(point);

    this._pointEvent.setEditClickHandler(this._handleEditClick);
    this._editPoint.setFormSubmitHandler(this._handleFormSubmit);
    this._editPoint.setEditClickHandler(this._handleEditClickBack);

    render(this._pointContainer, this._pointEvent, renderPosition.BEFOREEND);
  }

  _replaceCardToForm() {
    replace(this._editPoint, this._pointEvent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToCard() {
    replace(this._pointEvent, this._editPoint);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }

  _handleEditClickBack() {
    this._replaceFormToCard();
  }
}
