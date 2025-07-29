import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import AnimatedView from '../../../shared/ui/animation/AnimatedView';

import { SPACING } from '~/core/styles/theme';
import Logo from '../../../shared/ui/logo';

const LogoSection = ({ duration, logoStyle }) => {
  return (
    <View style={styles.topSection}>
      <AnimatedView animation="fade" duration={duration}>
        <Animated.View style={logoStyle}>
          <Logo size="large" title={'СтройнаЯ'}/>
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
    marginBottom: SPACING.xxl,
    // top:-40
  },
});

export default LogoSection;
