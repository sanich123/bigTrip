import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  ' Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.',
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
  const maxDaysGap = 30;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return dayjs().add(daysGap, 'day').toDate();
  // .formate('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]');
};

console.log(generateDate());

const generateDestination = () => ({
  description: getRandomArrayLengthByNumber(1, descriptions, 5),
  name: getRandomArrayMember(cities),
  pictures: getRandomArrayLength(1, pictures),
});

const generateOffer = () => ({
  type: getRandomArrayMember(types),
  // city: getRandomArrayMember(cities),
  offers: getRandomArrayLength(0, options),
  // destination: generateDestination(),
});

const generatePoint = () => ({
  'base_price': getRandomInteger(1, 2309),
  'date_from': generateDate(),
  'date_to': generateDate(),
  destination: generateDestination(),
  'id': '0',
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: getRandomArrayLength(0, options),
  type: getRandomArrayMember(types),
});

const generateLocalPoint = () => ({
  'base_price': 222,
  'date_from': '2019-07-10T22:55:56.845Z',
  'date_to': '2019-07-11T11:22:13.375Z',
  destination: generateDestination(),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: getRandomArrayLength(0, options),
  type: getRandomArrayMember(types),
});

//Объект для домашнего задания
// const generatePointOfTrip = () => ({
//   type: getRandomArrayMember(types),
//   name: getRandomArrayMember(cities),
//   offers: getRandomArrayLength(0, options),
//   destination: generateDestination(),
// });
export { generateLocalPoint, generatePoint, generateOffer,generateDestination  };

