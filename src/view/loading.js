import { createElement } from '../view/renderingUtils.js';
const loading = () => (
  '<p class="trip-events__msg">Loading...</p>'
);
export default class Loading {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return loading();
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

