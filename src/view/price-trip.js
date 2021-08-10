import { getCities, totalPrice } from '../utils/rendering-utils.js';
import { createElement } from './rendering-utils.js';

const priceAndTrip = (points) => {

  if (points.length === 0) {
    return ' ';
  }
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getCities(points)['firstCity']} — ${getCities(points)['secondCity']} — ${getCities(points)['thirdCity']}</h1>

    <p class="trip-info__dates">${getCities(points)['fromDate']}&nbsp;—&nbsp;${getCities(points)['toDate']}</p>
  </div>

  <p class="trip-info__cost">
    Total: €&nbsp;<span class="trip-info__cost-value">${totalPrice(points)}</span>
  </p>
</section>`;
};
export default class PriceTripView {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return priceAndTrip(this._points);
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
