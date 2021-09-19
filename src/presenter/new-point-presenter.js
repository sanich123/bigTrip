import TripListLi from '../view/trip-list-li.js';
import { render, remove } from '../utils/rendering-utils.js';
import { UserAction, UpdateType, RenderPosition } from '../utils/constants.js';
import dayjs from 'dayjs';
import EditingPoint from '../view/point-edit.js';

export default class NewTripPoint {
  constructor(pointContainer, changeData, pointsModel) {
    this._pointsModel = pointsModel;
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._isEdit = false;
    this._editPoint = null;
    this._newPointButton = document.querySelector('.trip-main__event-add-btn');
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(offers, destinations) {
    this._tripListLi = new TripListLi();
    render(this._pointContainer, this._tripListLi, RenderPosition.AFTERBEGIN);
    this._editPoint = new EditingPoint(undefined, offers, destinations, this._isEdit);
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
    render(this._tripListLi, this._editPoint, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  setAborting() {
    const resetFormState = () => {
      this._editPoint.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this._editPoint.shake(resetFormState);
  }

  setSaving() {
    this._editPoint.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  destroy() {
    if (this._editPoint === null) {
      return;
    }
    remove(this._tripListLi);
    remove(this._editPoint);
    this._editPoint = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(newPoint) {
    if (newPoint.destination.name === '') {
      const inputValue = this._editPoint.getElement().querySelector('.event__input--destination');
      return inputValue.setCustomValidity('Нельзя отправить пустое поле названия города');
    } else if (newPoint.basePrice === 0) {
      const inputValue = this._editPoint.getElement().querySelector('.event__input--price');
      return inputValue.setCustomValidity('Нельзя отправить поле со значением 0');
    } else if (dayjs(newPoint.dateTo) < dayjs(newPoint.dateFrom)) {
      return this._editPoint.getElement().querySelector('.event__input--destination').setCustomValidity('Дата начала не может быть позже даты конца');
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign(
        newPoint),
    );
    this._newPointButton.disabled = false;
  }

  _handleDeleteClick() {
    this.destroy();
    this._newPointButton.disabled = false;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
    this._newPointButton.disabled = false;
  }
}
