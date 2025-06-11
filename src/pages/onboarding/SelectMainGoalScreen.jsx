import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';

import { COLORS, SPACING } from '~/core/styles/theme';
import { goalsData } from '~/pages/onboarding/models/goals.mock';
import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import PrimaryGoalGrid from '~/pages/onboarding/widgets/PrimaryGoalGrid';
import Button from '~/shared/ui/button';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import { useGoals } from '~/pages/onboarding/lib/useGoals';
import LoadingOrError from '~/shared/ui/layout/LoadingOrError';

const SelectPrimaryGoalScreen = () => {
  const navigation = useNavigation();
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const [selectedGoal, setSelectedGoal] = useState(onboarding.primaryGoal);
  const {goals,loading,error} = useGoals()
  const primGoals = goals.filter((goal) => onboarding.selectedGoals.includes(goal.id));

  useEffect(() => {
    setOnboarding((prev) => ({
      ...prev,
      primaryGoal: selectedGoal,
    }));
  }, [selectedGoal, setOnboarding]);

  const handleGoalsChange = (newSelectedGoal) => {
    setSelectedGoal(primGoals.find((goal) => goal.id === newSelectedGoal));
  };

  const handleContinue = () => {
    if (selectedGoal) {
      setOnboarding((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
      navigation.navigate('DescribeGoalScreen');
    }
  };
  return (
    <LoadingOrError loading={loading} error={error}>
    <ScreenTransition>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Выбери свою окончательную цель
            </Typo>
            <Typo variant="body1" style={styles.subtitle}>
              Выбери не больше одной цели
            </Typo>
          </View>
        </View>
        <PrimaryGoalGrid
          goals={primGoals}
          selectedGoal={selectedGoal?.id}
          onToggleGoal={handleGoalsChange}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Иду к цели"
            // variant="primary"
            style={styles.button}
            loading={false}
            onPress={handleContinue}
            disabled={!selectedGoal}
          />
        </View>
      </ScreenBackground>
    </ScreenTransition>
    </LoadingOrError>
  );
};

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  header: {
    fontSize: SPACING.xl,
  },
  button: {
    width: '70%',
    alignSelf: 'center',
  },

  subtitle: {
    color: COLORS.neutral.dark,
  },

  buttonContainer: {
    marginTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
});
export default SelectPrimaryGoalScreen;
