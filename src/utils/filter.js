import { FilterType } from '../utils/constants.js';
import dayjs from 'dayjs';

export const getFutureDate = (dateFrom) => dayjs(dateFrom) >= dayjs();
export const getPastDate = (dateTo) => dayjs(dateTo) <= dayjs();

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => getFutureDate(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => getPastDate(point.dateTo)),
};
