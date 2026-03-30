import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import WelcomeScreen from '../../pages/welcome/WelcomeScreen';

import LoginScreen from '~/pages/auth/LoginScreen';
import RegisterScreen from '~/pages/auth/RegisterScreen';
import RecipeScreen from '~/pages/nutritions/widgets/RecipeScreen';
import DescribeGoalScreen from '~/pages/onboarding/DescribeGoalScreen';
import DietSelectionScreen from '~/pages/onboarding/DietScreen';
import MonthlyGoalReviewScreen from '~/pages/onboarding/MonthlyGoalReviewScreen';
import SelectGoalsScreen from '~/pages/onboarding/SelectGoalsScreen';
import StartScreen from '~/pages/welcome/StartScreen';
import { customTransition } from '~/shared/lib/animations/transitions';
import SelectPrimaryGoalScreen from '~/pages/onboarding/SelectMainGoalScreen';
import TabNavigator from './tabNavigation';
import QuizScreen from '../../pages/quiz/QuizScreen';
import OnBoardProgressScreen from '../../pages/onboarding/ProgressScreen';
import PersonalInfoScreen from '../../pages/onboarding/PersonalInfoScreen';
import AddMeasurementsScreen from '../../pages/profile/widgets/AddMeasurementsScreen';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../pages/auth/lib/useAuth';
import { COLORS } from '../styles/theme';

const Stack = createStackNavigator();
const MONTHLY_REVIEW_DONE_KEY = 'monthly_goal_review_completed_month';
const FORCE_MONTHLY_REVIEW_FOR_TEST = false;
const MONTHLY_REVIEW_START_DATE = new Date(2026, 3, 1); // 1 April 2026

const getCurrentMonthKey = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
};

const hasFirstDayOfMonthPassed = (date = new Date()) => {
  return date.getDate() >= 1;
};

const isMonthlyReviewFeatureStarted = (date = new Date()) => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const startDate = new Date(MONTHLY_REVIEW_START_DATE);
  startDate.setHours(0, 0, 0, 0);
  return current >= startDate;
};

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const { checkAuth } = useAuth();

  useLayoutEffect(() => {
    const determineInitialRoute = async () => {
      try {
        // Проверяем, есть ли токен
        const token = await AsyncStorage.getItem('auth_token');
        const isRegistered = await AsyncStorage.getItem('isAlreadyRegistered');

        if (token) {
          const isAuthenticated = await checkAuth();
          if (isAuthenticated) {
            const completedMonth = await AsyncStorage.getItem(MONTHLY_REVIEW_DONE_KEY);
            const currentMonth = getCurrentMonthKey();
            const shouldShowMonthlyReview = FORCE_MONTHLY_REVIEW_FOR_TEST
              || (isMonthlyReviewFeatureStarted()
                && hasFirstDayOfMonthPassed()
                && completedMonth !== currentMonth);
            setInitialRoute(shouldShowMonthlyReview ? 'MonthlyGoalReviewScreen' : 'MainScreen');
          } else {
            setInitialRoute('Login');
          }
        } else if (isRegistered === 'true') {
          // Если нет токена, но пользователь уже регистрировался
          setInitialRoute('Login');
        } else {
          // Первый запуск
          setInitialRoute('Welcome');
        }
      } catch (error) {
        console.error('Error determining initial route:', error);
        // setInitialRoute('Welcome');
      } finally {
        setIsLoading(false);
      }
    };

    determineInitialRoute();
  }, []);

  if (isLoading) {
    return (
      <View style={{ backgroundColor: COLORS.page.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        animationEnabled: true,
        ...customTransition,
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SelectGoals" component={SelectGoalsScreen} />
      <Stack.Screen name="MonthlyGoalReviewScreen" component={MonthlyGoalReviewScreen} />
      <Stack.Screen name="SelectPrimaryGoal" component={SelectPrimaryGoalScreen} />
      <Stack.Screen name="DescribeGoalScreen" component={DescribeGoalScreen} />
      <Stack.Screen name="OnBoardProgressScreen" component={OnBoardProgressScreen} />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
      <Stack.Screen name="AddMeasurementsScreen" component={AddMeasurementsScreen} />
      <Stack.Screen name="DietSelectionScreen" component={DietSelectionScreen} />
      <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen
        name="MainScreen"
        component={TabNavigator}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
