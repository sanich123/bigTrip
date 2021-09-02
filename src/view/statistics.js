import Smart from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { duration } from '../utils/common.js';
import dayjs from 'dayjs';

const moneyChart = (moneyCtx, points) => {
  const set =  Array.from(points.reduce(
    (point, { type, basePrice }) => point.set(type, (point.get(type) || 0) + basePrice), new Map));
  const types = set.slice().map((it) => it[0].toUpperCase());
  const money = set.slice().map((it) => it[1]);
  const chart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: money,
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
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
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
  return chart;
};

const typeChart = (typeCtx, points) => {
  const set =  Array.from(points.reduce(
    (point, { type }) => point.set(type, (point.get(type) || 0) + 1), new Map));
  const types = set.slice().map((it) => it[0].toUpperCase());
  const repeats = set.slice().map((it) => it[1]);

  const chart = new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: repeats,
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
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
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
            // margin: 15,
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
  return chart;
};

const timeChart = (timeCtx, points) => {
  const set =  Array.from(points.reduce(
    (point, { type, dateFrom, dateTo }) => point.set(type, (point.get(type) || 0) + Math.abs(dayjs(dateFrom).diff(dateTo))), new Map));

  const types = set.slice().map((it) => it[0].toUpperCase());
  const time = set.slice().map((it) => it[1]);
  const chart = new Chart(timeCtx, {
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
          formatter: (val) => `${duration(val)}`,
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
            // margin: 15,
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
  return chart;
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

  _setCharts() {
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

    this._renderMoneyChart = moneyChart(moneyCtx, this._points);
    this._renderTypeChart = typeChart(typeCtx, this._points);
    this._renderTimeChart = timeChart(timeCtx, this._points);
  }

}
