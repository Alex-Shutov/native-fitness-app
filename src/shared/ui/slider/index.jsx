import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING } from '~/core/styles/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedGestureHandler,
  runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const THUMB_WIDTH = 18;

const SliderInputV2 = ({
                         value,
                         onValueChange,
                         minimumValue = 0,
                         maximumValue = 100,
                         step = 1,
                       }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const thumbPosition = useSharedValue(0);
  const isSliding = useSharedValue(false);
  const [displayValue, setDisplayValue] = useState(value);
  // Инициализация позиции
  useEffect(() => {
    if (sliderWidth > 0) {
      const initialPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
      thumbPosition.value = initialPosition;
      setDisplayValue(value);
    }
  }, [sliderWidth, value]);

  const updateDisplayValue = (position) => {
    const newValue = Math.round(minimumValue + (position / sliderWidth) * (maximumValue - minimumValue));
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
    setDisplayValue(clampedValue); // Обновляем только отображаемое значение
    return clampedValue;
  };

  const updateValue = (position) => {
    const newValue = Math.round(minimumValue + (position / sliderWidth) * (maximumValue - minimumValue));
    const steppedValue = Math.max(minimumValue,Math.min(maximumValue,newValue))
    onValueChange(steppedValue);
    return steppedValue;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      isSliding.value = true;
    },
    onActive: (event) => {
      const newPosition = Math.max(0, Math.min(sliderWidth, event.absoluteX - 30)); // 30 - примерное смещение
      thumbPosition.value = newPosition;
      runOnJS(updateDisplayValue)(newPosition);
    },
    onEnd: (event) => {
      const finalPosition = Math.max(0, Math.min(sliderWidth, event.absoluteX - 30));
      const finalValue = Math.round(minimumValue + (finalPosition / sliderWidth) * (maximumValue - minimumValue));
      const clampedValue = Math.max(minimumValue, Math.min(maximumValue, finalValue));

      // Анимируем к финальной позиции
      const finalPos = ((clampedValue - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
      thumbPosition.value = withTiming(finalPos, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      }, () => {
        // После завершения анимации обновляем внешнее состояние
        runOnJS(onValueChange)(clampedValue);
      });

      // Обновляем отображаемое значение
      runOnJS(setDisplayValue)(clampedValue);
    },
  });

  const handleDecrease = () => {
    const newValue = Math.max(minimumValue, value - step);
    const newPosition = ((newValue - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
    thumbPosition.value = withTiming(newPosition, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    onValueChange(newValue);
    setDisplayValue(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(maximumValue, value + step);
    const newPosition = ((newValue - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
    thumbPosition.value = withTiming(newPosition, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    onValueChange(newValue);
    setDisplayValue(newValue);
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPosition.value - THUMB_WIDTH }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbPosition.value,
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={handleDecrease}
        disabled={value <= minimumValue}
      >
        <MaterialIcons
          name="chevron-left"
          size={24}
          color={value <= minimumValue ? COLORS.neutral.medium : COLORS.primary.main}
        />
      </TouchableOpacity>

      <View style={styles.sliderWrapper} onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}>
        <View style={styles.trackBackground}>
          <Animated.View style={[styles.trackFill, fillStyle]} />
        </View>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={styles.triangle} />
          </Animated.View>
        </PanGestureHandler>

        <Animated.View style={[styles.staticValue, thumbStyle]}>
          <Text style={styles.staticValueText}>{displayValue}</Text>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={styles.arrowButton}
        onPress={handleIncrease}
        disabled={value >= maximumValue}
      >
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={value >= maximumValue ? COLORS.neutral.medium : COLORS.primary.main}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  sliderWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
    position: 'relative',
  },
  trackBackground: {
    height: 8,
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.full,
    position: 'absolute',
    width: '100%',
  },
  trackFill: {
    height: '100%',
    // width: 220,
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.full,
  },
  thumb: {
    position: 'absolute',
    bottom: -4,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
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
    transform: [{ rotate: '180deg' }],
  },
  staticValue: {
    position: 'absolute',
    top: -2,
    minWidth: 30,
    alignItems: 'center',
  },
  staticValueText: {
    color: COLORS.primary.dark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrowButton: {
    // width: 40,
    // height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
  },
  hiddenSlider: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: 10,
  },
  hiddenThumb: {
    width: 40,
    height: 40,
  },
});

export default SliderInputV2;