import { createElement } from './rendering-utils.js';

const tripListLi = () => '<li class="trip-events__item"></li>';
export default class TripListLi {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return tripListLi();
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
