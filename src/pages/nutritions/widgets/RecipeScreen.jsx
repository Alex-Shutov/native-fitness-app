import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import { getDayMeals, getMealTypeById } from '~/pages/nutritions/lib/utils';

const RecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dietId, mealTypeId, day } = route.params || {};

  // Находим соответствующий рецепт
  const meals = getDayMeals(dietId, day);
  const recipe = meals.find(meal => meal.type === mealTypeId);

  // Получаем название типа приема пищи
  const mealType = getMealTypeById(mealTypeId);

  // Обработчик для кнопки "Добавить в избранное"
  const handleAddToFavorites = () => {
    // Логика для добавления рецепта в избранное
    console.log('Add to favorites:', recipe?.id);
  };

  if (!recipe) {
    return (
      <ScreenBackground>
        <View style={styles.container}>
          <Typo variant="body1">Рецепт не найден</Typo>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenTransition>
      <ScreenBackground>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Изображение рецепта */}
          <View style={styles.imageContainer}>
            <Image
              source={recipe.image}
              style={styles.recipeImage}
              resizeMode="cover"
            />

            {/* Кнопка "Назад" */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color={COLORS.neutral.darkest} />
            </TouchableOpacity>

            {/* Кнопка "Добавить в избранное" */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleAddToFavorites}
            >
              <MaterialIcons name="bookmark-border" size={24} color={COLORS.neutral.darkest} />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            {/* Заголовок рецепта */}
            <Typo variant="hSub" style={styles.recipeTitle}>
              {recipe.title}
            </Typo>

            {/* Ингридиенты */}
            <View style={styles.section}>
              <Typo variant="body0" style={styles.sectionTitle}>
                Ингридиенты
              </Typo>

              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bulletPoint} />
                  <Typo variant="body1" style={styles.ingredientText}>
                    {ingredient.name}
                    {ingredient.amount &&
                      <Typo variant="body1" style={styles.ingredientAmount}>
                        {' '}{ingredient.amount}
                      </Typo>
                    }
                  </Typo>
                </View>
              ))}
            </View>

            {/* Способ приготовления */}
            <View style={styles.section}>
              <Typo variant="body0" style={styles.sectionTitle}>
                Способ приготовления
              </Typo>

              {recipe.preparationSteps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.bulletPoint} />
                  <Typo variant="body1" style={styles.stepText}>
                    {step}
                  </Typo>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral.offWhite,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl * 3, // Большой отступ снизу для навигации
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    marginTop: -20, // Накладываем на изображение
  },
  recipeTitle: {
    fontSize: SPACING.xl * 1,
    marginBottom: SPACING.md,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    fontSize: SPACING.lg,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary.main,
    marginRight: SPACING.sm,
    marginTop: 8,
  },
  ingredientText: {
    flex: 1,
  },
  ingredientAmount: {
    color: COLORS.neutral.medium,
  },
  stepText: {
    flex: 1,
  },
});

export default RecipeScreen;