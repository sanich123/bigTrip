import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/utils.js';

const types = ['taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'];

const cities = ['Amsterdam',
  'Geneva',
  'Berlin',
  'Praga',
  'Brussel',
  'London',
  'Bratislava'];

const options = [
  {
    'title': 'Upgrade to a business class',
    'price': 120,
  }, {
    'title': 'Choose the radio station',
    'price': 60,
  }, {
    'title': 'Choose meal',
    'price': 180,
  }, {
    'title': 'Upgrade to comfort class',
    'price': 50,
  }, {
    'title': 'Upgrade to comfort class',
    'price': 50,
  },
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  ' Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ', 'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ', 'In rutrum ac purus sit amet tempus. ',
];

const getRandomArrayMember = (arr) => (arr[getRandomInteger(0, arr.length - 1)]);

const pictures = [
  {
    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(descriptions),
  },
];

const getRandomArrayLengthByNumber = (min, arr, max) => {
  const newLength = getRandomInteger(min, max);
  return arr.slice(newLength);
};

const getRandomArrayLength = (min, arr) => {
  const newLength = getRandomInteger(min, arr.length);
  return arr.slice(newLength);
};

const generateDate = () => {
  const maxDaysGap = 7000;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return dayjs().add(daysGap, 'm').toDate();
};


const generateDestination = () => ({
  description: getRandomArrayLengthByNumber(1, descriptions, 5),
  name: getRandomArrayMember(cities),
  pictures: getRandomArrayLength(1, pictures),
});

const generatePoint = () => ({
  basePrice: getRandomInteger(1, 2309),
  dateFrom: generateDate(),
  dateTo: generateDate(),
  destination: generateDestination(),
  id: getRandomInteger(0, 15),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: getRandomArrayLength(0, options),
  type: getRandomArrayMember(types),
});

export { generatePoint };

