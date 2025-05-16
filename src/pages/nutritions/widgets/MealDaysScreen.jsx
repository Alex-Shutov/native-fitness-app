import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import { getPlanDays } from '~/pages/nutritions/lib/utils';

const MealDaysScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mealTypeId, dietId, title } = route.params || {};

  // Получаем все доступные дни для выбранного плана
  const availableDays = getPlanDays(dietId);

  const handleDaySelection = (day) => {
    // Навигация к экрану с рецептом для выбранного дня и типа приема пищи
    navigation.navigate('RecipeScreen', {
      dietId,
      mealTypeId,
      day,
    });
  };

  // Создаем сетку из дней (2 колонки)
  const renderDaysGrid = () => {
    // Разбиваем все дни на пары (для отображения в 2 колонки)
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
          >
            <Typo variant="body1" align="center">
              {day}-й день
            </Typo>
          </TouchableOpacity>
        ))}
        {/* Если в паре только один день, добавляем пустую ячейку для сохранения сетки */}
        {pair.length === 1 && <View style={styles.emptyCell} />}
      </View>
    ));
  };

  return (
    <ScreenTransition>
      <ScreenBackground title={title}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.daysContainer}>
              {renderDaysGrid()}
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
});

export default MealDaysScreen;