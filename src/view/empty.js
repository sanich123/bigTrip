import Abstract from '../view/abstract.js';

const empty = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class Empty extends Abstract {

  getTemplate() {
    return empty();
  }
}
