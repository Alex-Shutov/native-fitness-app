import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue, withDelay,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { ANIMATION } from "~/core/styles/theme";
import { useEffect } from "react";
import { View, StyleSheet } from 'react-native';

const ScreenTransition = ({
                            children,
                            style,
                            entering = true,
                            duration = ANIMATION.medium,
                            delay = 0,
                            onAnimationComplete,
                            type = 'slide-fade' // Options: 'fade', 'slide', 'slide-fade', 'scale'
                          }) => {
  const opacity = useSharedValue(entering ? 0 : 1);
  const translateX = useSharedValue(entering ? 100 : 0);
  const scale = useSharedValue(entering ? 0.9 : 1);

  useEffect(() => {
    const animationConfig = {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    if (entering) {
      // Entry animation
      if (type === 'fade' || type === 'slide-fade') {
        opacity.value = withDelay(delay, withTiming(1, animationConfig));
      }

      if (type === 'slide' || type === 'slide-fade') {
        translateX.value = withDelay(delay, withTiming(0, animationConfig, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }));
      }

      if (type === 'scale') {
        scale.value = withDelay(delay, withTiming(1, animationConfig, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }));
        opacity.value = withDelay(delay, withTiming(1, animationConfig));
      }
    } else {
      // Exit animation
      if (type === 'fade' || type === 'slide-fade') {
        opacity.value = withTiming(0, animationConfig);
      }

      if (type === 'slide' || type === 'slide-fade') {
        translateX.value = withTiming(-100, animationConfig, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        });
      }

      if (type === 'scale') {
        scale.value = withTiming(0.9, animationConfig, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        });
        opacity.value = withTiming(0, animationConfig);
      }
    }
  }, [entering, opacity, translateX, scale, delay, duration, type, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    const styles = {};

    if (type === 'fade' || type === 'slide-fade') {
      styles.opacity = opacity.value;
    }

    if (type === 'slide' || type === 'slide-fade') {
      styles.transform = [{ translateX: translateX.value }];
    }

    if (type === 'scale') {
      styles.transform = [{ scale: scale.value }];
      styles.opacity = opacity.value;
    }

    return styles;
  });

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenTransition;