import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRecoilState } from 'recoil';

import { onboardingState } from '~/pages/onboarding/models/onboarding.atom';
import { COLORS, FONT_FAMILY, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Button from '~/shared/ui/button';
import ProgressBar from '~/pages/onboarding/widgets/ProgressBar';
import Typo from '~/shared/ui/typo';



const ProgressScreen = () => {
  const navigation = useNavigation();
  const [onboarding, setOnboarding] = useRecoilState(onboardingState);
  const [progress, setProgress] = useState(onboarding.currentProgress || 5); // по дефолту на середине

  const handleContinue = () => {
    setOnboarding((prev) => ({
      ...prev,
      currentProgress: progress,
      currentStep: prev.currentStep + 1,
    }));
    navigation.navigate('PersonalInfoScreen')
  };



  return (
    <ScreenTransition>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
          <Typo variant="hSub" style={styles.header}>На каком этапе ты находишься</Typo>
          <Typo variant="body1" style={styles.subheader}>На текущий момент</Typo>
          </View>
          <ProgressBar progress={progress} setProgress={setProgress} />

          <View style={styles.buttonContainer}>
            <Button
              title="Иду к цели"
              onPress={handleContinue}
              style={styles.button}
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
  buttonContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  button: {
    width: '70%',
    backgroundColor: COLORS.primary.main,
  },
});

export default ProgressScreen;
