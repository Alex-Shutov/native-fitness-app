import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View,StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import AdvantagesView from '../welcome/ui/AdvantagesView';
import DescriptionSection from '../welcome/ui/DescriptionSection';
import LogoSection from '../welcome/ui/LogoSection';
import { COLORS, SPACING, ANIMATION } from '../../core/styles/theme';
import AnimatedView from '../../shared/ui/animation/AnimatedView';
import Container from '../../shared/ui/layout/Container';
import GradientBackground from '../../shared/ui/layout/GradientBackground';
import Logo from '../../shared/ui/logo';
import Typo from '../../shared/ui/typo';

import Button from '~/shared/ui/button';
import ScreenTransition from "~/shared/ui/layout/ScreenTransition";
import StartInfo from "~/pages/welcome/ui/StartInfo";

const FADE_IN_DURATION = ANIMATION.medium; // 300мс для плавного появления
const STAGGER_DELAY = ANIMATION.fast; // 200мс для последовательной анимации элементов

const StartScreen = () => {
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

  const handleBack = () => {
    navigation.navigate('Welcome');
  };

  return (
    <ScreenTransition>
      <GradientBackground>
        <Container type="centered" safeArea>
          <View style={styles.logoContainer}>
            <LogoSection duration={FADE_IN_DURATION} logoStyle={logoAnimatedStyle} />
          </View>
          <View style={styles.container}>
            <StartInfo />
          </View>
          {/*<AnimatedView animation="custom" duration={FADE_IN_DURATION}>*/}
          {/*  <LogoSection duration={FADE_IN_DURATION} logoStyle={logoAnimatedStyle} />*/}
          {/*</AnimatedView>*/}

          {/*<AnimatedView animation="custom" duration={FADE_IN_DURATION} delay={STAGGER_DELAY}>*/}
          {/*  <DescriptionSection duration={FADE_IN_DURATION} delay={STAGGER_DELAY} />*/}
          {/*</AnimatedView>*/}

          {/*<AnimatedView animation="slide" duration={FADE_IN_DURATION} delay={STAGGER_DELAY * 2}>*/}
          {/*  <Button loading={false} title="Вернуться назад" onPress={handleBack} />*/}
          {/*</AnimatedView>*/}
          <Button loading={false} title="Начать!" />

          <View style={{ flex: 0.2 }} />
        </Container>
      </GradientBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:SPACING.xxl
  },
  logoContainer: {
    flex:4
  }
})

export default StartScreen;