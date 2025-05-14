import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder } from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING } from '~/core/styles/theme';

const colorScale = [
  '#486935',
  '#547E3D',
  '#609349',
  '#6FAA54',
  '#83B85D',
  '#96C971',
  '#A8D484',
  '#BCE196',
  '#CDEBAC',
  '#E0F5C2',
];

const ProgressBar = ({ setProgress, progress }) => {
  const containerRef = useRef(null);
  const blockWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleGesture(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleGesture(evt.nativeEvent.locationX),
    })
  ).current;

  const handleGesture = (x) => {
    if (!blockWidth.current) return;

    const index = Math.min(
      9,
      Math.max(0, Math.floor((x / blockWidth.current) * 10))
    );
    setProgress(index + 1);
  };

  return (
    <View style={styles.scaleContainer}>
      <View style={styles.labelsRow}>
        {[...Array(10)].map((_, idx) => (
          <Text key={idx} style={styles.label}>{idx + 1}</Text>
        ))}
      </View>

      <View
        style={styles.progressRow}
        ref={containerRef}
        onLayout={(e) => {
          blockWidth.current = e.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        {[...Array(10)].map((_, i) => {
          const isFilled = i < progress;
          const backgroundColor = isFilled ? colorScale[i] : COLORS.neutral.light;

          return (
            <Pressable
              key={i}
              onPress={() => setProgress(i + 1)}
              style={[styles.progressBlock, { backgroundColor }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scaleContainer: {
    marginHorizontal: SPACING.md,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 12,
    color: COLORS.neutral.dark,
    width: 20,
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    height: 20,
  },
  progressBlock: {
    flex: 1,
    height: '100%',
  },
});

export default ProgressBar;
