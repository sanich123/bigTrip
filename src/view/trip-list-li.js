import Abstract from '../view/abstract.js';

const tripListLi = () => '<li class="trip-events__item"></li>';
export default class TripListLi extends Abstract{

  getTemplate() {
    return tripListLi();
  }
}
