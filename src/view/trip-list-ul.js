import Abstract from '../view/abstract.js';

const tripListUl = () => '<ul class="trip-events__list"></ul>';
export default class TripListUl extends Abstract {
  getTemplate() {
    return tripListUl();
  }
}
