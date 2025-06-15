import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '~/core/styles/theme';

const AvatarSkeleton = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.skeleton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral.light,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  skeleton: {
    backgroundColor: COLORS.neutral.medium,
    width: '100%',
    height: '100%'
  }
});

export default AvatarSkeleton;