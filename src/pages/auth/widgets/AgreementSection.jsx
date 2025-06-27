import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import Theme, { COLORS, SPACING } from '../../../core/styles/theme';
import {Typo}from '../../../shared/ui/typo/typo';

const AgreementSection = ({ checked, onCheckboxChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.agreementTextContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} persistentScrollbar>
          <Typo>Соглашение</Typo>
          <Typo variant="body2" color={COLORS.neutral.medium}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </Typo>
        </ScrollView>
      </View>

      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onCheckboxChange(!checked)}
          activeOpacity={0.7}>
          <View style={[styles.checkbox, checked && styles.checkboxSelected]}>
            {checked && <MaterialIcons name="check" size={16} color={COLORS.neutral.white} />}
          </View>
        </TouchableOpacity>

        <Typo variant="body2" style={styles.checkboxLabel}>
          Я принимаю соглашение
        </Typo>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // marginTop: SPACING.md,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  agreementTextContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: Theme.borderRadius.md,
    height: 150,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.neutral.medium,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary.main,
    borderColor: COLORS.primary.main,
  },
  checkboxLabel: {
    color: COLORS.neutral.darkest,
  },
});

export default AgreementSection;
