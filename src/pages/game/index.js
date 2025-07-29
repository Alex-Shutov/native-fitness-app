import GameStore from '~/pages/game/widgets/GameStore';
import * as PropTypes from 'prop-types';
import GamesList from '~/pages/game/widgets/GamesList';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { customTransition } from '~/shared/lib/animations/transitions';
import Game2048 from '~/pages/game/widgets/Game2048/Game';
import apiClient from '../../shared/api/client';
import AuthService from '../auth/api/auth.service';

const GameStack = createStackNavigator();

function Game2(props) {
  return null;
}

Game2.propTypes = { onPointsEarned: PropTypes.func };

export const GamesNavigator = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        const response = await AuthService.getCurrentUser();
        setPoints(response.user.points ?? 0);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке баллов:', err);
        setError('Не удалось загрузить баллы');
        setPoints(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  const addPointsToUser = async (addPoints) => {
    try {
      await apiClient.post('/api/points', addPoints);
      return true;
    } catch (err) {
      console.error('Ошибка при обновлении баллов:', err);
      return false;
    }
  };

  const handlePointsEarned = async (earnedPoints) => {
    const newPoints = points + earnedPoints;
    const success = await addPointsToUser(newPoints);
    if (success) {
      setPoints(newPoints);
    }
  };

  const handlePointsSpent = async (spentPoints) => {
    if (points >= spentPoints) {
      const newPoints = points - spentPoints;
      const success = await addPointsToUser(-spentPoints);
      if (success) {
        setPoints(newPoints);
        return true;
      }
    }
    return false;
  };

  // Создаем отдельные компоненты для экранов
  const GamesListScreen = (props) => (
    <GamesList {...props} points={points} loading={loading} error={error} />
  );

  const Game2048Screen = (props) => (
    <Game2048 {...props} onPointsEarned={handlePointsEarned} />
  );

  const GameStoreScreen = (props) => (
    <GameStore {...props} points={points} onPurchase={handlePointsSpent} loading={loading} />
  );

  return (
    <GameStack.Navigator
      screenOptions={{
        headerShown: false,
        ...customTransition,
      }}>
      <GameStack.Screen
        name="GamesList"
        component={GamesListScreen}
      />
      <GameStack.Screen
        name="Game2048"
        component={Game2048Screen}
      />
      <GameStack.Screen
        name="GameStore"
        component={GameStoreScreen}
      />
    </GameStack.Navigator>
  );
};

export default GamesNavigator;