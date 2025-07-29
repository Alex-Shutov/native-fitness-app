module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated plugin должен быть последним (важно!)
      [
        'react-native-reanimated/plugin',
        {
          relativeSourceLocation: true, // для лучшей отладки
        }
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '~': './src',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // добавляем поддержку расширений
        },
      ],
    ],
    env: {
      production: {
        plugins: [
          'transform-remove-console', // удаляем console.log в production
        ],
      },
    },
  };
};