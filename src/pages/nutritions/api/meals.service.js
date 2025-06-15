// src/shared/api/mealService.js
import apiClient from '~/shared/api/client';
import { MEAL_TYPES } from '~/pages/nutritions/lib/utils';

/**
 * Сервис для работы с рецептами
 */
const MealService = {
  /**
   * Получить рецепт для конкретного типа питания, дня и приема пищи
   * @param {string} dietId - ID типа питания
   * @param {number} day - День (1-14)
   * @param {string} mealType - Тип приема пищи (breakfast, lunch, dinner, snack)
   * @returns {Promise<MealRecipe>} Рецепт
   */
  async getMealRecipe(dietId, day, mealType) {
    try {
      const response = await apiClient.get('/api/meals/specific', {
        params: {
          dietId,
          day,
          mealType
        }
      });
      return this.mapMealFromApi(response.data);
    } catch (error) {
      console.error('Error fetching meal recipe:', error);
      throw error;
    }
  },

  getMealTypes(){
    return MEAL_TYPES
  },

  /**
   * Получить все дни для конкретного типа питания
   * @param {string} dietId - ID типа питания
   * @returns {Promise<number[]>} Массив дней (1-14)
   */
  getPlanDays(dietId) {
    // Просто возвращаем массив дней от 1 до 14
    return Array.from({ length: 14 }, (_, i) => i + 1);
  },

  /**
   * Маппинг данных рецепта из API в формат для UI
   */
  mapMealFromApi(mealData) {
    return {
      id: `${mealData.mealType}-${mealData.day}-${mealData.dietId}`,
      title: mealData.name,
      image: { uri: mealData.imageUrl },
      ingredients: this._parseIngredients(mealData.recipe),
      preparationSteps: this._parseSteps(mealData.recipe),
      type: mealData.mealType,
      day: mealData.day,
      nutritionPlanId: mealData.dietId,
      description: mealData.description
    };
  },

  /**
   * Парсинг ингредиентов из строки рецепта
   */
  _parseIngredients(recipeText) {
    // Пример парсинга - зависит от формата ответа от бекенда
    // Здесь предполагается, что ингредиенты разделены переносами строк
    const lines = recipeText.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const [name, amount] = line.split('-').map(part => part.trim());
      return { name, amount: amount || '' };
    });
  },

  /**
   * Парсинг шагов приготовления из строки рецепта
   */
  _parseSteps(recipeText) {
    // Пример парсинга - зависит от формата ответа от бекенда
    // Здесь предполагается, что шаги разделены переносами строк
    return recipeText.split('\n')
      .filter(line => line.trim())
      .map(step => step.trim());
  }
};

export default MealService;