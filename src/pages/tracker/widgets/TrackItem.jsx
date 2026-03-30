import React from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { Typo } from '~/shared/ui/typo';
import { getCurrentWeekdayIndex, getTrackCompletionPercentage, isFutureDay } from '~/pages/tracker/lib/utils';
import Svg, { Circle } from 'react-native-svg';
import CheckIcon from '~/shared/ui/icons/CheckIcon';
import CrossIcon from '~/shared/ui/icons/CrossIcon';
import { isTodayOrTomorrow, isTodayOrYesterday } from '../lib/utils';

const TrackItem = ({
  track,
  onStatusChange,
  onPress,
  weekdays, // получаем дни недели
}) => {
  const { width, fontScale } = useWindowDimensions();
  const isTabletLayout = width >= 768;
  const completionPercentage = getTrackCompletionPercentage(track);
  const currentDayIndex = getCurrentWeekdayIndex();
  const isLowerLayout = width <= 415
  const isCompactLayout = width <= 380 || fontScale > 1.15;
  const isVeryCompactLayout = width <= 340 || fontScale > 1.3;
  const isUltraCompactLayout = width <= 320 || fontScale > 1.45;
  const dayButtonSize = isTabletLayout ? 24 : isUltraCompactLayout ? 16 : isVeryCompactLayout ? 18 : isCompactLayout ? 22 : 24;
  const dayButtonSpacing = isTabletLayout ? 4 : isUltraCompactLayout ? 1 : isVeryCompactLayout ? 2 : isCompactLayout ? 3 : isLowerLayout ? 3 : 4;
  const iconSize = isTabletLayout ? 22 : isUltraCompactLayout ? 14 : isVeryCompactLayout ? 16 : isCompactLayout ? 18 : 24;
  const progressSize = isTabletLayout ? 28 : isUltraCompactLayout ? 20 : isVeryCompactLayout ? 24 : isCompactLayout ? 28 : 32;
  const progressStrokeWidth = isTabletLayout ? 3 : isUltraCompactLayout ? 2.5 : isVeryCompactLayout ? 3 : 4;
  const progressMarginRight = isTabletLayout ? SPACING.md : isUltraCompactLayout ? SPACING.xs : SPACING.sm;
  const daysRowWidth = weekdays.length * (dayButtonSize + dayButtonSpacing * 2);
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
      <View style={[styles.progressCircleWrapper, { marginRight: progressMarginRight }]}>
        <Svg width={progressSize} height={progressSize} viewBox="0 0 24 24">
          <Circle
            cx="12"
            cy="12"
            r={radius}
            stroke={COLORS.neutral.light}
            strokeWidth={progressStrokeWidth}
            fill="transparent"
          />
          <Circle
            cx="12"
            cy="12"
            r={radius}
            stroke={COLORS.primary.main}
            strokeWidth={progressStrokeWidth}
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
      const isTodayOrYesterdayValue = isTodayOrYesterday(index, currentDayIndex);
      return (
        <TouchableOpacity
          disabled={!isTodayOrYesterdayValue}

          key={index}
          style={[
            styles.dayButton,
            {
              width: dayButtonSize,
              height: dayButtonSize,
              marginHorizontal: dayButtonSpacing,
            },
          ]}
          onPress={() => handleStatusToggle(index, !track.completionStatus[index])}>
          {track.completionStatus[index] ? (
            <CheckIcon color={COLORS.primary.main} size={iconSize} />
          ) : (
            <CrossIcon color={!isTodayOrYesterdayValue ? COLORS.neutral.dark : COLORS.neutral.medium} size={iconSize} />
          )}
        </TouchableOpacity>
      );
    });
  };
  return (
    <TouchableOpacity
      style={[styles.container, isTabletLayout && styles.containerTablet]}
      onPress={() => onPress && onPress(track)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        {renderProgressCircle()}
        <Typo
          style={styles.title}
          variant="body1"
          weight="medium">
          {track.title}
        </Typo>
        {/* Добавляем галочки в этот же row */}
        <View style={[styles.daysRow, isTabletLayout ? { width: daysRowWidth } : styles.daysRowPhone]}>{renderDayButtons()}</View>
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
    zIndex: 0
  },
  containerTablet: {
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    textAlign: 'left',
    paddingRight: SPACING.sm,
    lineHeight: SPACING.md,
    paddingTop: SPACING.sm,
    position: 'relative',
    zIndex: 0
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 0
  },
  daysRow: {
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 'auto', // Выравниваем по правому краю
    position: 'relative',
    zIndex: 0
  },
  daysRowPhone: {
    width: '47%',
  },
  dayButton: {
    width: 24,
    height: 24,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 0
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
  disabled: {

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