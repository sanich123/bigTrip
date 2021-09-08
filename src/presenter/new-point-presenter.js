import NewPoint from '../view/new-point.js';
import TripListLi from '../view/trip-list-li.js';
import { renderPosition, render, remove } from '../utils/rendering-utils.js';
import { UserAction, UpdateType } from '../utils/constants.js';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export default class NewTripPoint {
  constructor(pointContainer, changeData, pointsModel,
    //  offersModel, destinationsModel
  ) {
    this._pointsModel = pointsModel;
    // this._offers = offersModel;
    // this._destination = destinationsModel;
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._editPoint = null;
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(offers, destinations) {
    this._tripListLi = new TripListLi();
    render(this._pointContainer, this._tripListLi, renderPosition.AFTERBEGIN);
    const point = {
      id: nanoid(),
      basePrice: 0,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      destination: {
        description: '',
        name: '',
        pictures: '',
      },
      isFavorite: false,
      isDisabled: true,
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
    render(this._tripListLi, this._editPoint, renderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editPoint === null) {
      return;
    }
    remove(this._tripListLi);
    remove(this._editPoint);
    // this._editPoint = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(newPoint) {
    if (newPoint.destination.name === '') {
      const inputValue = this._editPoint._element[11];
      return inputValue.setCustomValidity('Нельзя отправить пустое поле названия города');
    } else if (newPoint.basePrice === 0) {
      const inputValue = this._editPoint._element[14];
      return inputValue.setCustomValidity('Нельзя отправить поле со значением 0');
    } else if (dayjs(newPoint.dateTo) < dayjs(newPoint.dateFrom)) {
      return this._editPoint._element[11].setCustomValidity('Дата окончания не может быть раньше начала');
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign(
        // {id: nanoid()},
        newPoint),
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
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }
}
