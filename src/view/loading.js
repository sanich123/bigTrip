import Abstract from '../view/abstract.js';

const loading = () => (
  '<p class="trip-events__msg">Loading...</p>'
);
export default class Loading extends Abstract {

  getTemplate() {
    return loading();
  }
}

