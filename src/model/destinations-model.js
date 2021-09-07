import AbstractObserver from '../utils/abstract-observer.js';

export default class DestinationsModel extends AbstractObserver {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations;
    this._notify(updateType, destinations);
  }

  getDestinations() {
    return this._destinations;
  }
}
