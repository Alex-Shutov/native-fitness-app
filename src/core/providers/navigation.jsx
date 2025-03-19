import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import WelcomeScreen from '../../pages/welcome/WelcomeScreen';

import StartScreen from '~/pages/welcome/StartScreen';
import { customTransition } from '~/shared/lib/animations/transitions';
import RegisterScreen from '~/pages/auth/RegisterScreen';
import LoginScreen from '~/pages/auth/LoginScreen';
import SelectGoalsScreen from '~/pages/onboarding/SelectGoalsScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
