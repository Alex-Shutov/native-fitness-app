import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '~/core/styles/theme';
import { MEAL_TYPES, getMealTypeById } from '../lib/utils';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import { useRecoilValue } from 'recoil';
import { authState } from '~/pages/auth/models/auth.atom';
import { DietOptionCard } from '~/widgets/OptionCard/OptionCard';

const MealCategoriesScreen = () => {
  const navigation = useNavigation();
  const auth = useRecoilValue(authState);

  // Получаем информацию о выбранном плане питания из authState
  const nutritionPlan = getMealTypeById(auth.diet);
  const daysCount = nutritionPlan?.days || 14;

  const handleMealTypeSelection = (mealTypeId) => {
    // Получаем информацию о типе приема пищи
    const mealType = MEAL_TYPES.find(type => type.id === mealTypeId);

    // Навигация к экрану с выбором дня
    navigation.navigate('MealDaysScreen', {
      mealTypeId,
      dietId: auth.diet,
      title: mealType?.title || '',
    });
  };

  return (
    <ScreenTransition>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Питание на {daysCount} дней
            </Typo>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {MEAL_TYPES.map((mealType) => (
              <DietOptionCard
                key={mealType.id}
                title={mealType.title}
                subtitle=""
                image={mealType.image}
                isSelected={false}
                onPress={() => handleMealTypeSelection(mealType.id)}
              />
            ))}
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
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  header: {
    fontSize: SPACING.xl * 1.5,
    lineHeight: SPACING.xl * 1.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl, // Дополнительный отступ снизу
  },
});

export default MealCategoriesScreen;