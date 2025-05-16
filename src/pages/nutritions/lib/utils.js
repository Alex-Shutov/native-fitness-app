export const getMealTypeById = (mealTypeId) => {
  return MEAL_TYPES.find(type => type.id === mealTypeId);
};

export const MEAL_TYPES = [
  {
    id: 'breakfast',
    title: 'Завтраки',
    image: require('~/shared/assets/images/breakfast.png'),
    description: 'Лёгкие и питательные завтраки для отличного начала дня'
  },
  {
    id: 'snack',
    title: 'Перекусы',
    image: require('~/shared/assets/images/snack.png'),
    description: 'Быстрые и полезные перекусы между основными приемами пищи'
  },
  {
    id: 'lunch',
    title: 'Обеды',
    image: require('~/shared/assets/images/lunch.png'),
    description: 'Питательные обеды для поддержания энергии в течение дня'
  },
  {
    id: 'dinner',
    title: 'Ужины',
    image: require('~/shared/assets/images/dinner.png'),
    description: 'Лёгкие вечерние блюда для хорошего сна'
  },
];

export const MEAL_RECIPES = {
  'breakfast-1-regular': {
    id: 'breakfast-1-regular',
    title: 'Овсяноблин с сыром',
    image: require('~/shared/assets/images/breakfast-1-regular.png'),
    ingredients: [
      { name: 'Геркулес', amount: '50г. в сухом виде' },
      { name: 'Яйцо', amount: '1 шт.' },
      { name: 'Немного воды', amount: '' },
      { name: 'Соль, сахар', amount: 'по вкусу' },
      { name: 'Сыр легкий', amount: '30 г.' },
    ],
    preparationSteps: [
      'Заливаем геркулес водой, даем ему впитать воду и тут же лишнюю жидкость сливаем.',
      'Добавляем яйцо, соль по вкусу и выливаем на горячую сковородку.',
      'Выравниваем овсяноблин по всей поверхности, для удобства можно лопаткой разрезать пополам. Так легче переворачивать.',
      'Через пару минут переворачиваем.',
      'Поджариваем пару минут, затем на одну половинку кладем сыр и накрываем другой половиной. Еще минута и все готово!',
    ],
    type: 'breakfast',
    day: 1,
    nutritionPlanId: 'regular',
  },
  'breakfast-2-regular': {
    id: 'breakfast-2-regular',
    title: 'Овсянка с фруктами',
    image: require('~/shared/assets/images/breakfast-1-regular.png'),
    ingredients: [
      { name: 'Овсяные хлопья', amount: '50г.' },
      { name: 'Молоко', amount: '200 мл' },
      { name: 'Мед', amount: '1 ч.л.' },
      { name: 'Фрукты', amount: 'по вкусу' },
      { name: 'Орехи', amount: '15 г.' },
    ],
    preparationSteps: [
      'Залить овсяные хлопья молоком и оставить на 10 минут.',
      'Добавить мед и перемешать.',
      'Украсить фруктами и орехами.',
    ],
    type: 'breakfast',
    day: 2,
    nutritionPlanId: 'regular',
  },
  'lunch-1-regular': {
    id: 'lunch-1-regular',
    title: 'Куриная грудка с овощами',
    image: require('~/shared/assets/images/breakfast-1-regular.png'),
    ingredients: [
      { name: 'Куриная грудка', amount: '150 г.' },
      { name: 'Брокколи', amount: '100 г.' },
      { name: 'Морковь', amount: '1 шт.' },
      { name: 'Оливковое масло', amount: '1 ст.л.' },
      { name: 'Соль, перец', amount: 'по вкусу' },
    ],
    preparationSteps: [
      'Нарезать куриную грудку на кусочки.',
      'Обжарить на оливковом масле до готовности.',
      'Добавить нарезанные овощи и тушить 5-7 минут.',
      'Приправить солью и перцем по вкусу.',
    ],
    type: 'lunch',
    day: 1,
    nutritionPlanId: 'regular',
  },
  'dinner-1-regular': {
    id: 'dinner-1-regular',
    title: 'Запеченная рыба с овощами',
    image: require('~/shared/assets/images/breakfast-1-regular.png'),
    ingredients: [
      { name: 'Филе рыбы', amount: '150 г.' },
      { name: 'Помидоры', amount: '1 шт.' },
      { name: 'Лук', amount: '1/2 шт.' },
      { name: 'Лимон', amount: '1/2 шт.' },
      { name: 'Оливковое масло', amount: '1 ст.л.' },
      { name: 'Соль, перец, зелень', amount: 'по вкусу' },
    ],
    preparationSteps: [
      'Филе рыбы выложить на фольгу.',
      'Сверху выложить нарезанные овощи.',
      'Сбрызнуть лимонным соком и оливковым маслом.',
      'Приправить солью, перцем и зеленью.',
      'Завернуть в фольгу и запекать при 180°C 15-20 минут.',
    ],
    type: 'dinner',
    day: 1,
    nutritionPlanId: 'regular',
  },
  'breakfast-1-vegetarian': {
    id: 'breakfast-1-vegetarian',
    title: 'Тофу-скрэмбл',
    image: require('~/shared/assets/images/breakfast-1-regular.png'),
    ingredients: [
      { name: 'Тофу', amount: '150 г.' },
      { name: 'Куркума', amount: '1/2 ч.л.' },
      { name: 'Чеснок', amount: '1 зубчик' },
      { name: 'Шпинат', amount: 'горсть' },
      { name: 'Оливковое масло', amount: '1 ст.л.' },
      { name: 'Соль, перец', amount: 'по вкусу' },
    ],
    preparationSteps: [
      'Раскрошить тофу руками на сковороду.',
      'Добавить измельченный чеснок и куркуму, обжарить на оливковом масле.',
      'Добавить шпинат и тушить до готовности.',
      'Приправить солью и перцем по вкусу.',
    ],
    type: 'breakfast',
    day: 1,
    nutritionPlanId: 'vegetarian',
  },
  'breakfast-1-lactose-free': {
    id: 'breakfast-1-lactose-free',
    title: 'Каша из киноа с кокосовым молоком',
    image: require('~/shared/assets/images/breakfast-1-regular.png'),
    ingredients: [
      { name: 'Киноа', amount: '50 г.' },
      { name: 'Кокосовое молоко', amount: '200 мл' },
      { name: 'Бананы', amount: '1/2 шт.' },
      { name: 'Корица', amount: 'по вкусу' },
      { name: 'Мед', amount: '1 ч.л.' },
    ],
    preparationSteps: [
      'Промыть киноа под проточной водой.',
      'Варить в кокосовом молоке 15 минут до готовности.',
      'Добавить нарезанный банан, корицу и мед.',
      'Перемешать и подавать.',
    ],
    type: 'breakfast',
    day: 1,
    nutritionPlanId: 'lactose-free',
  },
};

// Получить все дни для плана
export const getPlanDays = (planId) => {
  // Находим все уникальные дни для конкретного плана
  const days = Object.values(MEAL_RECIPES)
    .filter(meal => meal.nutritionPlanId === planId)
    .map(meal => meal.day);

  // Удаляем дубликаты и сортируем
  return [...new Set(days)].sort((a, b) => a - b);
};

export const getDayMeals = (planId, day) => {
  // Возвращает все приемы пищи для определенного дня и плана
  return Object.values(MEAL_RECIPES).filter(
    meal => meal.nutritionPlanId === planId && meal.day === day
  );
};