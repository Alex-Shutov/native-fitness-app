import React from 'react';
import Typo from '~/shared/ui/typo';
import { BORDER_RADIUS, COLORS, FONT_FAMILY, SPACING } from '~/core/styles/theme';
import { TextInput, View, StyleSheet } from 'react-native';

const ParamInput = ({ label, value, onChangeText, placeholder = '--' }) => {
  return (
    <View style={styles.parameterInputWrapper}>
      <Typo variant="caption" color={COLORS.neutral.medium} style={styles.parameterLabel}>
        {label}
      </Typo>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.parameterInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral.medium}
        />
        {/*<Typo variant="body1" style={styles.inputUnit}>см</Typo>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parameterInputWrapper: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: COLORS.primary.extraLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 48,
  },
  parameterInput: {
    // flex: 1,
    fontFamily: FONT_FAMILY.text.bold,
    fontSize: SPACING.md * 1.2,
    color: COLORS.primary.dark,
    fontWeight: 900,
    padding: 0,
    margin: 0,
  },
  inputUnit: {
    color: COLORS.neutral.medium,
    marginLeft: SPACING.xs,
  },
  parameterLabel: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
})

export default ParamInput;