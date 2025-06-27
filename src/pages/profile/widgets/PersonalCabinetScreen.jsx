// src/pages/profile/PersonalCabinetScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRecoilState } from 'recoil';

import { useSnackbar } from '~/core/hooks/useSnackbar';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { authState } from '~/pages/auth/models/auth.atom';
import { useGoals } from '~/pages/onboarding/lib/useGoals';
import ProfileApi from '~/pages/profile/api/profile.api';
import { blobToBase64 } from '~/pages/profile/lib/utils';
import AvatarSkeleton from '~/pages/profile/widgets/AvatarSkeleton';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { Typo } from '~/shared/ui/typo';
import ParamInput from '~/widgets/paramInput/ParamInput';

const PersonalCabinetScreen = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [loading, setLoading] = useState({});
  const { goals, loading: goalsLoading, updateGoal } = useGoals();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const { showSnackbar } = useSnackbar();

  const [tempValues, setTempValues] = useState(auth);
  const goalValue = useMemo(
    () => goals.find((el) => el.id === Number(auth.goal))?.value,
    [auth.goal]
  );
  console.log(goalValue, auth.goal, 'vaule');
  const handleGenderChange = async (value) => {
    const genderValue = value === 'Мужской' ? 'male' : 'female';
    await handleUpdateField('gender', genderValue);
  };
  // Обработчик изменения временных значений
  const handleTempChange = (fieldName, value) => {
    debugger
    setTempValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        setAvatarLoading(true);
        const blob = await ProfileApi.getAvatar();

        if (blob) {
          const base64 = await blobToBase64(blob);
          setAvatarBase64(base64);
        }
      } catch (error) {
        console.error('Failed to load avatar:', error);
      } finally {
        setAvatarLoading(false);
      }
    };

    loadAvatar();
  }, []);

  const handleBlur = async (fieldName) => {
    const value = tempValues[fieldName];
    if (value === String(auth[fieldName] ?? '')) return;

    setLoading((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const updateData = {
        [fieldName]: fieldName === 'gender' ? value : Number(value) || 0,
      };

      const updated = await ProfileApi.updateProfile(updateData);

      setAuth((prev) => ({
        ...prev,
        ...updated,
      }));

      showSnackbar('Данные успешно обновлены', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showSnackbar('Ошибка при обновлении данных', 'error');

      // Возвращаем предыдущее значение при ошибке
      setTempValues((prev) => ({
        ...prev,
        [fieldName]: String(auth[fieldName] ?? ''),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Требуется разрешение', 'Нужно разрешение для доступа к фотографиям');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (pickerResult.canceled) return;

      setAvatarLoading(true);
      const file = pickerResult.assets[0];

      // Загружаем на сервер
      await ProfileApi.uploadAvatar(file);

      // Обновляем локальное состояние
      if (file.base64) {
        setAvatarBase64(`data:${file.type};base64,${file.base64}`);
      }

      showSnackbar('Аватар успешно обновлен', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showSnackbar('Ошибка при обновлении аватара', 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleGoalChange = async (value) => {
    try {
      const selectedGoal = goals.find((g) => g.value === value);
      if (selectedGoal) {
        // Получаем ID цели (предполагаем, что в selectedGoal есть id)
        const goalId = selectedGoal.id;

        // Обновляем цель на бэкенде
        await ProfileApi.updateProfile({ goal: goalId });

        // Обновляем локальное состояние
        setAuth((prev) => ({
          ...prev,
          goal: goalId,
        }));

        showSnackbar('Цель успешно обновлена', 'success');
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
      showSnackbar('Ошибка при обновлении цели', 'error');
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
  ];

  const goalOptions = goals.map((goal) => ({
    value: goal.value,
    label: goal.value,
  }));

  const handleUpdateField = async (fieldName, value) => {
    setLoading((prev) => ({ ...prev, [fieldName]: true }));
    try {
      // Подготавливаем данные для отправки
      const updateData = { [fieldName]: fieldName === 'gender' ? value : Number(value) || 0 };

      // Отправляем на сервер
      await ProfileApi.updateProfile(updateData);

      // Обновляем локальное состояние
      setAuth((prev) => ({
        ...prev,
        ...updateData,
      }));

      showSnackbar('Данные успешно обновлены', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showSnackbar('Ошибка при обновлении данных', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // Преобразуем gender для отображения
  const displayGender = auth.gender === 'male' ? 'Мужской' : 'Женский';

  return (
    <ScreenTransition>
      <ScreenBackground showHeader={false} hasBackButton={false}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Typo variant="hSub" style={styles.title}>
              Личный кабинет
            </Typo>

            {/* Profile Image */}
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={handlePickImage}>
                {avatarLoading ? (
                  <AvatarSkeleton style={styles.profileImage} />
                ) : (
                  <Image
                    source={
                      avatarBase64
                        ? { uri: avatarBase64 }
                        : require('~/shared/assets/images/profile.png')
                    }
                    style={styles.profileImage}
                    // onLoadStart={() => setAvatarLoading(true)}
                    // onLoadEnd={() => setAvatarLoading(false)}
                    onError={() => {
                      setAvatarLoading(false);
                      setAvatarBase64(null);
                    }}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.nameWrapper}>
                <View style={styles.nameContainer}>
                  <Typo variant="body1" color="white">
                    {auth.user?.username || 'Пользователь'}
                  </Typo>
                </View>
              </View>
            </View>

            {/* Weight and Goal Stats */}
            <View style={{ ...styles.card, paddingTop: SPACING.xl }}>
              <View style={styles.row}>
                <ParamInput
                  label="Текущий вес"
                  value={String(tempValues.weight ?? '--')}
                  onChangeText={(value) => handleTempChange('currentWeight', value)}
                  onBlur={() => handleBlur('currentWeight')}
                  keyboardType="numeric"
                />
                <ParamInput
                  label="Желаемый вес"
                  value={String(tempValues.targetWeight ?? '--')}
                  onChangeText={(value) => handleTempChange('targetWeight', value)}
                  onBlur={() => handleBlur('targetWeight')}
                  keyboardType="numeric"
                />
                <ParamInput
                  label="Цель"
                  value={goalValue}
                  onChangeText={handleGoalChange}
                  onBlur={() => handleBlur('goal')}
                  isSelect
                  options={goalOptions}
                />
              </View>
            </View>

            {/* Demographics */}
            <View style={styles.card}>
              <View style={styles.row}>
                <ParamInput
                  label="Возраст"
                  value={String(tempValues.age ?? '--')}
                  onChangeText={(value) => handleTempChange('age', value)}
                  onBlur={() => handleBlur('age')}
                  keyboardType="numeric"
                />
                <ParamInput
                  label="Пол"
                  value={displayGender}
                  onChangeText={handleGenderChange}
                  isSelect
                  options={genderOptions.map((opt) => ({ ...opt, value: opt.label }))}
                />
                <ParamInput
                  label="Рост"
                  value={String(tempValues.height ?? '--')}
                  onChangeText={(value) => handleTempChange('height', value)}
                  onBlur={() => handleBlur('height')}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Contact Info - если нужно оставить */}
            {tempValues.user?.email && (
              <View style={styles.card}>
                <View style={styles.row}>
                  <ParamInput label="Почта" value={tempValues.user.email} editable={false} />
                </View>
              </View>
            )}

            <View style={{ height: 80 }} />
          </ScrollView>
        </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    marginVertical: SPACING.lg,
  },
  profileContainer: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  profileImage: {
    borderRadius: 16,
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  nameWrapper: {
    position: 'absolute',
    bottom: -25,
    zIndex: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nameContainer: {
    backgroundColor: COLORS.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    minWidth: 200,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PersonalCabinetScreen;
