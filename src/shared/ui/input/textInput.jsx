import React from 'react';
import { TextInput, ScrollView, StyleSheet, View, Dimensions, Platform } from 'react-native';

import Theme, { COLORS, SPACING } from '~/core/styles/theme';
import { Typo } from '~/shared/ui/typo';

const { height } = Dimensions.get('window');

const ScrollableTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  style,
  error,
  ...props
}) => {
  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
      // style={styles.scrollView}>
      >
        {label && (
          <Typo variant="body1" style={styles.label}>
            {label}
          </Typo>
        )}
        <TextInput
          style={[styles.input, error && styles.errorInput, style]}
          multiline
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={COLORS.neutral.medium}
          {...props}
        />
      </ScrollView>
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
    width: '100%',
    flex: 1,
    ...(Platform.OS === 'web'
      ? { maxHeight: '60vh' }
      : { maxHeight: height * 0.6 }),
  },
  label: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingBottom: 'auto',
    // marginBottom: SPACING.sm,
    textAlign: 'left',
  },
  scrollView: {
    // flexGrow:1,
    flex: 1,
    // minHeight: 200,
    // height: '100%',
    backgroundColor: COLORS.neutral.white,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  scrollViewContent: {

    backgroundColor: COLORS.neutral.white,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    flexGrow: 3,
  },
  input: {
    flex: 1,
    // minHeight: 100, // Minimum height
    height: 'max',
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontFamily: Theme.fontFamily.text.regular,
    fontSize: Theme.fontSizes.md,
    color: COLORS.neutral.darkest,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: COLORS.functional.error,
  },
  errorText: {
    color: COLORS.functional.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.md,
  },
});

export default ScrollableTextInput;
