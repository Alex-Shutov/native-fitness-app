import React from 'react';
import { View, StyleSheet } from 'react-native';

import { COLORS, SPACING } from '../../../core/styles/theme';
import AnimatedView from '../../../shared/ui/animation/AnimatedView';
import Typo from '../../../shared/ui/typo';
import AdvantagesView from "~/pages/welcome/ui/AdvantagesView";

const DescriptionSection = ({ duration, delay, children }) => {
  return (
    <>
      <View style={styles.middleSection}>
        <AnimatedView animation="fade" duration={duration} delay={delay}>
          <Typo variant="h2" weight="bold" align="center" style={styles.title}>
            Стройность{' '}
            <Typo variant="h2" weight="bold" color={COLORS.primary.main}>
              навсегда
            </Typo>
          </Typo>
        </AnimatedView>
        <AnimatedView animation="fade" duration={duration} delay={delay * 1.5}>
          <Typo variant="body1" align="center" style={styles.subtitle}>
            через мышление
          </Typo>
        </AnimatedView>
          <AdvantagesView delay={delay} duration={duration}></AdvantagesView>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  middleSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginBottom: SPACING.xs,
  },
  subtitle: {
    marginBottom: SPACING.sm,
  },
});

export default DescriptionSection;
