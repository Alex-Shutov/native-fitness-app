import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRecoilState } from 'recoil';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { authState } from '~/pages/auth/models/auth.atom';
import Button from '~/shared/ui/button';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import { DietOptionCard } from '~/widgets/OptionCard/OptionCard';

// Создаём константу с вариантами питания
const DIET_OPTIONS = [
  {
    id: 'regular',
    title: 'Обычная',
    subtitle: 'Любая еда',
    image: require('src/shared/assets/images/regular.png'), // Замените на фактический путь
    imageFocus: { x: 0.5, y: 0.55 },
    transformX:-100,
    transformY:-80,
  },
  {
    id: 'vegetarian',
    title: 'Вегетарианская',
    subtitle: 'Без мяса и рыбы',
    image: require('src/shared/assets/images/vegeterian.png'), // Замените на фактический путь
    imageFocus: { x: 0.25, y: 0.5 },
    transformX:-100,
    transformY:-80,
  },
  {
    id: 'lactose-free',
    title: 'Безмолочная',
    subtitle: 'Без молочных продуктов',
    image: require('src/shared/assets/images/no-milk.png'), // Замените на фактический путь
    imageFocus: { x: 0.25, y: 0.35 },
    transformX:-100,
    transformY:-80,
  }
];

const DietSelectionScreen = () => {
  const navigation = useNavigation();
  const [auth, setAuth] = useRecoilState(authState);

  // Состояние для выбранного варианта питания
  const [selectedDiet, setSelectedDiet] = useState(auth.diet || null);

  // Обработчик выбора варианта питания
  const handleDietSelection = (dietId) => {
    console.log(dietId);
    setSelectedDiet(dietId);
  };

  // Обработчик нажатия кнопки "Иду к цели"
  const handleContinue = () => {
    // Обновляем данные в хранилище
    setAuth((prevState) => ({
      ...prevState,
      diet: selectedDiet,
    }));

    // Переходим на следующий экран
    navigation.navigate('TabHome'); // Замените на фактический экран
  };

  return (
    <ScreenTransition>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Какого питания вы придерживаетесь?
            </Typo>
            <Typo variant="body1" style={styles.subtitle}>
              Выбери один вариант
            </Typo>
          </View>

          <View style={styles.optionsContainer}>
            {DIET_OPTIONS.map((option) => (
              <DietOptionCard
                transformY={option.transformY ?? 0}
                transformX={option.transformX ?? 0}
                imageFocus={option.imageFocus}
                key={option.id}
                title={option.title}
                subtitle={option.subtitle}
                image={option.image}
                isSelected={selectedDiet === option.id}
                onPress={() => handleDietSelection(option.id)}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Иду к цели"
              style={styles.button}
              loading={false}
              onPress={handleContinue}
              disabled={!selectedDiet}
            />
          </View>
        </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  headerContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  header: {
    fontSize: SPACING.xl * 1.2,
    lineHeight: SPACING.xl * 1.3,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    paddingTop: SPACING.md,
    marginBottom: -SPACING.md,
    color: COLORS.neutral.dark,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: SPACING.xl,
  },

  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: SPACING.md,
  },
  button: {
    width: '100%',
    alignSelf: 'center',
  },
});

export default DietSelectionScreen;