import GameStore from '~/pages/game/widgets/GameStore';
import * as PropTypes from 'prop-types';
import GamesList from '~/pages/game/widgets/GamesList';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { customTransition } from '~/shared/lib/animations/transitions';
import Game2048 from '~/pages/game/widgets/Game2048/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_STORAGE_KEY = '@fitness_app:game_points';

// Создаем стек навигатор
const GameStack = createStackNavigator();

function Game2(props) {
  return null;
}

Game2.propTypes = { onPointsEarned: PropTypes.func };
export const GamesNavigator = () => {
  const [points, setPoints] = useState(220); // Начальное количество баллов

  // Загрузка баллов при монтировании компонента
  React.useEffect(() => {
    loadPoints();
  }, []);

  // Загрузка баллов из хранилища
  const loadPoints = async () => {
    try {
      const savedPoints = await AsyncStorage.getItem(POINTS_STORAGE_KEY);
      if (savedPoints !== null) {
        setPoints(parseInt(savedPoints, 10));
      }
    } catch (error) {
      console.error('Ошибка при загрузке баллов:', error);
    }
  };

  // Сохранение баллов в хранилище
  const savePoints = async (newPoints) => {
    try {
      await AsyncStorage.setItem(POINTS_STORAGE_KEY, newPoints.toString());
    } catch (error) {
      console.error('Ошибка при сохранении баллов:', error);
    }
  };

  // Функция для обновления баллов
  const handlePointsChange = (newPoints) => {
    setPoints(newPoints);
    savePoints(newPoints);
  };

  // Функция для начисления баллов (например, за игру)
  const handlePointsEarned = (earnedPoints) => {
    const newPoints = points + earnedPoints;
    handlePointsChange(newPoints);
  };

  // Функция для списания баллов (например, при покупке)
  const handlePointsSpent = (spentPoints) => {
    if (points >= spentPoints) {
      const newPoints = points - spentPoints;
      handlePointsChange(newPoints);
      return true; // Успешная покупка
    }
    return false; // Недостаточно баллов
  };

  return (
    <GameStack.Navigator
      screenOptions={{
        headerShown: false,
        ...customTransition,
      }}>
      <GameStack.Screen
        name="GamesList"
        component={(props) => (
          <GamesList
            {...props}
            points={points}
          />
        )}
      />
      <GameStack.Screen
        name="Game2048"
        component={(props) => (
          <Game2048
            {...props}
            onPointsEarned={handlePointsEarned}
          />
        )}
      />
      <GameStack.Screen
        name="GameStore"
        component={(props) => (
          <GameStore
            {...props}
            points={points}
            onPurchase={handlePointsSpent}
          />
        )}
      />
    </GameStack.Navigator>
  );
};

export default GamesNavigator;