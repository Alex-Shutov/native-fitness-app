import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useRecoilState } from 'recoil';

import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import { COLORS, FONT_FAMILY, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Button from '~/shared/ui/button';
import ProgressBar from '~/pages/onboarding/widgets/ProgressBar';
import {Typo}from '~/shared/ui/typo';
import ProfileApi from '../profile/api/profile.api';
import InfoModal from '../../widgets/modal/InfoModal';
import { authState } from '../auth/models/auth.atom';
import { MaterialIcons } from '@expo/vector-icons';



const OnBoardProgressScreen = ({ route }) => {
  const navigation = useNavigation();
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const [auth,setAuth] = useRecoilState(authState);
  const [progress, setProgress] = useState(onboarding.currentProgress || 5); // по дефолту на середине
  const [loading, setLoading] = useState(false);
  const { goalId, goalDescription, fromProfile } = route.params || {};
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setTimeout(()=>setVisible(true),50);
  };

  const handleClose = () => {
    setTimeout(()=>setVisible(false),50);

  };
  const handleContinue = async () => {
    if (fromProfile) {
      // Если пришли из профиля, отправляем данные на сервер
      setLoading(true);
      try {
        const updateData = {
          goal: goalId,
          goalDescription,
          currentProgress: progress
        };

        const updated = await ProfileApi.updateProfile(updateData);
        // Обновляем локальное состояние
        setAuth((prev) => ({
          ...prev,
          ...updated
        }));


        setShowSuccessModal(true);
      } catch (error) {
        console.error('Failed to update profile:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Стандартное поведение для onboarding
      setOnboarding((prev) => ({
        ...prev,
        currentProgress: progress,
        currentStep: prev.currentStep + 1,
      }));
      navigation.navigate('PersonalInfoScreen');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigation.navigate('MainScreen')
  }


  return (
    <ScreenTransition>
      <ScreenBackground headerRight={
        <TouchableWithoutFeedback onPress={handleOpen}>

          <MaterialIcons
            name="help-outline"
            size={24}
            color={COLORS.neutral.dark}
          />
        </TouchableWithoutFeedback>
      }>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
          <Typo variant="hSub" style={styles.header}>На каком этапе ты находишься</Typo>
          <Typo variant="body1" style={styles.subheader}>На текущий момент</Typo>
          </View>
          <ProgressBar progress={progress} setProgress={setProgress} />
          <View style={styles.divider}/>
          <View style={styles.buttonContainer}>
            <Button
              title="Иду к цели"
              onPress={handleContinue}
              style={styles.button}
            />
          </View>
        </View>
        <InfoModal
          visible={showSuccessModal}
          title="Успешно!"
          text="Данные вашей цели были обновлены"
          onClose={handleCloseModal}
        />
        <View style={styles.container}>
          <InfoModal
            text={'На данном этапе вам необходимо оценить себя - на сколько вы близки к вашей цели!'}
            visible={visible}
            onClose={handleClose}
            title={'Подсказка!'}
          />
        </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  header: {
    fontSize: SPACING.xl*1.4,
    lineHeight: SPACING.xl*1.4,
  },
  subheader: {
    color: COLORS.neutral.dark,
  },
  divider:{
    display: 'flex',
    flexGrow:2
  },
  buttonContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  button: {
    width: '70%',
    backgroundColor: COLORS.primary.main,
  },
});

export default OnBoardProgressScreen;
