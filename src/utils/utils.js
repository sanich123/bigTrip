import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeDate = (date, format) => {
  const humanizedDate = dayjs(date).format(format);
  return humanizedDate;
};

export const differenceTime = (date1, date2) => {
  const millisecs = Math.abs(dayjs(date1).diff(dayjs(date2)));
  return millisecs;
};


