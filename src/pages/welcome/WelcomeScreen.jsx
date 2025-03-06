import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import AdvantagesView from './ui/AdvantagesView';
import DescriptionSection from './ui/DescriptionSection';
import LogoSection from './ui/LogoSection';
import { COLORS, SPACING, ANIMATION } from '../../core/styles/theme';
import AnimatedView from '../../shared/ui/animation/AnimatedView';
import Container from '../../shared/ui/layout/Container';
import GradientBackground from '../../shared/ui/layout/GradientBackground';
import Logo from '../../shared/ui/logo';
import Typo from '../../shared/ui/typo';

import Button from '~/shared/ui/button';

const FADE_IN_DURATION = ANIMATION.medium; // 300мс для плавного появления
const STAGGER_DELAY = ANIMATION.fast; // 200мс для последовательной анимации элементов

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const logoScale = useSharedValue(1);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });
  useEffect(() => {
    // Функция для создания пульсирующей анимации
    const pulseAnimation = () => {
      // Анимация увеличения
      logoScale.value = withTiming(1.05, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });

      // Таймаут для анимации уменьшения
      setTimeout(() => {
        logoScale.value = withTiming(1, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        });
      }, 1000);
    };

    pulseAnimation();

    const interval = setInterval(pulseAnimation, 2000);

    return () => clearInterval(interval);
  }, [logoScale]);

  const handleGetStarted = () => {
    navigation.navigate('StartScreen');
  };

  return (
    <GradientBackground>
      <Container type="centered" safeArea>
        <LogoSection duration={FADE_IN_DURATION} logoStyle={logoAnimatedStyle} />
        <DescriptionSection duration={FADE_IN_DURATION} delay={STAGGER_DELAY} />
        <Button loading={false} title="Хочу стройнеть!" />
        <View style={{ flex: 0.2 }} />

      </Container>
    </GradientBackground>
  );
};

export default WelcomeScreen;
