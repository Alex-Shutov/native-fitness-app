// src/shared/ui/tracker/WeekdaysSelector.jsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { getDayNames, getDayNumbers, getStartOfWeek } from '~/pages/tracker/lib/utils';
import Typo from '~/shared/ui/typo';

const WeekdaysSelector = ({
  selectedDays = [0, 0, 0, 0, 0],
  onDayToggle,
  startDate = getStartOfWeek(),
  readOnly = false,
}) => {
  const dayNames = getDayNames(true);
  const dayNumbers = getDayNumbers(startDate);

  const handleDayPress = (index) => {
    if (readOnly) return;

    if (onDayToggle) {
      const newStatus = selectedDays[index] === 1 ? 0 : 1;
      onDayToggle(index, newStatus);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysRow}>
        {dayNumbers.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayContainer, selectedDays[index] === 1 && styles.selectedDay]}
            onPress={() => handleDayPress(index)}
            disabled={readOnly}>
            <View style={styles.dayContentWrapper}>
              <Typo
                variant="body2"
                style={styles.dayNumber}
                weight={selectedDays[index] === 1 ? 'bold' : 'regular'}>
                {day}
              </Typo>
              <Typo
                variant="caption"
                style={styles.dayName}
                weight={selectedDays[index] === 1 ? 'bold' : 'regular'}>
                {dayNames[index]}
              </Typo>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    width: 50,
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  selectedDay: {
    backgroundColor: COLORS.primary.light,
  },
  dayContentWrapper: {
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: 16,
  },
  dayName: {
    color: COLORS.neutral.medium,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.neutral.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WeekdaysSelector;
