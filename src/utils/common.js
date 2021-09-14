import dayjs from 'dayjs';

export const humanizeDate = (date, format) => dayjs(date).format(format);

// export const differenceTime = (date1, date2) => Math.abs(dayjs(date1).diff(dayjs(date2), 'm'));

export const isCityExist = (city, array) => {
  if (city && array.some((it) => it === city)) {
    return '';
  }
  return 'disabled';
};
