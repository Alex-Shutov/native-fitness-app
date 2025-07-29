import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import DescriptionSection from './widgets/DescriptionSection';
import LogoSection from './widgets/LogoSection';
import Container from '../../shared/ui/layout/Container';
import GradientBackground from '../../shared/ui/layout/GradientBackground';

import { COLORS, SPACING, ANIMATION } from '~/core/styles/theme';
import Button from '~/shared/ui/button';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { useFonts } from '../../core/hooks/useFonts';
import { Typo } from '../../shared/ui/typo/typo';
import VideoScreen from '../onboarding/VideoScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FADE_IN_DURATION = ANIMATION.medium; // 300мс для плавного появления
const STAGGER_DELAY = ANIMATION.fast; // 200мс для последовательной анимации элементов

const WelcomeScreen = () => {
  const navigation = useNavigation();
  useFonts()
  const logoScale = useSharedValue(1);
  const [showVideo, setShowVideo] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(true);

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

  const [exiting, setExiting] = useState(false);

  const handleGetStarted = () => {
    setExiting(true);
    // Delay navigation to allow for exit animation
    setTimeout(() => {
      navigation.navigate('Start');
      // Reset state for when we return to this screen
      setTimeout(() => setExiting(false), 50);
    }, ANIMATION.medium);
  };
  React.useEffect(() => {
    const checkVideoStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@has_watched_intro_video');
        setHasWatchedVideo(value === 'true');
      } catch (e) {
        console.error('Error reading video status:', e);
      }
    };
    checkVideoStatus();
  }, []);

  const handleAboutApp = () => {
    setShowVideo(true);
  };

  const handleVideoComplete = () => {
    setShowVideo(false);
  };

  if (showVideo) {
    return <VideoScreen skippable={true} onComplete={handleVideoComplete} />;
  }

  return (
    <ScreenTransition>


      <GradientBackground>
        <Container type="centered" safeArea>
          <LogoSection duration={FADE_IN_DURATION} logoStyle={logoAnimatedStyle} />
          <DescriptionSection hasWatchedVideo={hasWatchedVideo} handleAboutApp={handleAboutApp} duration={FADE_IN_DURATION} delay={STAGGER_DELAY} />

          <Button loading={false} title="Хочу стройнеть" onPress={handleGetStarted} />
          <View style={{ flex: 0.2 }} />
        </Container>
      </GradientBackground>
    </ScreenTransition>
  );
};

export default WelcomeScreen;
