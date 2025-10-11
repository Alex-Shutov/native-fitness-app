import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';

import { useSnackbar } from '~/core/hooks/useSnackbar';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import MealService from '~/pages/nutritions/api/meals.service';
import { getDayMeals, getMealTypeById } from '~/pages/nutritions/lib/utils';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { Typo } from '~/shared/ui/typo';
const RecipeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dietId, mealTypeId, day } = route.params || {};
  const { showSnackbar } = useSnackbar();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const recipeData = await MealService.getMealRecipe(dietId, day, mealTypeId);
        setRecipe(recipeData);
      } catch (error) {
        showSnackbar('Не удалось загрузить рецепт', 'error');
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [dietId, mealTypeId, day]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <ScreenBackground style={{ backgroundColor: COLORS.neutral.offWhite }}>
        <View style={styles.container}>
          <Typo variant="body1">Загрузка...</Typo>
        </View>
      </ScreenBackground>
    );
  }

  if (!recipe) {
    return (
      <ScreenBackground style={{ backgroundColor: COLORS.neutral.offWhite }}>
        <View style={styles.container}>
          <Typo variant="body1">Рецепт не найден</Typo>
        </View>
      </ScreenBackground>
    );
  }

  const renderBackButton = () => {
    return (
      <View
        style={styles.backButtonContainer}
        pointerEvents="box-none"
        onStartShouldSetResponder={() => true}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          hitSlop={{ top: 26, bottom: 26, left: 0, right: 16 }}
          accessibilityLabel="Back">
          <MaterialIcons name="arrow-back" size={24} color={COLORS.neutral.darkest} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenTransition>
      <ScreenBackground
        hasBackButton={false}
        style={{ backgroundColor: COLORS.neutral.offWhite }}
        contentStyle={styles.screenBackground}>
        <View style={styles.imageContainer} onStartShouldSetResponder={() => true}>
          <ImageBackground source={recipe.image} style={styles.recipeImage} resizeMode="cover">
            {/*{renderBackButton()}*/}
          </ImageBackground>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsHorizontalScrollIndicator>
          <Typo variant="hSub" style={styles.recipeTitle}>
            {recipe.title}
          </Typo>
          {/*{renderBackButton()}*/}

          <View style={styles.section}>
            <Typo variant="body0" style={styles.sectionTitle}>
              Ингредиенты
            </Typo>

            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Typo variant="body1" style={styles.ingredientText}>
                  {ingredient.name}
                  {ingredient.amount && (
                    <Typo variant="body1" style={styles.ingredientAmount}>
                      {'   '}
                      {ingredient.amount}
                    </Typo>
                  )}
                </Typo>
              </View>
            ))}
          </View>

          {recipe.description && (
            <View style={styles.section}>
              <Typo variant="body0" style={styles.sectionTitle}>
                Способ приготовления
              </Typo>
              <Typo variant="body1" style={styles.description}>
                {recipe.description}
              </Typo>
            </View>
          )}

          {/*<View style={styles.section}>*/}
          {/*  <Typo variant="body0" style={styles.sectionTitle}>*/}
          {/*    Способ приготовления*/}
          {/*  </Typo>*/}

          {/*  {recipe.preparationSteps.map((step, index) => (*/}
          {/*    <View key={index} style={styles.stepItem}>*/}
          {/*      <View style={styles.stepNumber}>*/}
          {/*        <Typo variant="body1">{index + 1}.</Typo>*/}
          {/*      </View>*/}
          {/*      <Typo variant="body1" style={styles.stepText}>*/}
          {/*        {step}*/}
          {/*      </Typo>*/}
          {/*    </View>*/}
          {/*  ))}*/}
          {/*</View>*/}
        </ScrollView>
      </ScreenBackground>
    </ScreenTransition>
  );
};
const styles = StyleSheet.create({
  screenBackground: {
    height: '100%',
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1,
  },

  scrollView: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: COLORS.neutral.darkest,
    top: 0,
    left: 0,
    bottom: 300,
    zIndex: 0,
    // position: 'fixed',
    width: '100%',
    height: 300,
    marginTop: Platform.OS === 'android' ? 16 : 0,
  },
  recipeImage: {
    zIndex: 9,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    backgroundColor: 'rgba(245, 245, 240, 0.8)',
    backgroundColor: 'red',
    position: 'fixed',
    // top: 16,
    zIndex: 123,
    marginTop: Platform.OS === 'android' ? 16 : 0,
    marginLeft: 16,
    // left: 16,
    width: 40,
    display: 'flex',
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    // justifyContent: 'center',  // Добавлено
    // alignItems: 'center',      // Добавлено
  },
  backButton: {
    // position:'relative',

    position: 'absolute',
    display: 'flex',
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
    textAlign: 'left',

    backgroundColor: COLORS.neutral.offWhite,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl * 3, // Большой отступ снизу для навигации
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    marginTop: -20, // Накладываем на изображение
  },
  recipeTitle: {
    textAlign: 'left',

    fontSize: SPACING.xl * 1,
  },
  section: {
    textAlign: 'left',

    marginTop: SPACING.xl,
  },
  sectionTitle: {
    textAlign: 'left',

    marginBottom: SPACING.md,
    fontSize: SPACING.lg,
  },
  description: {
    textAlign: 'justify',
  },
  ingredientItem: {
    marginLeft: SPACING.md,
    textAlign: 'left',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    fontWeight: '400',
    color: '#13131A',
    //     font-family: Catamaran;
    // font-weight: 400;
    // font-style: Regular;
    // font-size: 40px;
    // leading-trim: CAP_HEIGHT;
    // line-height: 35px;
    // letter-spacing: 0%;
  },
  stepItem: {
    marginLeft: SPACING.md,
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    top: -5,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary.main,
    marginRight: SPACING.sm,
    marginTop: 8,
  },
  ingredientText: {
    // flex: 1,
    textAlign: 'left',
  },
  ingredientAmount: {
    color: COLORS.neutral.medium,
  },
  stepText: {
    textAlign: 'left',
    // flex: 1,
  },
});

export default RecipeScreen;
