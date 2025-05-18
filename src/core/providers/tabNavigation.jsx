// src/navigation/TabNavigator.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedTabBar, { TabsConfigsType } from 'curved-bottom-navigation-bar';
import { Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '~/core/styles/theme';
import NutritionStack from '~/pages/nutritions';
import TrackerScreen from '~/pages/tracker/widgets/TrackerScreen';
import PersonalCabinetScreen from '~/pages/profile/widgets/PersonalCabinetScreen';
import ProgressScreen from '~/pages/progress/widgets/ProgressScreen';

// Импортируем компоненты

// Заглушки для других табов
const ProfileScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.neutral.offWhite }} />;
const CalendarScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.neutral.offWhite }} />;
const FavoritesScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.neutral.offWhite }} />;

const Tab = createBottomTabNavigator();

// Конфигурация вкладок
const tabs = {
  Nutrition: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="restaurant-menu"
        size={24}
        color={COLORS.neutral.white}
      />
    ),
    renderTitle: ({ title, progress }) => {
      return (
        <Animated.Text
          style={{
            opacity: progress,
            color: COLORS.primary.main,
            fontWeight: '500',
          }}
        >
          Питание
        </Animated.Text>
      );
    },
  },
  Progress: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="track-changes"
        size={24}
        color={COLORS.neutral.white}
      />
    ),
    renderTitle: ({ title, progress }) => {
      return (
        <Animated.Text
          style={{
            opacity: progress,
            color: COLORS.primary.main,
            fontWeight: '500',
          }}
        >
          Питание
        </Animated.Text>
      );
    },
  },
  Tracker: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="check-circle"
        size={24}
        color={COLORS.neutral.white}
      />
    ),
    renderTitle: ({ title, progress }) => {
      return (
        <Animated.Text
          style={{
            opacity: progress,
            color: COLORS.primary.main,
            fontWeight: '500',
          }}
        >
          Трекер
        </Animated.Text>
      );
    },
  },
  Calendar: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="calendar-today"
        size={24}
        color={COLORS.neutral.white}
      />
    ),
    renderTitle: ({ title, progress }) => {
      return (
        <Animated.Text
          style={{
            opacity: progress,
            color: COLORS.primary.main,
            fontWeight: '500',
          }}
        >
          Календарь
        </Animated.Text>
      );
    },
  },
  Main: {
    icon: ({ progress, focused }) => (
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: COLORS.primary.main,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <MaterialIcons name="food-bank" size={28} color={COLORS.neutral.white} />
      </View>
    ),
  },
  Favorites: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="favorite"
        size={24}
        color={COLORS.neutral.white}
      />
    ),
    renderTitle: ({ title, progress }) => {
      return (
        <Animated.Text
          style={{
            opacity: progress,
            color: COLORS.primary.main,
            fontWeight: '500',
          }}
        >
          Избранное
        </Animated.Text>
      );
    },
  },
  Profile: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="person"
        size={24}
        color={COLORS.neutral.white}
      />
    ),
    renderTitle: ({ title, progress }) => {
      return (
        <Animated.Text
          style={{
            opacity: progress,
            color: COLORS.primary.main,
            fontWeight: '500',
          }}
        >
          Профиль
        </Animated.Text>
      );
    },
  },
};

// Основной навигатор с нижней панелью
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Nutrition"
      tabBar={props => (
        <AnimatedTabBar
          tabs={tabs}
          {...props}
          barColor={COLORS.primary.main}
          dotColor={COLORS.primary.main}
          duration={250}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Nutrition" component={NutritionStack} />
      {/*<Tab.Screen name="Calendar" component={CalendarScreen} />*/}
      <Tab.Screen name="Tracker" component={TrackerScreen} />
      {/*<Tab.Screen name="Favorites" component={FavoritesScreen} />*/}
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={PersonalCabinetScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabNavigator;