import EditingPoint from '../view/point-edit.js';
import NewPoint from '../view/new-point.js';
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
    this._handleDeleteClick2 = this._handleDeleteClick2.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormSubmit2 = this._handleFormSubmit2.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._escKeyDownHandler2 = this._escKeyDownHandler2.bind(this);
    this._handleEditClickBack = this._handleEditClickBack.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init( point, offers, destinations) {
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

  init2(offers, destinations) {
    this._tripListLi = new TripListLi();
    render(this._pointContainer, this._tripListLi, renderPosition.AFTERBEGIN);
    const point = {
      basePrice: 0,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      destination: {
        description: '',
        name: '',
        pictures: '',
      },
      isFavorite: false,
      type: 'taxi',
      offers: [
        {title: 'Upgrade to a business class', price: 190},
        {title: 'Choose the radio station', price: 30},
        {title: 'Choose temperature', price: 170},
        {title: 'Drive quickly, I\'m in a hurry', price: 100},
        {title: 'Drive slowly', price: 110},
      ],
    };
    this._editPoint = new NewPoint(point, offers, destinations);
    this._editPoint.setFormSubmitHandler2(this._handleFormSubmit2);
    this._editPoint.setDeleteClickHandler2(this._handleDeleteClick2);
    this._editPoint.setPriceListener(this._priceChangeHandler);
    this._editPoint.setPriceInputListener(this._priceInputHandler);
    this._editPoint.setCityChangeHandler(this._cityChangeHandler);
    this._editPoint.setCityInputHandler(this._cityInputHandler);
    this._editPoint.setTypeChangeHandler(this._typeChangeHandler);
    this._editPoint.setOffersListener(this._offersListener);
    this._editPoint._setDatePicker(this._timeFromHandler);
    this._editPoint._setDatePicker(this._timeToHandler);
    render(this._tripListLi, this._editPoint, renderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._escKeyDownHandler2);
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

  _handleDeleteClick2() {
    this.destroy();
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
      const inputValue = this._editPoint._element[11];
      return inputValue.setCustomValidity('Нельзя отправить пустое поле названия города');
    } else if (editPoint.basePrice === 0) {
      const inputValue = this._editPoint._element[14];
      return inputValue.setCustomValidity('Нельзя отправить поле со значением 0');
    } else if (dayjs(editPoint.dateTo) < dayjs(editPoint.dateFrom)) {
      return this._editPoint._element[11].setCustomValidity('Дата окончания не может быть раньше начала');
    }
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      editPoint,
    );
  }

  _handleFormSubmit2(editPoint) {
    if (editPoint.destination.name === '') {
      const inputValue = this._editPoint._element[11];
      return inputValue.setCustomValidity('Нельзя отправить пустое поле названия города');
    } else if (editPoint.basePrice === 0) {
      const inputValue = this._editPoint._element[14];
      return inputValue.setCustomValidity('Нельзя отправить поле со значением 0');
    } else if (dayjs(editPoint.dateTo) < dayjs(editPoint.dateFrom)) {
      return this._editPoint._element[11].setCustomValidity('Дата окончания не может быть раньше начала');
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      editPoint,
    );
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }

  setSaving() {
    this._editPoint.updateData({
      isDisabled: true,
      isSaving: true,
    });
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

  _escKeyDownHandler2(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
      document.querySelector('.trip-main__event-add-btn').disabled = false;
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
