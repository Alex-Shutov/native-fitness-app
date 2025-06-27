import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';

import Theme, { COLORS, SPACING } from '../../../core/styles/theme';

import {Typo}from '~/shared/ui/typo';

const Input = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightIcon,
  onRightIconPress,
  style,
  error,
  ...props
}) => {
  // Function to render the left icon
  const renderLeftIcon = () => {
    if (!icon) return null;

    // If icon is a React element, return it directly
    if (React.isValidElement(icon)) {
      return <View style={styles.iconContainer}>{icon}</View>;
    }

    // If icon is a string that looks like a URL
    if (typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('https'))) {
      return (
        <View style={styles.iconContainer}>
          <Image source={{ uri: icon }} style={styles.iconImage} />
        </View>
      );
    }

    // If icon is a string but not a URL, it could be a local image require or Material icon name
    if (typeof icon === 'string') {
      return (
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={icon}
            size={24}
            color={error ? COLORS.functional.error : COLORS.neutral.medium}
          />
        </View>
      );
    }

    // If icon is a number (from require('./path/to/image'))
    if (typeof icon === 'number') {
      return (
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.iconImage} />
        </View>
      );
    }

    return null;
  };

  // Function to render the right icon
  const renderRightIcon = () => {
    if (!rightIcon) return null;

    // If rightIcon is a React element, return it directly
    if (React.isValidElement(rightIcon)) {
      return <View style={styles.rightIconContainer}>{rightIcon}</View>;
    }

    // Specific case for visibility toggle
    if (rightIcon === 'visibility') {
      return (
        <TouchableOpacity style={styles.rightIconContainer} onPress={onRightIconPress}>
          <MaterialIcons
            name={secureTextEntry ? 'visibility' : 'visibility-off'}
            size={24}
            color={COLORS.neutral.medium}
          />
        </TouchableOpacity>
      );
    }

    // If rightIcon is a string that looks like a URL
    if (
      typeof rightIcon === 'string' &&
      (rightIcon.startsWith('http') || rightIcon.startsWith('https'))
    ) {
      return (
        <TouchableOpacity style={styles.rightIconContainer} onPress={onRightIconPress}>
          <Image source={{ uri: rightIcon }} style={styles.iconImage} />
        </TouchableOpacity>
      );
    }

    if (typeof rightIcon === 'string') {
      return (
        <TouchableOpacity style={styles.rightIconContainer} onPress={onRightIconPress}>
          <MaterialIcons name={rightIcon} size={24} color={COLORS.neutral.medium} />
        </TouchableOpacity>
      );
    }

    // If rightIcon is a number (from require('./path/to/image'))
    if (typeof rightIcon === 'number') {
      return (
        <TouchableOpacity style={styles.rightIconContainer} onPress={onRightIconPress}>
          <Image source={rightIcon} style={styles.iconImage} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={style}>
      <View style={[styles.container, error && styles.error]}>
        {renderLeftIcon()}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={COLORS.neutral.medium}
          {...props}
        />

        {renderRightIcon()}
      </View>

      {error && (
        <Typo variant="caption" style={styles.errorText}>
          {error}
        </Typo>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderRadius: Theme.borderRadius.sm,
    // paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  error: {
    borderColor: COLORS.functional.error,
  },
  iconContainer: {
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  rightIconContainer: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {

    paddingLeft:16,
    flex: 1,
    fontFamily: Theme.fontFamily.text.regular,
    fontSize: Theme.fontSizes.md,
    color: COLORS.neutral.darkest,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  errorText: {
    color: COLORS.functional.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.md,
  },
});

export default Input;
