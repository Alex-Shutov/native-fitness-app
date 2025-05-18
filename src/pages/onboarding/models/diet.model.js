export const DIET_OPTIONS = [
  {
    id: 'regular',
    title: 'Обычная',
    subtitle: 'Любая еда',
    image: require('src/shared/assets/images/regular.png'), // Замените на фактический путь
    imageFocus: { x: 0.5, y: 0.55 },
    transformX:-100,
    transformY:-80,
  },
  {
    id: 'vegetarian',
    title: 'Вегетарианская',
    subtitle: 'Без мяса и рыбы',
    image: require('src/shared/assets/images/vegeterian.png'), // Замените на фактический путь
    imageFocus: { x: 0.25, y: 0.5 },
    transformX:-100,
    transformY:-80,
  },
  {
    id: 'lactose-free',
    title: 'Безмолочная',
    subtitle: 'Без молочных продуктов',
    image: require('src/shared/assets/images/no-milk.png'), // Замените на фактический путь
    imageFocus: { x: 0.25, y: 0.35 },
    transformX:-100,
    transformY:-80,
  }
];
