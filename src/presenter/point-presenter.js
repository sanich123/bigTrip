import EditingPoint from '../view/point-edit.js';
import TripListLi from '../view/trip-list-li.js';
import PointsList from '../view/points-list.js';
import { renderPosition, render, replace, remove } from '../utils/rendering-utils.js';
import { UserAction, UpdateType, Mode } from '../utils/common.js';

export default class TripPoint {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._tripListLi = null;
    this._pointEvent = null;
    this._editPoint = null;
    this._mode = Mode.DEFAULT;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClickBack = this._handleEditClickBack.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointEvent = this._pointEvent;
    const prevEditPoint = this._editPoint;
    const prevTripListLi = this._tripListLi;
    this._tripListLi = new TripListLi();
    this._pointEvent = new PointsList(point);
    this._editPoint = new EditingPoint(point);

    if (prevTripListLi === null) {
      render(this._pointContainer, this._tripListLi, renderPosition.AFTERBEGIN);
    }
    this._pointEvent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEvent.setEditClickHandler(this._handleEditClick);
    this._editPoint.setFormSubmitHandler(this._handleFormSubmit);
    this._editPoint.setEditClickHandler(this._handleEditClickBack);
    this._editPoint.setDeleteClickHandler(this._handleDeleteClick);
    this._editPoint.setTypeChangeHandler(this._typeChangeHandler);
    this._editPoint.setCityChangeHandler(this._cityChangeHandler);
    this._editPoint._setDatePicker(this._timeFromHandler);
    this._editPoint.setOffersListener(this._offersListener);
    this._editPoint.setPriceListener(this._priceChangeHandler);

    if (prevPointEvent === null || prevEditPoint === null) {
      render(this._tripListLi, this._pointEvent, renderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointEvent, prevPointEvent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._editPoint, prevEditPoint);
    }

    this._tripListLi = prevTripListLi;
    remove(prevPointEvent);
    remove(prevEditPoint);
  }

  _replaceCardToForm() {
    replace(this._editPoint, this._pointEvent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointEvent, this._editPoint);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(update) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
    this._replaceFormToCard();
  }

  _handleEditClickBack() {
    this._replaceFormToCard();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPoint.reset(this._point);
      this._replaceFormToCard();
    }
  }

  destroy() {
    remove(this._tripListLi);
    remove(this._pointEvent);
    remove(this._editPoint);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }
}
