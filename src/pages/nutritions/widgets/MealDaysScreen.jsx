import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { useSnackbar } from '~/core/hooks/useSnackbar';
import { COLORS, SPACING, BORDER_RADIUS, FONT_FAMILY, FONT_SIZES } from '~/core/styles/theme';
import MealService from '~/pages/nutritions/api/meals.service';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { Typo } from '~/shared/ui/typo';

const MealDaysScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mealTypeId, dietId, title } = route.params || {};
  const { showSnackbar } = useSnackbar();
  const [availableDays, setAvailableDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanDays = async () => {
      try {
        setLoading(true);
        const days = await MealService.getPlanDays(dietId);
        setAvailableDays(days);
      } catch (error) {
        showSnackbar('Не удалось загрузить дни питания', 'error');
        console.error('Error fetching plan days:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDays();
  }, [dietId]);

  const handleDaySelection = async (day) => {
    try {
      const recipe = await MealService.getMealRecipe(dietId, day, mealTypeId);
      navigation.navigate('RecipeScreen', {
        recipe,
        dietId,
        mealTypeId,
        day,
      });
    } catch (error) {
      showSnackbar('Не удалось загрузить рецепт', 'error');
      console.error('Error fetching meal recipe:', error);
    }
  };

  const renderDaysGrid = () => {
    const dayPairs = [];
    for (let i = 0; i < availableDays.length; i += 2) {
      dayPairs.push(availableDays.slice(i, i + 2));
    }

    return dayPairs.map((pair, index) => (
      <View key={index} style={styles.dayRow}>
        {pair.map((day) => (
          <TouchableOpacity
            key={day}
            style={styles.dayButton}
            onPress={() => handleDaySelection(day)}
            disabled={loading}>
            <Typo variant="body1" align="center">
              {day}-й день
            </Typo>
          </TouchableOpacity>
        ))}
        {pair.length === 1 && <View style={styles.emptyCell} />}
      </View>
    ));
  };

  return (
    <ScreenTransition>
      <ScreenBackground
        title={title}
        titleStyle={styles.titleStyle}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.daysContainer}>
              {loading ? (
                <Typo variant="body1" align="center">
                  Загрузка...
                </Typo>
              ) : (
                renderDaysGrid()
              )}
            </View>
          </ScrollView>
        </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingBottom: 80, // Отступ для нижней навигации
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  daysContainer: {
    paddingTop: SPACING.md,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  dayButton: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
  },
  emptyCell: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  titleStyle: {
    fontSize: FONT_SIZES.xxxl,
    fontFamily: FONT_FAMILY.accent.regular,
  },
});

export default MealDaysScreen;
