import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import WelcomeScreen from '../../pages/welcome/WelcomeScreen';

import LoginScreen from '~/pages/auth/LoginScreen';
import RegisterScreen from '~/pages/auth/RegisterScreen';
import RecipeScreen from '~/pages/nutritions/widgets/RecipeScreen';
import DescribeGoalScreen from '~/pages/onboarding/DescribeGoalScreen';
import DietSelectionScreen from '~/pages/onboarding/DietScreen';
import SelectGoalsScreen from '~/pages/onboarding/SelectGoalsScreen';
import StartScreen from '~/pages/welcome/StartScreen';
import { customTransition } from '~/shared/lib/animations/transitions';
import SelectPrimaryGoalScreen from '~/pages/onboarding/SelectMainGoalScreen';
import TabNavigator from './tabNavigation';
import QuizScreen from '../../pages/quiz/QuizScreen';
import OnBoardProgressScreen from '../../pages/onboarding/ProgressScreen';
import PersonalInfoScreen from '../../pages/onboarding/PersonalInfoScreen';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../pages/auth/lib/useAuth';
import { COLORS } from '../styles/theme';

const Stack = createStackNavigator();

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
          setInitialRoute(isAuthenticated ? 'MainScreen' : 'Login');
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
      <View style={{ backgroundColor:COLORS.page.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator  size="large" />
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
      <Stack.Screen name="SelectPrimaryGoal" component={SelectPrimaryGoalScreen} />
      <Stack.Screen name="DescribeGoalScreen" component={DescribeGoalScreen} />
      <Stack.Screen name="OnBoardProgressScreen" component={OnBoardProgressScreen} />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
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
