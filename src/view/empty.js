import Abstract from '../view/abstract.js';
import { FilterType } from '../utils/constants.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const getEmptyFilter = (filterType) => {
  const noPointsTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">${noPointsTextValue}</p>`);
};

export default class Empty extends Abstract {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return getEmptyFilter(this._data);
  }
}
