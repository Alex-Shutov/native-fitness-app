import React from 'react';
import { ActivityIndicator, TouchableOpacity, StyleSheet, Text } from "react-native";

import THEME from '../../../core/styles/theme';
import Typo from "~/shared/ui/typo";

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'outlined':
        return styles.outlined;
      case 'text':
        return styles.text;
      default:
        return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outlined':
        return styles.outlinedText;
      case 'text':
        return styles.textOnlyText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={!disabled && !loading ? onPress : null}
      activeOpacity={disabled ? 1 : 0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? THEME.colors.neutral.white : THEME.colors.primary.main}
          size="small"
        />
      ) : (
        <Typo variant="body2" style={[styles.text, getTextStyle(), textStyle]}>{title}</Typo>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.xxl,


  },
  primary: {
    backgroundColor: THEME.colors.primary.dark,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: THEME.colors.neutral.light,
    borderWidth: 0,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.primary.dark,
  },
  text: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    textAlign: 'center',
    paddingLeft:24,
    paddingRight:24
  },
  small: {
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    minWidth: 80,
  },
  medium: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    minWidth: 240,
  },
  large: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    minWidth: 160,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: THEME.colors.neutral.white,
  },
  secondaryText: {
    color: THEME.colors.neutral.darkest,
  },
  outlinedText: {
    color: THEME.colors.primary.main,
  },
  textOnlyText: {
    color: THEME.colors.primary.main,
  },
  smallText: {
    fontSize: THEME.fontSizes.sm,
  },
  mediumText: {
    fontSize: THEME.fontSizes.md,
  },
  largeText: {
    fontSize: THEME.fontSizes.lg,
  },
});

export default Button;
