import React from 'react';
import { Text, StyleSheet } from 'react-native';

import Theme from '../../../core/styles/theme';

const Typo = ({
  children,
  color,
  style,
  variant = 'body1',
  weight = 'regular',
  align = 'center',
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'subtitle1':
        return styles.subtitle1;
      case 'subtitle2':
        return styles.subtitle2;
      case 'body1':
        return styles.body1;
      case 'body2':
        return styles.body2;
      case 'caption':
        return styles.caption;
      default:
        return styles.body1;
    }
  };

  const getWeightStyle = () => {
    switch (weight) {
      case 'regular':
        return styles.regular;
      case 'medium':
        return styles.medium;
      case 'bold':
        return styles.bold;
      default:
        return styles.regular;
    }
  };

  const getAlignStyle = () => {
    switch (align) {
      case 'left':
        return styles.left;
      case 'center':
        return styles.center;
      case 'right':
        return styles.right;
      default:
        return styles.left;
    }
  };

  const getColorStyle = () => {
    if (!color) return {};
    return { color };
  };

  return (
    <Text
      style={[
        styles.base,
        getVariantStyle(),
        getWeightStyle(),
        getAlignStyle(),
        getColorStyle(),
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: Theme.colors.neutral.darkest,
  },
  h1: {
    fontSize: Theme.fontSizes.xxxl,
    lineHeight: Theme.fontSizes.xxxl * 1.2,
  },
  h2: {
    fontSize: Theme.fontSizes.xxl,
    lineHeight: Theme.fontSizes.xxl * 1.2,
  },
  h3: {
    fontSize: Theme.fontSizes.xl,
    lineHeight: Theme.fontSizes.xl * 1.2,
  },
  subtitle1: {
    fontSize: Theme.fontSizes.lg,
    lineHeight: Theme.fontSizes.lg * 1.3,
  },
  subtitle2: {
    fontSize: Theme.fontSizes.md,
    lineHeight: Theme.fontSizes.md * 1.3,
  },
  body1: {
    fontSize: Theme.fontSizes.md,
    lineHeight: Theme.fontSizes.md * 1.5,
  },
  body2: {
    fontSize: Theme.fontSizes.sm,
    lineHeight: Theme.fontSizes.sm * 1.5,
  },
  caption: {
    fontSize: Theme.fontSizes.xs,
    lineHeight: Theme.fontSizes.xs * 1.5,
  },

  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
  },

  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});

export default Typo;
