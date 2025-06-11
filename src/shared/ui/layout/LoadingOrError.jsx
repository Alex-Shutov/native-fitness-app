import React from 'react';
import { ScreenTransition } from 'react-native-reanimated';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import { StyleSheet, View } from 'react-native';
import Typo from '~/shared/ui/typo';
import { COLORS, SPACING } from '~/core/styles/theme';

const LoadingOrError = ({loading,error,children}) => {

  if (loading) {
    return (
      <ScreenTransition>
        <ScreenBackground>
          <View style={styles.container}>
            <Typo variant="hSub">Загрузка ...</Typo>
          </View>
        </ScreenBackground>
      </ScreenTransition>
    );
  }
  if (error) {
    return (
      <ScreenTransition>
        <ScreenBackground>
          <View style={styles.container}>
            <Typo variant="hSub" color="error">{error}</Typo>
          </View>
        </ScreenBackground>
      </ScreenTransition>
    );
  }
  return (
    <>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoadingOrError;