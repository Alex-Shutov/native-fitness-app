// src/pages/progress/ProgressScreen.jsx
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { authState } from '~/pages/auth/models/auth.atom';
import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import SemiCircleGauge from '~/pages/progress/widgets/SemiCircleGauge';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { Typo } from '~/shared/ui/typo';
import Button from '../../../shared/ui/button';
import { useNavigation } from '@react-navigation/native';
import { useGoals } from '../../onboarding/lib/useGoals';
import { progressQuery, progressState } from '../models/progress.model';
import ProgressService from '../api/progress.service';

const ProgressScreen = () => {
  const auth = useRecoilValue(authState);
  const onboarding = useRecoilValue(onboardingState);

  const [progress,setProgress] = useRecoilState(progressState);

  const [progressData, setProgressData] = useState(null);

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const data = await ProgressService.getProgressData();
        setProgressData(data);
        setProgress(data); // Обновляем Recoil состояние, если нужно
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [auth?.startWeight,auth?.weight,auth?.targetWeight]);

  const handleStartQuiz = () => {
    navigation.navigate('QuizScreen');
  }

  // Weight progress calculations
  const startWeight = Math.max(0, Number(progress?.weight?.startWeight || auth?.startWeight || 0));
  const currentWeight = Math.max(0, Number(auth?.weight || 0));
  const targetWeight = Math.max(0, Number(progress?.weight?.targetWeight || auth?.targetWeight || 0));

  const totalDifference = Math.abs(startWeight - targetWeight);
  const currentProgress = Math.abs(currentWeight - startWeight);

  let weightProgress = 0;

  if (totalDifference !== 0) {
    weightProgress = currentProgress / totalDifference;
  } else {
    weightProgress = 1;
  }

  weightProgress = Math.min(Math.max(weightProgress, 0), 1);

  const weightText =
    currentWeight > targetWeight
      ? `Осталось ${Math.round((currentWeight - targetWeight) * 10) / 10} кг`
      : `Превышено на ${Math.round((targetWeight - currentWeight) * 10) / 10} кг`;

  const minWeight = Math.min(startWeight, targetWeight);
  const maxWeight = Math.max(startWeight, targetWeight);

  // Goal progress calculations
  const goalProgress = (progressData?.goalProgress || onboarding.currentProgress) * 10;
  const goalRemaining = 100 - goalProgress;
  const goalText = goalProgress >= 100 ? 'Цель достигнута!' : `Осталось ${goalRemaining}%`;

  const { goals, loading: goalsLoading, updateGoal } = useGoals();

  // Get goal name
  const goalName = useMemo(
    () => goals.find((el) => el.id === Number(auth.goal))?.value,
    [goals, auth?.goal]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Typo variant="body1">Произошла ошибка: {error.message}</Typo>
      </View>
    );
  }


  return (
    <ScreenTransition>
      <ScreenBackground
        hasBackButton={false}
        contentStyle={styles.contentContainer}
        showHeader
        title={
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.title}>
              Прогресс
            </Typo>
          </View>
        } >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          {/* Weight Progress Card */}
          <View style={styles.card}>
            <Typo variant="body0" style={styles.cardTitle}>
              Вес
            </Typo>
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
            <Typo variant="body1" style={styles.cardTitle}>
              Цель: {goalName}
            </Typo>
            <SemiCircleGauge
              progress={goalProgress / 100}
              minValue={0}
              maxValue={100}
              currentValue={goalProgress.toFixed(1)}
              remainingText={goalText}
              valueLabel="Нынешний прогресс"
              unit='%'
            />
          </View>
          <Button title="Начать викторину" onPress={handleStartQuiz} />
        </ScrollView>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.page.background,
  },
  headerContainer: {
    display: 'flex',
    width: '100%',
    flex: 1,
  },
  content: {
    paddingTop: SPACING.md,
  },
  // title: {
  //   fontSize: 36,
  //   marginBottom: SPACING.xl,
  // },
  loadingContainer:{
    backgroundColor: COLORS.page.background,
  },
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default ProgressScreen;
