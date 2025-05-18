// src/pages/progress/ProgressScreen.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { authState } from '~/pages/auth/models/auth.atom';
import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import { profileState } from '~/pages/profile/model/profille.state';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import SemiCircleGauge from '~/pages/progress/widgets/SemiCircleGauge';

const ProgressScreen = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const onboarding = useRecoilValue(onboardingState);
  const [profile, setProfile] = useRecoilState(profileState);
  console.log(auth);
  // Sync auth state with profile state
  useEffect(() => {
    // Set profile values based on auth state
    setProfile(prev => ({
      ...prev,
      currentWeight: String(auth.weight),
      targetWeight: String(auth.targetWeight),
      age: String(auth.age),
      gender: auth.gender === 'male' ? 'Мужской' : 'Женский',
      height: String(auth.height),
    }));
  }, []);

  // Handle changes in profile state back to auth state
  useEffect(() => {
    setAuth(prev => ({
      ...prev,
      weight: Number(profile.currentWeight) || prev.weight,
      targetWeight: Number(profile.targetWeight) || prev.targetWeight,
      age: Number(profile.age) || prev.age,
      gender: profile.gender === 'Мужской' ? 'male' : 'female',
      height: Number(profile.height) || prev.height,
    }));
  }, [profile, setAuth]);

  // Weight progress calculations
  const startWeight = Number(auth.startWeight); // Начальный вес
  const currentWeight = Number(auth.weight); // Текущий вес
  const targetWeight = Number(auth.targetWeight); // Желаемый вес

  const totalDifference = Math.abs(startWeight - targetWeight);
  const currentProgress = Math.abs(currentWeight - startWeight);

  let weightProgress = 0;

  if (totalDifference !== 0) {
    weightProgress = currentProgress / totalDifference;
  } else {
    weightProgress = 1; // если цель равна старту — цель достигнута
  }

  weightProgress = Math.min(Math.max(weightProgress, 0), 1); // нормализация

  const weightText = currentWeight > targetWeight
    ? `Осталось ${Math.round((currentWeight - targetWeight) * 10) / 10} кг`
    : `Превышено на ${Math.round((targetWeight - currentWeight) * 10) / 10} кг`;

  const minWeight = Math.min(startWeight, targetWeight);
  const maxWeight = Math.max(startWeight, targetWeight);

  // Goal progress calculations
  const goalProgress = onboarding.currentProgress * 10; // Scale from 0-10 to 0-100%
  const goalRemaining = 100 - goalProgress;
  const goalText = `Осталось ${goalRemaining}%`;

  // Get goal name
  const goalName = onboarding.primaryGoal
    ? onboarding.primaryGoal.value
    : profile.goal || 'Карьера';

  return (
    <ScreenTransition>
      <ScreenBackground showHeader={false}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Typo variant="hSub" style={styles.title}>
            Прогресс
          </Typo>

          {/* Weight Progress Card */}
          <View style={styles.card}>
            <Typo variant="body0" style={styles.cardTitle}>Вес</Typo>
            <SemiCircleGauge
              progress={weightProgress}
              minValue={maxWeight}
              maxValue={minWeight}
              currentValue={currentWeight}
              remainingText={weightText}
              valueLabel="Нынешний вес"unit=" кг"
            />
          </View>

          {/* Goal Progress Card */}
          <View style={styles.card}>
            <Typo variant="body0" style={styles.cardTitle}>Цель {goalName}</Typo>
            <SemiCircleGauge
              progress={goalProgress / 100}
              minValue={0}
              maxValue={100}
              currentValue={goalProgress}
              remainingText={goalText}
              valueLabel="Нынешний прогресс"
              unit="%"
            />
          </View>
        </ScrollView>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.page.background,
  },
  content: {
    // padding: SPACING.xl,
  },
  title: {
    fontSize: 36,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    paddingTop:SPACING.md,

    marginBottom: SPACING.xl,
    // alignItems: 'center',
  },
  cardTitle: {
    textAlign:'left',
    // marginBottom: SPACING.md,
  },
});

export default ProgressScreen;