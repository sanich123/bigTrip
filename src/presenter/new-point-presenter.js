import EditingPoint from '../view/point-edit.js';
import TripListLi from '../view/trip-list-li.js';
import { renderPosition, render, remove } from '../utils/rendering-utils.js';
import { UserAction, UpdateType } from '../utils/common.js';
import { nanoid } from 'nanoid';

export default class NewTripPoint {
  constructor(pointContainer, changeData, pointsModel) {
    this._pointsModel = pointsModel;
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._editPoint = null;
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    this._tripListLi = new TripListLi();
    render(this._pointContainer, this._tripListLi, renderPosition.AFTERBEGIN);
    this._editPoint = new EditingPoint(this._pointsModel.getPoints()[0]);

    this._editPoint.setFormSubmitHandler(this._handleFormSubmit);
    this._editPoint.setDeleteClickHandler(this._handleDeleteClick);
    this._editPoint._setDatePicker(this._timeFromHandler);
    render(this._tripListLi, this._editPoint, renderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editPoint === null) {
      return;
    }
    remove(this._tripListLi);
    remove(this._editPoint);
    this._editPoints = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, point),
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
