import { getCities, totalPrice } from '../utils/rendering-data-utils.js';
import Abstract from '../view/abstract.js';

const priceAndTrip = (points) => points.length === 0 ? ' ' : `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getCities(points)['firstCity']} — ${getCities(points).secondCity} — ${getCities(points).thirdCity}</h1>
    <p class="trip-info__dates">${getCities(points).fromDate}&nbsp;—&nbsp;${getCities(points).toDate}</p>
  </div>
  <p class="trip-info__cost">
    Total: €&nbsp;<span class="trip-info__cost-value">${totalPrice(points)}</span>
  </p>
</section>`;

export default class PriceTripView extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return priceAndTrip(this._points);
  }
}
