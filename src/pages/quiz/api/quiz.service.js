import apiClient from '~/shared/api/client';

const QuizService = {
  /**
   * Получает случайный вопрос
   * @param {number} userId Идентификатор пользователя
   * @returns {Promise<Question>} Случайный вопрос
   */
  async getRandomQuestion(userId) {
    try {
      const response = await apiClient.get('/api/quiz/random', {
        params: { userId,
          timestamp: Date.now()
        },
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching random quiz:', error);
      throw error;
    }
  },

  async getQuestionsBatch(userId) {
    try {
      const response = await apiClient.get('/api/quiz/batch', {
        params: { userId,
        },
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      return response.data.map(el=>({...el,rightAnswer:el.correctAnswerId}));
    } catch (error) {
      console.error('Error fetching  quizes:', error);
      throw error;
    }
  },

  /**
   * Проверяет правильность ответа
   * @param {number} userId Идентификатор user's
   * @param {number} questionId Идентификатор вопроса
   * @param {number} answerId Идентификатор выбранного ответа
   * @returns {Promise<boolean>} true если ответ правильный, false в противном случае
   */
  async checkAnswer(userId,questionId, answerId) {
    try {
      const response = await apiClient.post('/api/quiz/check', {
        userId,
        questionId,
        answerId,
      });
      return response.data.correct;
    } catch (error) {
      console.error('Error checking answer:', error);
      throw error;
    }
  },
  async checkAnswersBatch(answers) {
    try {
      const response = await apiClient.post('/api/quiz/check-batch', {
        answers: answers.map(({ userId, questionId, answerId }) => ({
          userId,
          questionId,
          answerId
        }))
      });
      return response.data; // Предполагаем, что сервер возвращает массив результатов
    } catch (error) {
      console.error('Error checking answers batch:', error);
      throw error;
    }
  }
};

export default QuizService;