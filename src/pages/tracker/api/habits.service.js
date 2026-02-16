import apiClient from '~/shared/api/client';

const HabitsService = {
  async getHabits(userId) {
    try {
      const { data } = await apiClient.get(`/api/habits/user/${userId}`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (error.response?.status === 404) return [];
      console.error('Error fetching habits:', error);
      throw error;
    }
  },

  async createHabit(userId, pattern, name) {
    const body = {
      userId: Number(userId),
      pattern: String(pattern),
      ...(name != null && name.trim() !== '' && { name: String(name).trim() }),
    };
    const { data } = await apiClient.post('/api/habits', body);
    return data;
  },

  async updateHabitDay(habitId, userId, dayIndex, completed) {
    const { data } = await apiClient.patch(
      `/api/habits/${habitId}/user/${userId}/day/${dayIndex}`,
      null,
      { params: { completed: Boolean(completed) } }
    );
    return data;
  },

  async updateHabit(habitId, userId, pattern) {
    const { data } = await apiClient.put(
      `/api/habits/${habitId}/user/${userId}`,
      { pattern: String(pattern) }
    );
    return data;
  },
};

export default HabitsService;
