import Abstract from '../view/abstract.js';
import { FilterType } from '../utils/common.js';

const noPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const empty = (filterType) => {
  const noPointsTextValue = noPointsTextType[filterType];
  return `<p class="trip-events__msg">${noPointsTextValue}</p>`;
};

export default class Empty extends Abstract {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return empty(this._data);
  }
}
