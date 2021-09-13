import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const differenceTime = (date1, date2) => Math.abs(dayjs(date1).diff(dayjs(date2), 'm'));

export const generateDate = () => {
  const maxDaysGap = 7000;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return dayjs().add(daysGap, 'm').toDate();
};

export const isCityExist = (city, array) => {
  if (city && array.some((it) => it === city)) {
    return '';
  }
  return 'disabled';
};

export const checkPrice = (price) => Math.abs(price);
