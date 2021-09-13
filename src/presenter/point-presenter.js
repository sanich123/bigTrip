import EditingPoint from '../view/point-edit.js';
import TripListLi from '../view/trip-list-li.js';
import PointsList from '../view/points-list.js';
import { renderPosition, render, replace, remove } from '../utils/rendering-utils.js';
import { UserAction, UpdateType, Mode } from '../utils/constants.js';
import dayjs from 'dayjs';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};
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

  init(point, offers, destinations) {
    this._point = point;
    const prevPointEvent = this._pointEvent;
    const prevEditPoint = this._editPoint;
    const prevTripListLi = this._tripListLi;
    this._tripListLi = new TripListLi();
    this._pointEvent = new PointsList(point);
    this._editPoint = new EditingPoint(point, offers, destinations);

    if (prevTripListLi === null) {
      render(this._pointContainer, this._tripListLi, renderPosition.AFTERBEGIN);
    }
    this._pointEvent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEvent.setEditClickHandler(this._handleEditClick);
    this._editPoint.setEditClickHandler(this._handleEditClickBack);
    this._editPoint.setFormSubmitHandler(this._handleFormSubmit);
    this._editPoint.setDeleteClickHandler(this._handleDeleteClick);
    this._editPoint.setPriceListener(this._priceChangeHandler);
    this._editPoint.setPriceInputListener(this._priceInputHandler);
    this._editPoint.setCityChangeHandler(this._cityChangeHandler);
    this._editPoint.setCityInputHandler(this._cityInputHandler);
    this._editPoint.setTypeChangeHandler(this._typeChangeHandler);
    this._editPoint.setOffersListener(this._offersListener);
    this._editPoint._setDatePicker(this._timeFromHandler);
    this._editPoint._setDatePicker(this._timeToHandler);


    if (prevPointEvent === null || prevEditPoint === null) {
      render(this._tripListLi, this._pointEvent, renderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointEvent, prevPointEvent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._pointEvent, prevEditPoint);
      this._mode = Mode.DEFAULT;
    }

    this._tripListLi = prevTripListLi;
    remove(prevPointEvent);
    remove(prevEditPoint);
  }

  _replaceCardToForm() {
    replace(this._editPoint, this._pointEvent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    document.querySelector('.trip-main__event-add-btn').disabled = false;
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

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }
    const resetFormState = () => {
      this._editPoint.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    switch (state) {
      case State.SAVING:
        this._editPoint.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editPoint.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._editPoint.shake(resetFormState);
        this._pointEvent.shake(resetFormState);
        break;
    }
  }

  _handleFormSubmit(editPoint) {
    if (editPoint.destination.name === '') {
      const inputValue = this._editPoint.getElement().querySelector('.event__input--destination');
      return inputValue.setCustomValidity('Нельзя отправить пустое поле названия города');
    } else if (editPoint.basePrice === 0) {
      const inputValue = this._editPoint.getElement().querySelector('.event__input--price');
      return inputValue.setCustomValidity('Нельзя отправить поле со значением 0');
    } else if (dayjs(editPoint.dateTo) < dayjs(editPoint.dateFrom)) {
      return this._editPoint.getElement().querySelector('.event__input--destination').setCustomValidity('Дата начала не может быть позже даты конца');
    }
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      editPoint,
    );
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
