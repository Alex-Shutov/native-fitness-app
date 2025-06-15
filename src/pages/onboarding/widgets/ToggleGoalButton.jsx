import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import Theme, { COLORS, SPACING } from '../../../core/styles/theme';

import Typo from '~/shared/ui/typo';

const ToggleGoalButton = ({
  title,
  icon,
  isSelected = false,
  onPress,
  style,
  disabled = false,
  variant,
  textStyle,
}) => {
  // Render different styles based on selection state
  const renderContent = () => (
    <View style={styles.contentContainer}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typo
        variant="body2"
        weight="medium"
        color={COLORS.neutral.darkest}
        style={[styles.text, textStyle]}
        numberOfLines={2}>
        {title}
      </Typo>
    </View>
  );

  // If selected, show gradient background
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
    height: 48,
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
    lineHeight: 10,

    textAlign: 'left',
  },
});

export default ToggleGoalButton;
