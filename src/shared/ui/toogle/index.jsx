import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {Typo}from '../typo/typo';
import { BORDER_RADIUS, COLORS, SPACING } from '~/core/styles/theme';

const Toggle = ({
                  options = [],
                  selectedIndex = 0,
                  onSelect,
                  style
                }) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedIndex === index && styles.selectedOption,
            index === 0 && styles.firstOption,
            index === options.length - 1 && styles.lastOption,
          ]}
          onPress={() => onSelect(index)}
          activeOpacity={0.7}
        >
          <Typo
            variant="body1"
            color={selectedIndex === index ? COLORS.neutral.darkest : COLORS.neutral.medium}
            weight={selectedIndex === index ? 'medium' : 'regular'}
          >
            {option}
          </Typo>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    paddingHorizontal:8,
    paddingVertical:6
  },
  option: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
    // borderTopRightRadius: BORDER_RADIUS.sm,
    // borderBottomRightRadius: BORDER_RADIUS.sm,

  },
  selectedOption: {
    backgroundColor: COLORS.page.background,

  },
  firstOption: {

  },
  lastOption: {

  },
});

export default Toggle;