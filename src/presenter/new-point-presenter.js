import NewPoint from '../view/new-point.js';
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
    const point = {
      id: nanoid(),
      basePrice: 0,
      dateFrom: '2021-09-09T00:00:00.000Z',
      dateTo: '2021-09-10T00:00:00.000Z',
      destination: {
        description: [
          'Fusce tristique felis at fermentum pharetra. ',
          'Aliquam id orci ut lectus varius viverra. ',
          ' Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
          'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
          'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
          'Sed sed nisi sed augue convallis suscipit in sed felis. ',
          'Aliquam erat volutpat. ',
          'Nunc fermentum tortor ac porta dapibus. ',
          'In rutrum ac purus sit amet tempus. ',
        ],
        name: '',
        pictures: [
          {
            'src': 'http://picsum.photos/300/200?r=0.5051691418046964',
            'description': 'Cras aliquet varius magna, non porta ligula feugiat eget. ',
          },
          {
            'src': 'http://picsum.photos/300/200?r=0.9734774014404415',
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
          },
          {
            'src': 'http://picsum.photos/300/200?r=0.535029945808549',
            'description': 'Nunc fermentum tortor ac porta dapibus. ',
          },
          {
            'src': 'http://picsum.photos/300/200?r=0.7640266037521821',
            'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
          },
        ],
      },
      isFavorite: false,
      isDisabled: 'disabled',
      type: 'taxi',
      offers: [
        {
          'title': 'Хочу сибаса',
          'price': 120,
        },
        {
          'title': 'Стейк омара за 80 тыс рублей',
          'price': 120,
        },
        {
          'title': 'Труа буте ди водка, авек плезир',
          'price': 120,
        },
        {
          'title': 'Оливье и майонеза побольше',
          'price': 120,
        },
      ],
    };
    this._editPoint = new NewPoint(point);

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
    if (newPoint.basePrice === 0 || newPoint.destination.name === '') {
      return;
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, newPoint),
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
