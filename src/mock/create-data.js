import { nanoid } from 'nanoid';
import { getRandomInteger } from '../utils/common.js';
import { generateDate } from '../utils/common.js';

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const OPTIONS = [
  {
    type: 'taxi',
    offers: [
      {
        title: 'Upgrade to a business class',
        price: 120,
      },
      {
        title: 'Choose the radio station',
        price: 60,
      },
      {
        title: 'Choose meal',
        price: 180,
      },
    ],
  },
  {
    type: 'bus',
    offers: [
      {
        title: 'Побибикать у водителя',
        price: 120},
      {
        title: 'Укусить контролера',
        price: 120,
      },
    ],
  },
  {
    type: 'train',
    offers: [
      {
        title: 'Купить чаю',
        price: 120},
      {
        title: 'Понюхать носки сверхсрочника',
        price: 120,
      },
      {
        title: 'Распаковать курочку гриль',
        price: 120,
      },
    ],
  },
  {
    type: 'ship',
    offers: [
      {
        title: 'Бухать три недели',
        price: 120,
      },
      {
        title: 'Развлекаться на танцполе',
        price: 120,
      },
      {
        title: 'Одеть пижаму',
        price: 120,
      },
    ]},
  {  type: 'drive',
    offers: [
      {
        title: 'Поменять колесо',
        price: 120},
      {
        title: 'Долить незамерзайку',
        price: 120,
      },
      {
        title: 'Много рулить',
        price: 120,
      },
      {
        title: 'Пить кофе',
        price: 120,
      }]},
  {
    type: 'flight',
    offers: [
      {
        title: 'Укусить стюардессу',
        price: 120},
      {
        title: 'Долбанный ребенок',
        price: 120,
      },
      {
        title: 'Напукать в туалете',
        price: 120,
      },
      {
        title: 'Смачно есть',
        price: 120,
      }]},
  {
    type: 'check-in',
    offers: [
      {
        title: 'Просто бухать',
        price: 120},
      {
        title: 'Поспать',
        price: 120,
      },
      {
        title: 'Подождать таможню',
        price: 120,
      },
      {
        title: 'Надоело писать уже описания',
        price: 120,
      }]},
  {
    type: 'sightseeing',
    offers: [
      {
        title: 'Посмотреть красную площадь',
        price: 120},
      {
        title: 'Погулять по охотному ряду',
        price: 120,
      },
      {
        title: 'Кофеек в cofix',
        price: 120,
      },
      {
        title: 'Сходить на концерт',
        price: 120,
      },
    ],
  },
  {
    type: 'restaurant',
    offers: [
      {
        title: 'Хочу сибаса',
        price: 120},
      {
        title: 'Стейк омара за 80 тыс рублей',
        price: 120,
      },
      {
        title: 'Труа буте ди водка, авек плезир',
        price: 120,
      },
      {
        title: 'Оливье и майонеза побольше',
        price: 120,
      },
    ],
  },
];

const CITIES = [
  'Amsterdam',
  'Geneva',
  'Berlin',
  'Praga' ,
  'Brussel',
  'London',
  'Bratislava'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  ' Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ', 'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ', 'In rutrum ac purus sit amet tempus. ',
];

const getRandomArrayMember = (arr) => (arr[getRandomInteger(0, arr.length - 1)]);

const PICTURES = [
  {
    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS)},
  {    src: `http://picsum.photos/300/200?r=${Math.random(1, 12)}`,
    description: getRandomArrayMember(DESCRIPTIONS),
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

export const generateDestination = () => ({
  description: getRandomArrayLengthByNumber(0, DESCRIPTIONS, 5),
  name: getRandomArrayMember(CITIES),
  pictures: getRandomArrayLength(1, PICTURES),
});


export const getOffersByType = (arr, tip) => {
  let result;
  arr.forEach((it) => {
    if (it.type === tip) {
      result = it.offers;
      return result;
    }
  });
  return result;
};

const generatePoint = () => {
  const randomType = getRandomArrayMember(TYPES);
  return {
    basePrice: getRandomInteger(1, 2309),
    dateFrom: generateDate(),
    dateTo: generateDate(),
    destination: generateDestination(),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: randomType,
    offers: getOffersByType(OPTIONS, randomType),
  };};

export { generatePoint, TYPES, CITIES };
