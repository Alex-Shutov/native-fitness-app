import React, { useEffect, useState } from 'react';
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
import { useSnackbar } from '~/core/hooks/useSnackbar';
import MealService from '~/pages/nutritions/api/meals.service';

const MealCategoriesScreen = () => {
  const navigation = useNavigation();
  const auth = useRecoilValue(authState);
  const { showSnackbar } = useSnackbar();
  const [mealTypes, setMealTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealTypes = async () => {
      try {
        setLoading(true);
        // Предполагаем, что у нас есть метод для получения типов питания
        const types = await MealService.getMealTypes();
        setMealTypes(types);
      } catch (error) {
        showSnackbar('Не удалось загрузить типы питания', 'error');
        console.error('Error fetching meal types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealTypes();
  }, []);

  const handleMealTypeSelection = (mealTypeId) => {
    const mealType = mealTypes.find(type => type.id === mealTypeId);
    navigation.navigate('MealDaysScreen', {
      mealTypeId,
      dietId: auth.diet??1,
      title: mealType?.title || '',
    });
  };

  return (
    <ScreenTransition>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Питание на 14 дней
            </Typo>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Typo variant="body1">Загрузка...</Typo>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {mealTypes.map((mealType) => (
                <DietOptionCard
                  key={mealType.id}
                  title={mealType.title}
                  // subtitle={mealType.description}
                  image={mealType.image}
                  isSelected={false}
                  onPress={() => handleMealTypeSelection(mealType.id)}
                />
              ))}
            </ScrollView>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: SPACING.xl, // Дополнительный отступ снизу
  },
});

export default MealCategoriesScreen;