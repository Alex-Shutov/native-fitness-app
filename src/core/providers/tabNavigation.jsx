// src/navigation/TabNavigator.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedTabBar from 'curved-bottom-navigation-bar';
import Animated from 'react-native-reanimated';  // Используем отдельный импорт
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '~/core/styles/theme';
import NutritionStack from '~/pages/nutritions';

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
        color={focused ? COLORS.primary.main : COLORS.neutral.medium}
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
  Calendar: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="calendar-today"
        size={24}
        color={focused ? COLORS.primary.main : COLORS.neutral.medium}
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
          // Используем более конкретные цвета непосредственно
          backgroundColor: '#7AB648', // Или используйте конкретное значение из COLORS.primary.main
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <MaterialIcons name="food-bank" size={28} color="#FFFFFF" />
      </View>
    ),
  },
  Favorites: {
    icon: ({ progress, focused }) => (
      <MaterialIcons
        name="favorite"
        size={24}
        color={focused ? COLORS.primary.main : COLORS.neutral.medium}
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
        color={focused ? COLORS.primary.main : COLORS.neutral.medium}
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
          // Используем строковые значения вместо объекта цветов
          barColor="#FFFFFF" // Или можно использовать 'white'
          dotColor="#7AB648"  // Используйте соответствующий hex-код вместо COLORS.primary.main
          duration={250}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Nutrition" component={NutritionStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;