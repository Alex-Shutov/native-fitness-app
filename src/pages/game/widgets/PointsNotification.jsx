import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import {Typo}from '~/shared/ui/typo';
import { MaterialIcons } from '@expo/vector-icons';

const PointsNotification = ({ points, visible, onAnimationEnd }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(-50);

  useEffect(() => {
    if (visible) {
      // Запускаем анимацию появления
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();

      // Запускаем анимацию исчезновения через некоторое время
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -50,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="star" size={24} color={COLORS.primary.main} />
      </View>
      <Typo variant="body1" weight="bold" style={styles.text}>
        + {points} баллов
      </Typo>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: COLORS.neutral.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginRight: SPACING.xs,
  },
  text: {
    color: COLORS.primary.main,
  },
});

export default PointsNotification;