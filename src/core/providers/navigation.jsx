import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import WelcomeScreen from '../../pages/welcome/WelcomeScreen';

import LoginScreen from '~/pages/auth/LoginScreen';
import RegisterScreen from '~/pages/auth/RegisterScreen';
import useAuth from '~/pages/auth/lib/useAuth';
import RecipeScreen from '~/pages/nutritions/widgets/RecipeScreen';
import DescribeGoalScreen from '~/pages/onboarding/DescribeGoalScreen';
import DietSelectionScreen from '~/pages/onboarding/DietScreen';
import PersonalInfoScreen from '~/pages/onboarding/PersonalInfoScreen';
import ProgressScreen from '~/pages/onboarding/ProgressScreen';
import SelectGoalsScreen from '~/pages/onboarding/SelectGoalsScreen';
import StartScreen from '~/pages/welcome/StartScreen';
import { customTransition } from '~/shared/lib/animations/transitions';
import SelectPrimaryGoalScreen from '~/pages/onboarding/SelectMainGoalScreen';
import TabNavigator from './tabNavigation';

const Stack = createStackNavigator();

const Navigation = () => {
  useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
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
      <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
      <Stack.Screen name="DietSelectionScreen" component={DietSelectionScreen} />
      <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
      <Stack.Screen
        name="MainScreen"
        component={TabNavigator}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
