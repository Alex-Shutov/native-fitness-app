import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Theme, { COLORS, FONT_FAMILY, SPACING } from '../../../core/styles/theme';
import AnimatedView from '../../../shared/ui/animation/AnimatedView';
import { Typo } from '../../../shared/ui/typo/typo';
import AdvantagesView from './AdvantagesView';
import { BorderlessButton } from 'react-native-gesture-handler';
import Button from '../../../shared/ui/button';

const DescriptionSection = ({ duration, delay, children, handleAboutApp, hasWatchedVideo }) => {
  return (
    <>
      <View style={styles.middleSection}>
        <AnimatedView animation="fade" duration={duration} delay={delay}>
          <View style={styles.titleRow}>
            <Typo variant="hSub" align="center" style={styles.titleMain}>
              Стройность
            </Typo>
            <Typo color={COLORS.primary.main} variant="hSub" align="center" >
              {' '}навсегда
            </Typo>
          </View>
        </AnimatedView>

        <AnimatedView animation="fade" duration={duration}>
          <Typo variant="body0" align="center" style={styles.subtitle}>
            через мышление
          </Typo>
        </AnimatedView>

        <AdvantagesView delay={delay} duration={duration} />

        <AnimatedView animation="fade" duration={duration} delay={delay * 4}>
          <Button
            onPress={handleAboutApp}
            fullWidth={true}
            textStyle={{ color: 'gray' }}
            variant={'outlined'}
            title={'О чем это приложение ▶️'}
          />
        </AnimatedView>
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

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  titleMain: {
    fontSize: Theme.fontSizes.xxl,
    lineHeight: Theme.fontSizes.xxxl * 1.2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleAccent: {
    fontFamily: FONT_FAMILY.header.regular,
    fontSize: Theme.fontSizes.xxxl * 1.1,
    lineHeight: Theme.fontSizes.xxxl * 1.2,
    color: COLORS.primary.main,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: SPACING.sm,
    fontSize: Theme.fontSizes.lg,
  },
});

export default DescriptionSection;
