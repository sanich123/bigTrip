import Smart from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { duration2 } from '../utils/rendering-data-utils.js';
import dayjs from 'dayjs';

const HEADINGS = {
  TIMESPEND: 'TIME-SPEND',
  TYPE: 'TYPE',
  MONEY: 'MONEY',
};

const chart = (place, types, values, text) => new Chart(place, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: types,
    datasets: [{
      data: values,
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => `${val}`,
      },
    },
    title: {
      display: true,
      text: text,
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },

      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },

      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const moneyChart = (moneyCtx, points) => {
  const summary = Array.from(points.reduce((point, { type, basePrice }) => point.set(type, (point.get(type) || 0) + basePrice), new Map)).sort((a, b) => b[1] - a[1]).slice();
  const money =  summary.map((it) => it[1]);
  const types = summary.map((it) => it[0].toUpperCase());
  return chart(moneyCtx, types, money, HEADINGS.MONEY);
};

const typeChart = (typeCtx, points) => {
  const summary =  Array.from(points.reduce((point, { type }) => point.set(type, (point.get(type) || 0) + 1), new Map)).sort((a, b) => b[1] - a[1]).slice();
  const types = summary.map((it) => it[0].toUpperCase());
  const repeats = summary.map((it) => it[1]);
  return chart(typeCtx, types, repeats, HEADINGS.TYPE);
};

const timeChart = (timeCtx, points) => {
  const summary =  Array.from(points.reduce((point, { type, dateFrom, dateTo }) => point.set(type, (point.get(type) || 0) + Math.abs(dayjs(dayjs(dateFrom).diff(dateTo)))), new Map)).sort((a, b) => b[1] - a[1]).slice();
  const types = summary.map((it) => it[0].toUpperCase());
  const time = summary.map((it) => it[1]);
  // console.log(time)
  // return chart(timeCtx, types, time, HEADINGS.TIMESPEND);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: time,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        // minBarLength: 50,
        // barThickness: 44,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${duration2(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },

        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },

        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatistics = () => `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>
          <div class="statistics__item">
            <canvas class="statistics__chart" id="money" width="900"></canvas>
          </div>
          <div class="statistics__item">
            <canvas class="statistics__chart" id="type" width="900"></canvas>
          </div>
          <div class="statistics__item">
            <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
          </div>
        </section>`;

export default class StatisticsView extends Smart {
  constructor(points) {
    super();
    this._points = points;
    this._renderMoneyChart = null;
    this._renderTypeChart = null;
    this._renderTimeChart = null;
    this._setCharts();
  }

  getTemplate() {
    return createStatistics(this._points);
  }

  _restoreHandlers() {
    this._setCharts();
  }

  _createTypes() {
    return [...new Set((this._points.map((point) => point.type.toUpperCase())))];
  }

  _setCharts() {
    this._createTypes();
    if(this._renderMoneyChart !== null || this._renderTypeChart !== null || this._renderTimeChart !== null) {
      this._renderMoneyChart = null;
      this._renderTypeChart = null;
      this._renderTimeChart = null;
    }
    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;
    const TYPES = [...new Set((this._points.slice().map((point) => point.type.toUpperCase())))];
    this._renderMoneyChart = moneyChart(moneyCtx, this._points, TYPES);
    this._renderTypeChart = typeChart(typeCtx, this._points, TYPES);
    this._renderTimeChart = timeChart(timeCtx, this._points, TYPES);
  }

}
