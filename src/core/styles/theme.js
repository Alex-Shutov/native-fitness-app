export const COLORS = {
  primary: {
    // Основной зеленый цвет (светло-зеленый)
    light: '#A4D65E',
    // Основной зеленый цвет (средний)
    main: '#7AB648',
    // Основной зеленый цвет (темный)
    dark: '#81aa6b',
  },
  neutral: {
    // Почти черный цвет для фона
    darkest: '#121212',
    // Темно-серый цвет
    dark: '#252836',
    // Средне-серый цвет
    medium: '#9E9E9E',
    // Светло-серый цвет
    light: '#E0E0E0',
    // Белый цвет
    white: '#FFFFFF',
    // Светло-бежевый цвет фона
    offWhite: '#F5F5F0',
  },

  // Градиентные цвета
  gradient: {
    // Начальный цвет градиента (светло-зеленый)
    start: '#7DD44B',
    // Конечный цвет градиента (зеленовато-белый)
    end: '#E7EDE3',
  },

  // Функциональные цвета
  functional: {
    // Цвет для уведомлений об ошибках
    error: '#FF3B30',
    // Цвет для предупреждений
    warning: '#FF9500',
    // Цвет для успешных действий
    success: '#4CD964',
    // Цвет для информационных сообщений
    info: '#5AC8FA',
  },
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 64,
};

export const FONT_FAMILY = {
  text:{
    regular: 'Catamaran-Regular',
    medium: 'Catamaran-Medium',
    bold: 'Catamaran-Bold',
  },
  header: {
    regular: 'AlegreyaSansSC-Regular',
    medium: 'AlegreyaSansSC-Medium',
    bold: 'AlegreyaSansSC-Bold',
  },
  accent:{
    regular: 'Lobster-Regular',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  xxl: 48,
  full: 9999,
};

export const ANIMATION = {
  fast: 200,
  medium: 300,
  slow: 500,
};

export const theme = {
  colors: COLORS,
  fontSizes: FONT_SIZES,
  fontFamily: FONT_FAMILY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  animation: ANIMATION,
};

export default theme;
