import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import Theme, { COLORS, SPACING } from '../../../core/styles/theme';

import {Typo}from '~/shared/ui/typo';

const ToggleGoalButton = ({
  title,
  icon,
  isSelected = false,
  onPress,
  style,
  disabled = false,
                            inGrid=true,
  variant,
  textStyle,
}) => {
  const renderContent = () => (
    <View style={styles.contentContainer}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typo
        variant="body2"
        color={COLORS.neutral.darkest}
        style={[styles.text, textStyle, inGrid && { fontSize: title.length > 18 ? 12 : 14 }]}

        numberOfLines={3}
        // allowFontScaling={true}
        adjustsFontSizeToFit={true}
        // minimumFontScale={0.8}
      >
        {title}
      </Typo>
    </View>
  );

  if (isSelected) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        style={[styles.button, style]}>
        <LinearGradient
          colors={[COLORS.primary.lightSecond, COLORS.neutral.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.1, y: 0 }}
          style={styles.gradient}>
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // If not selected, show regular button
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, styles.unselectedButton, style]}>
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    height: 74,
    display: 'flex',
    justifyContent: 'center',
  },
  gradient: {
    paddingVertical: SPACING.sm * 1.5,
    paddingHorizontal: SPACING.lg,
  },
  unselectedButton: {

    backgroundColor: COLORS.neutral.light,
    paddingVertical: SPACING.sm * 1.5,

    paddingHorizontal: SPACING.lg,
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    textAlign: 'center',
    height: '100%',
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  text: {
    paddingVertical: SPACING.sm,
    textAlignVertical: 'top',
    lineHeight: 14,

    textAlign: 'left',
  },
});

export default ToggleGoalButton;
