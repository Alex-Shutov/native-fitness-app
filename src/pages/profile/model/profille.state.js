import { atom } from 'recoil';

export const profileState = atom({
  key: 'profileState',
  default: {
    name: 'Ника Берестова',
    image: require('~/shared/assets/images/profile.png'), // Assuming this exists
    currentWeight: '53',
    targetWeight: '50',
    goal: 'Карьера',
    age: '46',
    gender: 'Женский',
    height: '102',
    phone: '+7 (919) 906 00-77',
    email: 'nika_ber@mail.ru',
  },
});