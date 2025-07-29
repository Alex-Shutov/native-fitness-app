import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Theme, { COLORS, FONT_FAMILY, SPACING } from '../../../core/styles/theme';
import AnimatedView from '../../../shared/ui/animation/AnimatedView';
import {Typo}from '../../../shared/ui/typo/typo';
import AdvantagesView from './AdvantagesView';

const DescriptionSection = ({ duration, delay, children, handleAboutApp, hasWatchedVideo }) => {
  return (
    <>
      <View style={styles.middleSection}>
        <AnimatedView animation="fade" duration={duration} delay={delay}>
          <Typo variant="body2"  align="center" style={styles.title}>
            Стройность{' '}
            <Typo variant="hSub"   color={COLORS.primary.main}>
              навсегда
            </Typo>
          </Typo>


        </AnimatedView>
        <AnimatedView animation="fade" duration={duration} >
          <Typo variant="body0" align="center" style={styles.subtitle}>
            через мышление
          </Typo>
        </AnimatedView>
          <AdvantagesView delay={delay} duration={duration}></AdvantagesView>
        {hasWatchedVideo && (
          <AnimatedView animation="fade" duration={duration} delay={delay * 5}>
          <TouchableOpacity onPress={handleAboutApp}>
            <Typo
              style={{
                color: COLORS.primary,
                textDecorationLine: 'underline',
                marginBottom: SPACING.md,
                marginTop: SPACING.md
              }}
            >
              О чем это приложение?
            </Typo>
          </TouchableOpacity>
          </AnimatedView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  middleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  title: {
    width: '100%',
    fontSize: Theme.fontSizes.xxl,
    lineHeight: Theme.fontSizes.xxxl * 1.5,
    fontWeight: 'bold',
    marginBottom: -SPACING.xl,
  },
  accent:{
    fontFamily: FONT_FAMILY.header.regular,
    fontSize: Theme.fontSizes.xxxl*1.2,
    lineHeight: Theme.fontSizes.xxxl*1.2,
  },
  subtitle: {
    marginBottom: SPACING.sm,
  },
});

export default DescriptionSection;
