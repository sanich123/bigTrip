import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const differenceTime = (date1, date2) => Math.abs(dayjs(date1).diff(dayjs(date2), 'm'));

export const duration = (millisecs) => {
  const ONE_HOUR = 3600000;
  const ONE_DAY = 86400000;
  if (millisecs < ONE_HOUR) {
    const string = humanizeDate(millisecs, 'mm').toString();
    const finalDate = `${`${string[0] + string[1]  }M`}`;
    return finalDate;
  }
  if (millisecs >= ONE_HOUR && millisecs < ONE_DAY) {
    const string = humanizeDate(millisecs, 'HH mm').toString();
    const finalDate = `${`${string[0] + string[1]  }H ${  string[3] + string [4] }M`}`;
    return finalDate;
  }
  if (millisecs >= ONE_DAY) {
    const string = humanizeDate(millisecs, 'DD HH mm').toString();
    const finalDate = string[0] === '0'? `${`${string[1]  }D ${  string[3] + string [4] }H ${  string[6]  }${string[7]  }M`}` : `${`${string[0] + string[1]  }D ${  string[3] + string [4] }H ${  string[6]  }${string[7]  }M`}`;
    return finalDate;
  }
};
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
