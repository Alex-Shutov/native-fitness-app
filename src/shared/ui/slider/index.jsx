import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS, SPACING } from '~/core/styles/theme';

const SliderInputV2 = ({
                         value,
                         onValueChange,
                         minimumValue = 0,
                         maximumValue = 100,
                         step = 1,
                       }) => {
  const sliderWidth = useSharedValue(0);
  const thumbPosition = useSharedValue(0);
  const isSliding = useSharedValue(false);
  const currentValue = useSharedValue(value);

  // Инициализация позиции
  useEffect(() => {
    const initialPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth.value;
    thumbPosition.value = initialPosition;
    currentValue.value = value;
  }, [value, sliderWidth.value]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      isSliding.value = true;
      ctx.startX = thumbPosition.value;
    },
    onActive: (event, ctx) => {
      // Новая позиция с ограничениями
      let newPosition = ctx.startX + event.translationX;
      newPosition = Math.max(0, Math.min(newPosition, sliderWidth.value));

      // Расчет нового значения
      const newValue = Math.round(
        minimumValue +
        (newPosition / sliderWidth.value) * (maximumValue - minimumValue)
      );

      // Применение шага
      const steppedValue = step > 1
        ? Math.round(newValue / step) * step
        : newValue;

      // Обновление позиции с учетом шага
      const steppedPosition = ((steppedValue - minimumValue) / (maximumValue - minimumValue)) * sliderWidth.value;

      thumbPosition.value = steppedPosition;
      currentValue.value = steppedValue;
      runOnJS(onValueChange)(steppedValue);
    },
    onEnd: () => {
      isSliding.value = false;
    },
  });

  // Стили для анимированных элементов
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPosition.value },{rotate: '180deg' }],

  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbPosition.value,
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isSliding.value ? 1 : 0),
    transform: [
      { translateX: thumbPosition.value - 20 },
      { translateY: -35 },
      { scale: withSpring(isSliding.value ? 1.2 : 1) }
    ],
  }));

  const staticValueStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPosition.value - 15 }],
  }));

  return (
    <View style={styles.container}>
      {/* Фон слайдера */}
      <View
        style={styles.trackBackground}
        onLayout={(event) => {
          sliderWidth.value = event.nativeEvent.layout.width;
          // Обновляем позицию при изменении ширины
          thumbPosition.value = ((value - minimumValue) / (maximumValue - minimumValue)) * event.nativeEvent.layout.width;
        }}
      >
        {/* Активная часть слайдера */}
        <Animated.View style={[styles.trackFill, fillStyle]} />
      </View>

      {/* Ползунок */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          {/* Всплывающее значение при перемещении */}
          {/*<Animated.View style={[styles.valueBubble, bubbleStyle]}>*/}
          {/*  <Text style={styles.bubbleText}>{currentValue.value}</Text>*/}
          {/*</Animated.View>*/}
        </Animated.View>

      {/* Статическое значение */}
      <Animated.View style={[styles.staticValue, staticValueStyle]}>
        <Text style={styles.staticValueText}>{currentValue.value}</Text>
      </Animated.View>
        </Animated.View>
      </PanGestureHandler>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    justifyContent: 'center',
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  trackBackground: {
    height: 6,
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.full,
    position: 'relative',
  },
  trackFill: {
    height: '100%',
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.full,
    position: 'absolute',
  },
  thumb: {
    position: 'absolute',
    bottom: -16,
    marginLeft: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary.main,
  },
  valueBubble: {
    position: 'absolute',
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    color: COLORS.neutral.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  staticValue: {
    position: 'absolute',
    top: -28,
    // backgroundColor: COLORS.primary.light,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
  },
  staticValueText: {
    color: COLORS.primary.dark,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SliderInputV2;