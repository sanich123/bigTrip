import Abstract from '../view/abstract.js';
import { MenuItem } from '../utils/constants.js';

const navigationMenu = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-name="${MenuItem.POINTS}">Table</a>
  <a class="trip-tabs__btn" href="#" data-name="${MenuItem.STATISTICS}">Stats</a>
</nav>`
);

export default class NavigationView extends Abstract {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }

  getTemplate() {
    return navigationMenu();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.name);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }



}
