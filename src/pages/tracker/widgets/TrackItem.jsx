import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import {Typo}from '~/shared/ui/typo';
import { getCurrentWeekdayIndex, getTrackCompletionPercentage, isFutureDay } from '~/pages/tracker/lib/utils';
import Svg, { Circle } from 'react-native-svg';
import CheckIcon from '~/shared/ui/icons/CheckIcon';
import CrossIcon from '~/shared/ui/icons/CrossIcon';
import { isTodayOrTomorrow } from '../lib/utils';

const TrackItem = ({
                     track,
                     onStatusChange,
                     onPress,
                     weekdays, // получаем дни недели
                   }) => {
  const completionPercentage = getTrackCompletionPercentage(track);
  const currentDayIndex = getCurrentWeekdayIndex();
  const handleStatusToggle = (dayIndex, status) => {
    if (onStatusChange) {
      onStatusChange(track.id, dayIndex, status);
    }
  };

  const renderProgressCircle = () => {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

    return (
      <View style={styles.progressCircleWrapper}>
        <Svg width={36} height={36} viewBox="0 0 24 24">
          <Circle
            cx="12"
            cy="12"
            r={radius}
            stroke={COLORS.neutral.light}
            strokeWidth="4"
            fill="transparent"
          />
          <Circle
            cx="12"
            cy="12"
            r={radius}
            stroke={COLORS.primary.main}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 12 12)"
          />
        </Svg>
      </View>
    );
  };

  const renderDayButtons = () => {
    return weekdays.map((day, index) => {
      // const isFuture = isFutureDay(index, currentDayIndex);
      const isTodayOrTomorrowValue = isTodayOrTomorrow(index, currentDayIndex);
      return (
        <TouchableOpacity
          disabled={!isTodayOrTomorrowValue}

          key={index}
          style={styles.dayButton}
          onPress={() => handleStatusToggle(index, !track.completionStatus[index])}>
          {track.completionStatus[index] ? (
            <CheckIcon color={COLORS.primary.main} size={24} />
          ) : (
            <CrossIcon color={!isTodayOrTomorrowValue ? COLORS.neutral.dark : COLORS.neutral.medium} size={24} />
          )}
        </TouchableOpacity>
      );
    });
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(track)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        {renderProgressCircle()}
        <Typo style={styles.title} variant="body1" weight="medium">
          {track.title}
        </Typo>
        {/* Добавляем галочки в этот же row */}
        <View style={styles.daysRow}>{renderDayButtons()}</View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral.offWhite,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    paddingRight: SPACING.xs,
    position: 'relative',
    zIndex:0
  },
  title:{
    flexShrink:30,

    textAlign:'left',
    paddingRight:SPACING.md,
    lineHeight: SPACING.md,
    paddingTop: SPACING.sm,
    position: 'relative',
    zIndex:0
  },
  header: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex:0
  },
  daysRow: {
    width:'47%',
    flexShrink:1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 'auto', // Выравниваем по правому краю
    position: 'relative',
    zIndex:0
  },
  dayButton: {
    width: 24,
    height: 24,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex:0
  },

  statusIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18, // Увеличим немного размер символов
  },
  checkmarkText: {
    color: COLORS.primary.main,
  },
  crossText: {
    color: COLORS.neutral.medium,
  },
  progressCircleWrapper: {
    marginRight: SPACING.md,
  },
  progressCircleContainer: {
    position: 'relative',
    width: 24,
    height: 24,
  },

  progressCircleForeground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabled:{

  },

  progressCircleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: COLORS.neutral.medium,
  },
  progressCircleHalf: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
  },
  progressCircleLeft: {
    left: 0,
  },
  progressCircleRight: {
    right: 0,
  },
  progressCircleHalfInner: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: COLORS.primary.main,
  },
  progressCircleFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: COLORS.primary.main,
  },
});

export default TrackItem;