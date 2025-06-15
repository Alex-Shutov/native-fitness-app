import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRecoilState } from 'recoil';

import { useSnackbar } from '~/core/hooks/useSnackbar';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { authState } from '~/pages/auth/models/auth.atom';
import { DIET_OPTIONS } from '~/pages/onboarding/models/diet.model';
import profileApi from '~/pages/profile/api/profile.api'; // Предполагается, что у вас есть API клиент
import Button from '~/shared/ui/button';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import { DietOptionCard } from '~/widgets/OptionCard/OptionCard';

const DietSelectionScreen = () => {
  const navigation = useNavigation();
  const [auth, setAuth] = useRecoilState(authState);
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDiet, setSelectedDiet] = useState(auth.diet || null);

  const handleDietSelection = (dietId) => {
    console.log(dietId);
    setSelectedDiet(dietId);
  };

  const handleContinue = async () => {
    console.log(selectedDiet,'diet');
    if (selectedDiet===null) return;
    showSnackbar('Подождите...', 'info');
    setIsLoading(true);
    console.log(123123123);
    try {
      // Подготавливаем данные для отправки
      const profileData = {
        age: auth.age,
        weight: auth.weight,
        height: auth.height,
        gender: auth.gender,
        targetWeight: auth.targetWeight,
        chestCircumference: auth.chestCircumference,
        waistCircumference: auth.waistCircumference,
        hipCircumference: auth.hipCircumference,
        diet: selectedDiet,
      };
      console.log(profileData,'data');
      // Отправляем данные на сервер
      const upgradedMe = await profileApi.updateProfile(profileData);
      console.log(upgradedMe,'me');
      // Обновляем локальное состояние
      setAuth((prevState) => ({
        ...prevState,
        ...upgradedMe,
        diet: selectedDiet,
      }));

      // Показываем уведомление об успехе
      showSnackbar('Данные успешно обновлены', 'success');

      // Переходим на следующий экран
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      showSnackbar('Не удалось обновить данные', 'error');
    } finally {
      setIsLoading(false);
    }
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
              loading={isLoading}
              onPress={handleContinue}
              disabled={selectedDiet===null}
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
