import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {Typo}from '~/shared/ui/typo';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '~/core/styles/theme';

const InfoCard = ({label,value,onPress,innerStyles={}}) => {
  return (
    <TouchableOpacity
      style={styles.storeButton}
      onPress={onPress}
    >
    <View style={[styles.balanceContainer]}>
      <View style={[styles.balanceCard,innerStyles]}>
        <Typo variant="body1">{label}</Typo>
        {value}
      </View>

    </View>
    </TouchableOpacity>
  );
};

const styles =  StyleSheet.create({
  storeButton: {
    backgroundColor: COLORS.neutral.white,
    flex:1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: SPACING.xl,
  },
  balanceCard: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.md,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
})

export default InfoCard;