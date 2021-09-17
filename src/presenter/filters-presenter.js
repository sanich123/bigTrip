import FiltersView from '../view/filters-view.js';
import { render, RenderPosition, replace, remove } from '../utils/rendering-utils.js';
import { FilterType, UpdateType } from '../utils/constants.js';


export default class FiltersPresenter {
  constructor(filterContainer, filtersModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filtersModel = filtersModel;
    this._pointsModel = pointsModel;
    this._filterComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FiltersView(this._filtersModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }
    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
      },
      {
        type: FilterType.FUTURE,
      },
      {
        type: FilterType.PAST,
      },
    ];
  }
}
