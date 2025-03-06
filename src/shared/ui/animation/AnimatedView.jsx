import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import Theme from '../../../core/styles/theme';

const AnimatedView = ({
  children,
  style,
  animation = 'fade',
  duration = Theme.animation.medium,
  delay = 0,
  autoPlay = true,
  ...props
}) => {
  const opacity = useSharedValue(autoPlay ? 0 : 1);
  const scale = useSharedValue(autoPlay ? 0.8 : 1);
  const translateY = useSharedValue(autoPlay ? 50 : 0);

  useEffect(() => {
    if (autoPlay) {
      opacity.value = withDelay(delay, withTiming(1, { duration }));

      if (animation === 'scale' || animation === 'custom') {
        scale.value = withDelay(delay, withTiming(1, { duration }));
      }

      if (animation === 'slide' || animation === 'custom') {
        translateY.value = withDelay(delay, withTiming(0, { duration }));
      }
    }
  }, [animation, duration, delay, autoPlay, opacity, scale, translateY]);

  const fadeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const scaleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const getEnteringAnimation = () => {
    switch (animation) {
      case 'fade':
        return FadeIn.duration(duration).delay(delay);
      case 'slide':
        return SlideInDown.duration(duration).delay(delay);
      default:
        return FadeIn.duration(duration).delay(delay);
    }
  };

  const getExitingAnimation = () => {
    switch (animation) {
      case 'fade':
        return FadeOut.duration(duration);
      case 'slide':
        return SlideOutDown.duration(duration);
      default:
        return FadeOut.duration(duration);
    }
  };

  if (animation === 'custom') {
    return (
      <Animated.View
        style={[styles.container, fadeAnimatedStyle, scaleAnimatedStyle, slideAnimatedStyle, style]}
        {...props}>
        {children}
      </Animated.View>
    );
  }
  return (
    <Animated.View
      entering={getEnteringAnimation()}
      exiting={getExitingAnimation()}
      style={[styles.container, style]}
      {...props}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
export default AnimatedView;
