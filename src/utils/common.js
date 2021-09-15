import dayjs from 'dayjs';

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const isCityExist = (city, array) => {
  if (city && array.some((it) => it === city)) {
    return '';
  }
  return 'disabled';
};
