import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { COLORS, SPACING } from '~/core/styles/theme';
import { useGoals } from '~/pages/onboarding/lib/useGoals';
import Button from '~/shared/ui/button';
import LoadingOrError from '~/shared/ui/layout/LoadingOrError';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { Typo } from '~/shared/ui/typo';
import GoalsGrid from '~/pages/onboarding/widgets/GoalsGrid';
import useAuth from '~/pages/auth/lib/useAuth';
import ProfileApi from '~/pages/profile/api/profile.api';

const MONTHLY_REVIEW_DONE_KEY = 'monthly_goal_review_completed_month';

const getCurrentMonthKey = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
};

const MonthlyGoalReviewScreen = () => {
  const navigation = useNavigation();
  const { goals, loading, error } = useGoals();
  const { user, setUser } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const selectedGoal = null



  useEffect(() => {
    if (goals.length > 0) {
      setSelectedGoals([goals.find((goal) => goal.id == user.goal).id] ?? []);
    }
  }, [goals, user]);



  const handleContinue = async () => {
    const selectedGoal = goals.find((goal) => goal.id == selectedGoals[0])
    if (!selectedGoal || submitting) return;
    setSubmitting(true);
    try {
      const updated = await ProfileApi.updateProfile({ goal: selectedGoal.id });
      setUser((prev) => ({ ...prev, ...updated, goal: selectedGoal.id }));
      await AsyncStorage.setItem(MONTHLY_REVIEW_DONE_KEY, getCurrentMonthKey());
      navigation.navigate('DescribeGoalScreen', {
        goalId: selectedGoal.id,
        goalValue: selectedGoal.value,
        fromMonthlyReview: true,
      });
    } catch (e) {
      console.error('Failed to update goal for monthly review:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoadingOrError loading={loading} error={error}>
      <ScreenTransition>
        <ScreenBackground showHeader={false} hasBackButton={false}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Typo variant="hSub">Выбери свою цель</Typo>
              <Typo variant="body1" style={styles.subtitle}>
                Если ваша цель не изменилась - просто нажмите продолжить
              </Typo>
            </View>

            <GoalsGrid
              goals={goals}
              selectedGoals={selectedGoals}
              onToggleGoal={(arr) => {

                setSelectedGoals((prev) => prev.includes(arr[0]) ? [arr[1]] : arr);
              }}
              maxSelection={2}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Продолжить"
              style={styles.button}
              loading={submitting}
              onPress={handleContinue}
              disabled={selectedGoals.length !== 1}
            />
          </View>
        </ScreenBackground>
      </ScreenTransition>
    </LoadingOrError>
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
    marginTop: SPACING.sm,
    color: COLORS.neutral.dark,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  button: {
    width: '70%',
    alignSelf: 'center',
  },
});

export default MonthlyGoalReviewScreen;
