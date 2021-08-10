import { createElement } from '../view/renderingUtils.js';

const empty = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class Empty {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return empty();
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
