import apiClient from '~/shared/api/client';

const ProgressService = {
  /**
   * Получает данные о прогрессе с сервера
   * @returns {Promise<{goalProgress: number, weight: {currentWeight: number, startWeight: number, targetWeight: number}}>}
   */
  async getProgressData() {
    try {
      const response = await apiClient.get('/api/progress');
      console.log(response,'response123');
      // Преобразуем данные в нужный формат
      return {
        goalProgress: response.data?.goalProgress,
        weight: {
          currentWeight: response.data?.width?.currentWeight,
          startWeight: response.data?.width?.startWeight,
          targetWeight: response.data?.width?.targetWeight,
        },
      };
    } catch (error) {
      console.error('Error fetching progress data:', error);
      throw error;
    }
  },
};

export default ProgressService;
