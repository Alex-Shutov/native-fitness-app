// src/pages/progress/ProgressScreen.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { authState } from '~/pages/auth/models/auth.atom';
import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import SemiCircleGauge from '~/pages/progress/widgets/SemiCircleGauge';
import { progressQuery, progressState } from '~/pages/progress/models/progress.model';

const ProgressScreen = () => {
  const auth = useRecoilValue(authState);
  const onboarding = useRecoilValue(onboardingState);
  const setProgress = useSetRecoilState(progressState);
  const progressData = useRecoilValue(progressQuery);

  // Обновляем состояние при получении новых данных
  useEffect(() => {
    if (progressData) {
      setProgress(progressData);
    }
  }, [progressData, setProgress]);

  const progress = useRecoilValue(progressState);

  // Weight progress calculations
  const startWeight = Number(progress.weight.startWeight || auth.startWeight);
  const currentWeight = Number(auth.weight);
  const targetWeight = Number(progress.weight.targetWeight || auth.targetWeight);

  const totalDifference = Math.abs(startWeight - targetWeight);
  const currentProgress = Math.abs(currentWeight - startWeight);

  let weightProgress = 0;

  if (totalDifference !== 0) {
    weightProgress = currentProgress / totalDifference;
  } else {
    weightProgress = 1;
  }

  weightProgress = Math.min(Math.max(weightProgress, 0), 1);

  const weightText = currentWeight > targetWeight
    ? `Осталось ${Math.round((currentWeight - targetWeight) * 10) / 10} кг`
    : `Превышено на ${Math.round((targetWeight - currentWeight) * 10) / 10} кг`;

  const minWeight = Math.min(startWeight, targetWeight);
  const maxWeight = Math.max(startWeight, targetWeight);

  // Goal progress calculations
  const goalProgress = (progressData?.goalProgress || onboarding.currentProgress) * 10;
  const goalRemaining = 100 - goalProgress;
  const goalText = `Осталось ${goalRemaining}%`;

  // Get goal name
  const goalName = onboarding.primaryGoal
    ? onboarding.primaryGoal.value
    : auth.goal || 'Карьера';
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
              valueLabel="Нынешний вес"
              unit=" кг"
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
    paddingTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    textAlign: 'left',
  },
});

export default ProgressScreen;