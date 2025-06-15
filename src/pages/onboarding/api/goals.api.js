// src/shared/api/goalService.js
import apiClient from '~/shared/api/client';
import { mapGoalsFromApi } from '~/pages/onboarding/lib/goals.mapper';

/**
 * Сервис для работы с целями пользователя
 */
const GoalService = {
  /**
   * Получить список всех целей пользователя
   */
  async getGoals() {
    try {
      const response = await apiClient.get('/api/predefined-goals');
      debugger
      return mapGoalsFromApi(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  /**
   * Создать новую цель
   * @param {GoalDto} goalData - Данные для создания цели
   * @returns {Promise<Goal>} Созданная цель
   */
  async createGoal(goalData) {
    try {
      const response = await apiClient.post('/api/goals', goalData);
      return mapGoalsFromApi([response.data])[0];
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  /**
   * Обновить существующую цель
   */
  async updateGoal(goalData) {
    try {
      const response = await apiClient.put('/api/goals', goalData);
      return mapGoalsFromApi([response.data])[0];
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  /**
   * Преобразует данные цели из API в формат для UI
   */
  formatGoalForUI(goal) {
    return {
      id: goal.id.toString(),
      value: goal.goalType,
      label: goal.goalType,
      // targetWeight: goal.targetWeight,
      // targetBMI: goal.targetBMI,
      // deadline: goal.deadline,
    };
  },

  /**
   * Преобразует данные цели из UI в формат для API
   */
  formatGoalForAPI(goal) {
    return {
      goalType: goal.value || goal.label,
      targetWeight: goal.targetWeight ? parseFloat(goal.targetWeight) : null,
      targetBMI: goal.targetBMI ? parseFloat(goal.targetBMI) : null,
      deadline: goal.deadline || null,
    };
  },
};

export default GoalService;