import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import WelcomeScreen from '../../pages/welcome/WelcomeScreen';

import StartScreen from '~/pages/welcome/StartScreen';
import { customTransition } from '~/shared/lib/animations/transitions';
import RegisterScreen from '~/pages/auth/RegisterScreen';
import LoginScreen from '~/pages/auth/LoginScreen';
import SelectGoalsScreen from '~/pages/onboarding/SelectGoalsScreen';
import SelectPrimaryGoalScreen from '~/pages/onboarding/SelectMainGoalScreen';
import DescribeGoalScreen from '~/pages/onboarding/DescribeGoalScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SelectGoals"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
