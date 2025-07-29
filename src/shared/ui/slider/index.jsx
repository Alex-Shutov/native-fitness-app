import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-assets/slider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS, SPACING } from '~/core/styles/theme';
import { MaterialIcons } from '@expo/vector-icons';

const AnimatedSlider = Animated.createAnimatedComponent(Slider);
const THUMB_WIDTH = 18
const SliderInputV2 = ({
                         value,
                         onValueChange,
                         minimumValue = 0,
                         maximumValue = 100,
                         step = 1,
                       }) => {
  const [sliderValue, setSliderValue] = useState(value);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const thumbPosition = useSharedValue(
    ((value - minimumValue) / (maximumValue - minimumValue)) * 300 // 300 - примерная начальная ширина
  );
  const sliderWidth = useSharedValue(0);

  // Инициализация и обновление при изменении пропсов
  useEffect(() => {
    setSliderValue(value);
    if (isLayoutReady) {
      updateThumbPosition(value);
    }
  }, [value, isLayoutReady]);

  const updateThumbPosition = (val) => {
    if (sliderWidth.value === 0) return;

    const position = ((val - minimumValue) / (maximumValue - minimumValue)) * sliderWidth.value;
    thumbPosition.value = withTiming(position, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleValueChange = (val) => {
    const steppedValue = step > 1 ? Math.round(val / step) * step : val;
    setSliderValue(steppedValue);
    updateThumbPosition(steppedValue);
    onValueChange(steppedValue);
  };

  const handleDecrease = () => {
    const newValue = Math.max(minimumValue, sliderValue - step);
    handleValueChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(maximumValue, sliderValue + step);
    handleValueChange(newValue);
  };

  const handleLayout = (event) => {
    const newWidth = event.nativeEvent.layout.width;
    if (sliderWidth.value !== newWidth) {
      sliderWidth.value = newWidth;
      setIsLayoutReady(true);

      // Пересчитываем позицию при первом измерении ширины
      const newPosition = ((sliderValue - minimumValue) / (maximumValue - minimumValue)) * newWidth;
      thumbPosition.value = newPosition;
    }
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
        disabled={sliderValue <= minimumValue}
      >
        <MaterialIcons
          name="chevron-left"
          size={24}
          color={sliderValue <= minimumValue ? COLORS.neutral.medium : COLORS.primary.main}
        />
      </TouchableOpacity>

      <View
        style={styles.sliderWrapper}
        onLayout={handleLayout}
      >
        <View style={styles.trackBackground}>
          <Animated.View style={[styles.trackFill, fillStyle]} />
        </View>

        <Animated.View style={[styles.thumb, thumbStyle]}>
          <View style={styles.triangle} />
        </Animated.View>

        <Animated.View style={[styles.staticValue, thumbStyle]}>
          <Text style={styles.staticValueText}>{sliderValue}</Text>
        </Animated.View>

        <Slider
          style={styles.hiddenSlider}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          value={sliderValue}
          onValueChange={handleValueChange}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="transparent"
          thumbStyle={styles.hiddenThumb}
        />
      </View>

      <TouchableOpacity
        style={styles.arrowButton}
        onPress={handleIncrease}
        disabled={sliderValue >= maximumValue}
      >
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={sliderValue >= maximumValue ? COLORS.neutral.medium : COLORS.primary.main}
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