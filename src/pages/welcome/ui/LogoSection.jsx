import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import AnimatedView from '../../../shared/ui/animation/AnimatedView';
import Logo from '../../../shared/ui/logo';

import { SPACING } from '~/core/styles/theme';

const LogoSection = ({ duration, logoStyle }) => {
  return (
    <View style={styles.topSection}>
      <AnimatedView animation="fade" duration={duration}>
        <Animated.View style={logoStyle}>
          <Logo size="large" />
        </Animated.View>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.lg,
  },
});

export default LogoSection;
