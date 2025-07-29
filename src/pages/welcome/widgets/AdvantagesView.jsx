import React from 'react';
import { View, StyleSheet } from 'react-native';

import { COLORS, SPACING } from '../../../core/styles/theme';
import AnimatedView from '../../../shared/ui/animation/AnimatedView';
import {Typo}from '../../../shared/ui/typo/typo';

const AdvantagesView = ({ duration, delay }) => {
  return (
    <View style={styles.benefitsContainer}>
      <AnimatedView animation="slide" duration={duration} delay={duration * 1}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            {/* Иконка "Научная основа" */}
            <Typo variant="body2" color={COLORS.primary.main}>
              🔬
            </Typo>
          </View>
          <Typo variant="body2">Научная основа</Typo>
        </View>
      </AnimatedView>

      <AnimatedView animation="slide" duration={duration} delay={delay * 2}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            {/* Иконка "Игровой формат" */}
            <Typo variant="body2" color={COLORS.primary.main}>
              🎮
            </Typo>
          </View>
          <Typo variant="body2">Игровой формат</Typo>
        </View>
      </AnimatedView>

      <AnimatedView animation="slide" duration={duration} delay={delay * 3}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIcon}>
            {/* Иконка "Легкое похудение" */}
            <Typo variant="body2" color={COLORS.primary.main}>
              💪
            </Typo>
          </View>
          <Typo variant="body2">Легкое похудение</Typo>
        </View>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  benefitsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: SPACING.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
});

export default AdvantagesView;
