import EditingPoint from '../view/editing-point.js';
import TripListLi from '../view/trip-list-li.js';
import TripListUl from '../view/trip-list-ul.js';
import PointsList from '../view/points-list.js';
import { renderPosition, render, replace, remove } from '../utils/rendering-utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPoint {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointEvent = null;
    this._editPoint = null;
    this._mode = Mode.DEFAULT;

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

    this._tripListUl = new TripListUl();

    this._tripListLi = new TripListLi();
    this._pointEvent = new PointsList(point);
    this._editPoint = new EditingPoint(point);
    this._pointEvent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEvent.setEditClickHandler(this._handleEditClick);
    this._editPoint.setFormSubmitHandler(this._handleFormSubmit);
    this._editPoint.setEditClickHandler(this._handleEditClickBack);

    render(this._pointContainer, this._tripListLi, renderPosition.BEFOREEND);

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

    remove(prevPointEvent);
    remove(prevEditPoint);
  }


  destroy() {
    remove(this._pointEvent);
    remove(this._editPoint);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
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

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    // this._changeData(point);
    this._replaceFormToCard();
  }

  _handleEditClickBack() {
    this._replaceFormToCard();
  }
}
