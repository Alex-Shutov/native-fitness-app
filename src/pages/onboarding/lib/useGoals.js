import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { goalsState } from '~/pages/onboarding/models/onboarding.atom';
import GoalService from '~/pages/onboarding/api/goals.api';
import { useSnackbar } from '~/core/hooks/useSnackbar';

export const useGoals = () => {
  const [goalsData, setGoalsData] = useRecoilState(goalsState);
  const { showSnackbar } = useSnackbar();

  /**
   * Загружает список целей с сервера
   */
  const fetchGoals = async () => {
    // Если цели уже загружены, не делаем повторный запрос
    if (goalsData.goals.length > 0 && !goalsData.shouldRefresh) return;

    setGoalsData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const apiGoals = await GoalService.getGoals();
      console.warn(apiGoals,'apiGoals returned');

      setGoalsData({
        goals: apiGoals,
        loading: false,
        error: null,
        shouldRefresh: false,
      });
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      setGoalsData(prev => ({
        ...prev,
        loading: false,
        error: 'Не удалось загрузить список целей',
      }));
      showSnackbar('Не удалось загрузить список целей', 'error');
    }
  };

  /**
   * Создает новую цель
   * @param {Object} goalData - Данные цели
   */
  const createGoal = async (goalData) => {
    try {
      const apiData = GoalService.formatGoalForAPI(goalData);
      const newGoal = await GoalService.createGoal(apiData);

      setGoalsData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal],
        shouldRefresh: true, // Помечаем для обновления при следующем запросе
      }));

      return newGoal;
    } catch (error) {
      console.error('Failed to create goal:', error);
      showSnackbar('Не удалось создать цель', 'error');
      throw error;
    }
  };

  /**
   * Обновляет существующую цель
   * @param {Object} goalData - Данные цели
   */
  const updateGoal = async (goalData) => {
    try {
      const apiData = GoalService.formatGoalForAPI(goalData);
      const updatedGoal = await GoalService.updateGoal({
        ...apiData,
        id: parseInt(goalData.id),
      });

      setGoalsData(prev => ({
        ...prev,
        goals: prev.goals.map(g =>
          g.id === goalData.id ? updatedGoal : g
        ),
      }));

      return updatedGoal;
    } catch (error) {
      console.error('Failed to update goal:', error);
      showSnackbar('Не удалось обновить цель', 'error');
      throw error;
    }
  };

  // Загружаем цели при первом использовании хука
  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals: goalsData.goals,
    loading: goalsData.loading,
    error: goalsData.error,
    refresh: fetchGoals,
    createGoal,
    updateGoal,
  };
}