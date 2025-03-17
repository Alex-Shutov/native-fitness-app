import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

import Theme from '../../../core/styles/theme';
import Fog from '~/shared/ui/other/fog';

const { width, height } = Dimensions.get('window');

const GradientBackground = ({
                              children,
                              style,
                              colors = [Theme.colors.gradient.start, Theme.colors.gradient.end],
                              padding = 50, // Отступ для синусоид
                            }) => {
  const generateSinePath = () => {
    // Параметры синусоиды
    const amplitude = width * 0.05; // Амплитуда волны
    const periods = 3.2; // Количество полных периодов волны
    const frequency = (Math.PI * 2 * periods) / height; // Частота волны
    const steps = 100; // Количество точек для плавной кривой

    let path = `M0,0`; // Начинаем путь с верхнего левого угла

    // Генерируем левую синусоиду с отступом
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * height;
      const x = padding + amplitude * Math.sin(frequency * y); // Отступ слева
      path += ` L${x},${y}`;
    }

    // Генерируем правую синусоиду с отступом
    for (let i = steps; i >= 0; i--) {
      const y = (i / steps) * height;
      const x = width - padding + (amplitude) * Math.sin(frequency * y); // Отступ справа
      path += ` L${x},${y}`;
    }

    // Замыкаем путь
    path += ' Z';
    return path;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.backgroundBase}>
        <Svg width={width} height={height} style={styles.svg}>
          <Defs>
            {/* Основной градиент */}
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors[0]} />
              <Stop offset="100%" stopColor={colors[1]} />
            </LinearGradient>

            {/* Градиент для "дымки" снизу (от белого до прозрачного) */}
            <LinearGradient id="fog" x1="0%" y1="100%" x2="0%" y2="70%">
              <Stop offset="0%" stopColor="white" stopOpacity="1" />
              <Stop offset="100%" stopColor="white" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Центральная область с градиентом */}
          <Path d={generateSinePath()} fill="url(#grad)" />

          {/* Дымка снизу */}
        <Fog/>
        </Svg>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  backgroundBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.neutral.offWhite
  },
  waves: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  svg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    zIndex: 2
  },
});

export default GradientBackground;