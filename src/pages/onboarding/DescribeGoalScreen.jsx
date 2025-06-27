import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';

import { COLORS, SPACING } from '~/core/styles/theme';
import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import Button from '~/shared/ui/button';
import ScrollableTextInput from '~/shared/ui/input/textInput';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';

const DescribeGoalScreen = () => {
  const navigation = useNavigation();
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const [description, setDescription] = useState('');
  const primaryGoal = onboarding.primaryGoal;

  const handleContinue = () => {
    // Update the goal descriptions in the onboarding state
    setOnboarding((prev) => ({
      ...prev,
      goalDescription: description.trim(),
      currentStep: prev.currentStep + 1,
    }));
    navigation.navigate('ProgressScreen')
  };

  return (
    // <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
    <ScreenTransition>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Опиши свою цель
            </Typo>
            <Typo variant="body1" style={styles.subtitle}>
              Что это для тебя на 10 из 10
            </Typo>
          </View>
          <ScrollableTextInput
            label={`${primaryGoal.value} для меня это...`}
            placeholder="Расскажи подробнее..."
            value={description}
            onChangeText={setDescription}
            style={styles.textInput}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Иду к цели"
              // variant="primary"
              style={styles.button}
              loading={false}
              onPress={handleContinue}
              disabled={!description}
            />
          </View>
        </View>
      </ScreenBackground>
    </ScreenTransition>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  header: {
    fontSize: SPACING.xl*1.4,
    lineHeight: SPACING.xl*1.4,
  },
  button: {
    width: '70%',
    alignSelf: 'center',
  },

  subtitle: {
    color: COLORS.neutral.dark,
  },
  textInput: {
    flex: 1,
    marginBottom: SPACING.xl,
  },

  buttonContainer: {
    marginTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
});

export default DescribeGoalScreen;
