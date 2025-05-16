// src/ui/TabBar/CurvedTabBar.jsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '~/core/styles/theme';

// Компонент, который отображает изогнутую нижнюю панель
const CurvedTabBar = ({
                        children,
                        initialRouteName,
                        tabIcons,
                        centerIcon = 'food-bank',
                        onCenterPress,
                        type = 'UP'
                      }) => {

  // Функция для рендера иконки таба
  const _renderIcon = (routeName, selectedTab) => {
    // Находим иконку для данного routeName
    const iconData = tabIcons.find(icon => icon.name === routeName);
    if (!iconData) return null;

    return (
      <MaterialIcons
        name={iconData.icon}
        size={24}
        color={routeName === selectedTab ? COLORS.primary.main : COLORS.neutral.medium}
      />
    );
  };

  // Функция для рендера таб-бара
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabBarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  // Обработчик нажатия на центральную кнопку
  const handleCenterPress = (selectedTab, navigate) => {
    if (onCenterPress) {
      onCenterPress(selectedTab, navigate);
    } else {
      // По умолчанию переходим на initialRouteName
      navigate(initialRouteName);
    }
  };

  return (
    <CurvedBottomBar.Navigator
      type={type}
      style={styles.bottomBar}
      shadowStyle={styles.shadow}
      height={60}
      circleWidth={60}
      bgColor={COLORS.neutral.white}
      initialRouteName={initialRouteName}
      borderTopLeftRight
      screenOptions={{
        headerShown: false
      }}
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View style={styles.btnCircle}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => handleCenterPress(selectedTab, navigate)}
          >
            <MaterialIcons
              name={centerIcon}
              size={28}
              color={COLORS.neutral.white}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      {children}
    </CurvedBottomBar.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    borderRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  shadow: {
    shadowColor: COLORS.neutral.darkest,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.main,
    shadowColor: COLORS.neutral.darkest,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
    bottom: 28, // Поднимаем над панелью
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default CurvedTabBar;