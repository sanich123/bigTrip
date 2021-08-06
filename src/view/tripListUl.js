import { createElement } from '../utils/utils.js';

const tripListUl = () => '<ul class="trip-events__list"></ul>';

export default class TripListUl {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return tripListUl();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
