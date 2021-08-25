import AbstractObserver from '../utils/abstract-observer.js';

export default class PointsModel extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }
}
