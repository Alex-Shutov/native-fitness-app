// src/pages/onboarding/SelectGoalsScreen.jsx
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';

import { COLORS, SPACING } from '~/core/styles/theme';
import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import { goalsData } from '~/pages/onboarding/models/goals.mock';
import GoalsGrid from '~/pages/onboarding/widgets/GoalsGrid';
import Button from '~/shared/ui/button';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';

const SelectGoalsScreen = () => {
  const navigation = useNavigation();
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const [selectedGoals, setSelectedGoals] = useState(onboarding.selectedGoals || []);

  // Update the Recoil state when selected goals change
  useEffect(() => {
    setOnboarding(prev => ({
      ...prev,
      selectedGoals,
    }));
  }, [selectedGoals, setOnboarding]);

  const handleGoalsChange = (newSelectedGoals) => {
    setSelectedGoals(newSelectedGoals);
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      setOnboarding(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
      // Navigate to the next screen (to be implemented)
      // navigation.navigate('SelectPrimaryGoal');
    }
  };

  return (
    <ScreenTransition>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typo variant="hSub" >
              Выбери свою цель
            </Typo>
            <Typo variant="body1" style={styles.subtitle}>
              Выбери не больше десяти целей
            </Typo>
          </View>

          <GoalsGrid
            goals={goalsData}
            selectedGoals={selectedGoals}
            onToggleGoal={handleGoalsChange}
            maxSelection={10}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Иду к цели"
              variant="primary"
              size="large"
              onPress={handleContinue}
              disabled={selectedGoals.length === 0}
              fullWidth
            />
          </View>
        </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: SPACING.xl,
  },

  subtitle: {
    color: COLORS.neutral.dark,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
});

export default SelectGoalsScreen;