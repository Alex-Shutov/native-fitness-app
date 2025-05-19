import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import Typo from '~/shared/ui/typo';
import { LinearGradient } from 'expo-linear-gradient';

const SemiCircleGauge = ({
                           progress,
                           minValue,
                           maxValue,
                           currentValue,
                           remainingText,
                           valueLabel,
                           unit = '',
                         }) => {
  // SVG dimensions and parameters - important for correct semi-circle shape
  const width = 250;
  const height = 125; // Increased slightly to fit full semi-circle
  const strokeWidth = 16;
  const radius = width / 2 - strokeWidth;
  const centerX = width / 2;
  const centerY = height - strokeWidth / 2;

  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress || 0, 0), 1);

  // Draw the arc paths - using SVG arc commands
  // M = move to, A = arc
  const backgroundArc = `
    M ${strokeWidth}, ${centerY}
    A ${radius}, ${radius} 0 0 1 ${(width - strokeWidth)+0}, ${centerY}
  `;

  // Calculate the endpoint of the progress arc based on the progress percentage
  const endAngle = Math.PI * normalizedProgress;
  const endX = centerX + Math.cos(Math.PI - endAngle) * radius;
  const endY = centerY - Math.sin(endAngle) * radius;

  const progressArc = `
    M ${strokeWidth}, ${centerY}
    A ${radius}, ${radius} 0 ${normalizedProgress > 0.5 ? 0 : 0} 1 ${endX}, ${endY}
  `;

  // Create a gradient of colors for the progress
  const getProgressColor = () => {
    // Define a set of colors from light to dark green based on the progress
    const colorScale = [
      '#E0F5C2', // Lightest (0%)
      '#CDEBAC',
      '#BCE196',
      '#A8D484',
      '#96C971',
      '#83B85D',
      '#6FAA54',
      '#609349',
      '#547E3D',
      '#486935'  // Darkest (100%)
    ];

    // Calculate the index in the color scale based on progress
    const index = Math.min(Math.floor(normalizedProgress * 10), 9);
    return colorScale[index];
  };

  return (
    <View style={styles.gaugeContainer}>
      {/* Remaining text */}
      <Typo variant="caption" color={COLORS.primary.main} style={styles.remainingText}>
        {remainingText || `Осталось ${100 - Math.round(normalizedProgress * 100)}%`}
      </Typo>

      {/* SVG Gauge */}
      <View style={styles.gaugeSvg}>
      <Svg width={width} height={height+20} viewBox={`0 0 ${width} ${height+20}`}>
        {/* Background semi-circle */}
        <Path
          d={backgroundArc}
          stroke={COLORS.neutral.light}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <Path
          d={progressArc}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Add decorative circles at the ends */}
        {/*<Circle*/}
        {/*  cx={strokeWidth}*/}
        {/*  cy={centerY}*/}
        {/*  r={strokeWidth / 2}*/}
        {/*  fill={COLORS.neutral.light}*/}
        {/*/>*/}
        {/*<Circle*/}
        {/*  cx={width - strokeWidth}*/}
        {/*  cy={centerY}*/}
        {/*  r={strokeWidth / 2}*/}
        {/*  fill={COLORS.neutral.light}*/}
        {/*/>*/}

        {/* Min value label */}
        <SvgText
          x={strokeWidth}
          y={height+20} // Смещаем вниз на 20 пикселей
          fontSize="14"
          fill={COLORS.neutral.medium}
          textAnchor="start"
        >
          {minValue}{unit}
        </SvgText>

        {/* Max value label */}
        <SvgText
          x={width - strokeWidth}
          y={height + 20} // Смещаем вниз на 20 пикселей
          fontSize="14"
          fill={COLORS.neutral.medium}
          textAnchor="end"
        >
          {maxValue}{unit}
        </SvgText>

      </Svg>
      </View>

      {/* Current value box */}
      <View style={styles.valueContainer}>
        <Typo style={{marginBottom:2}} variant={'caption'}>Прогресс</Typo>
      <LinearGradient
        colors={[COLORS.primary.lightSecond, COLORS.neutral.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.1, y: 0 }}
        style={styles.gradient}>
        <View style={styles.valueBox}>
          <Typo variant="body1" weight="bold" color={COLORS.neutral.dark}>
            {currentValue}{unit}
          </Typo>
        </View>
      </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    width: '100%',
  },
  gaugeSvg: {
    // paddingBottom: SPACING.xl, // Добавляем отступ после SVG
    // marginBottom :SPACING.md,

  },
  remainingText: {
    textAlign: 'center',
    color: COLORS.primary.main,
  },
  valueBox: {
    position: 'static',
    bottom: 0,
    left: 0,
    top: 0,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    alignSelf: 'center',
  },
  gradient: {

    // left: '50%',
    // top: 100,
    borderRadius:16,
  },
  valueContainer:{
    position: 'absolute',
    // top: 0,
    bottom: 20,
  }
});

export default SemiCircleGauge;