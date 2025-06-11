// src/pages/profile/PersonalCabinetScreen.jsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRecoilState } from 'recoil';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { updateProfileField } from '~/pages/profile/api/profile.api';
import { profileState } from '~/pages/profile/model/profille.state';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';
import ParamInput from '~/widgets/paramInput/ParamInput';
import { useGoals } from '~/pages/onboarding/lib/useGoals';

const PersonalCabinetScreen = () => {
  const [profile, setProfile] = useRecoilState(profileState);
  const [loading, setLoading] = useState({});
  const { goals, loading: goalsLoading, updateGoal } = useGoals();

// Обработка изменения цели
  const handleGoalChange = async (value) => {
    try {
      // Находим выбранную цель в списке
      const selectedGoal = goals.find(g => g.value === value);

      if (selectedGoal) {
        // Обновляем цель на сервере
        await updateGoal(selectedGoal);

        // Обновляем профиль в локальном состоянии
        setProfile(prev => ({
          ...prev,
          goal: value,
        }));
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  // Prepare options for select inputs
  const genderOptions = [
    { value: 'Мужской', label: 'Мужской' },
    { value: 'Женский', label: 'Женский' }
  ];

  // Transform goalsData to the format needed for select options
  const goalOptions = goals.map(goal => ({
    value: goal.value,
    label: goal.value
  }));

  const handleUpdateField = async (fieldName, value) => {
    setLoading((prev) => ({ ...prev, [fieldName]: true }));
    try {
      await updateProfileField(fieldName, value);
      setProfile((prev) => ({ ...prev, [fieldName]: value }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Could show an error message to the user here
    } finally {
      setLoading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

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
              <Image source={profile.image} style={styles.profileImage} />
              <View style={styles.nameWrapper}>
                <View style={styles.nameContainer}>
                  <Typo variant="body1" color="white">
                    {profile.name}
                  </Typo>
                </View>
              </View>
            </View>

            {/* Weight and Goal Stats */}
            <View style={{...styles.card,paddingTop: SPACING.xl,}}>
              <View style={styles.row}>
                <ParamInput
                  label="Текущий вес"
                  value={profile.currentWeight}
                  onChangeText={(value) => handleUpdateField('currentWeight', value)}
                  keyboardType="numeric"
                />
                <ParamInput
                  label="Желаемый вес"
                  value={profile.targetWeight}
                  onChangeText={(value) => handleUpdateField('targetWeight', value)}
                  keyboardType="numeric"
                />
                {/* Goal as Select */}
                <ParamInput
                  label="Цель"
                  value={profile.goal}
                  onChangeText={handleGoalChange}
                  isSelect={true}
                  options={goalOptions}
                />
              </View>
            </View>

            {/* Demographics */}
            <View style={styles.card}>
              <View style={styles.row}>
                <ParamInput
                  label="Возраст"
                  value={profile.age}
                  onChangeText={(value) => handleUpdateField('age', value)}
                  keyboardType="numeric"
                />
                {/* Gender as Select */}
                <ParamInput
                  label="Пол"
                  value={profile.gender}
                  onChangeText={(value) => handleUpdateField('gender', value)}
                  isSelect={true}
                  options={genderOptions}
                />
                <ParamInput
                  label="Рост"
                  value={profile.height}
                  onChangeText={(value) => handleUpdateField('height', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Contact Info */}
            <View style={styles.card}>
              <View style={styles.row}>
                <ParamInput
                  label={'Телефон'}
                  value={profile.phone}
                  onChangeText={(value) => handleUpdateField('phone', value)}
                />
                <ParamInput
                  label={'Почта'}
                  value={profile.email}
                  onChangeText={(value) => handleUpdateField('email', value)}
                />
              </View>
            </View>

            {/* Add bottom padding to avoid content being hidden behind navbar */}
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
    marginBottom: SPACING.sm
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
    zIndex:5,
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
    // marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactLabel: {
    marginBottom: SPACING.xs,
    color: COLORS.neutral.medium,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
});

export default PersonalCabinetScreen;