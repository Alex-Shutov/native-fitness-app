import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const tileColors = {
  0: { backgroundColor: '#EFF2E9', color: '#776E65' },
  2: { backgroundColor: '#E7EDE3', color: '#776E65' },
  4: { backgroundColor: '#D3E4C5', color: '#776E65' },
  8: { backgroundColor: '#C2D6A9', color: '#FFFFFF' },
  16: { backgroundColor: '#A4D65E', color: '#FFFFFF' },
  32: { backgroundColor: '#8FC93A', color: '#FFFFFF' },
  64: { backgroundColor: '#7AB648', color: '#FFFFFF' },
  128: { backgroundColor: '#5A9C28', color: '#FFFFFF' },
  256: { backgroundColor: '#4E9525', color: '#FFFFFF' },
  512: { backgroundColor: '#3B7A1A', color: '#FFFFFF' },
  1024: { backgroundColor: '#2E6513', color: '#FFFFFF' },
  2048: { backgroundColor: '#224E0D', color: '#FFFFFF' },
  other: { backgroundColor: '#1A3E09', color: '#FFFFFF' },
};
const Tile = ({ value, isNew, isCombined }) => {
  // Dynamically determine tile color based on value
  const getTileColor = (value) => {
    switch (value) {
      case 2:
        return '#E7EDE3';
      case 4:
        return '#D3E4C5';
      case 8:
        return '#C2D6A9';
      case 16:
        return '#A4D65E';
      case 32:
        return '#8FC93A';
      case 64:
        return '#7AB648';
      case 128:
        return '#4E9525';
      case 256:
        return '#3B7A1A';
      case 512:
        return '#2E6513';
      case 1024:
        return '#224E0D';
      case 2048:
        return '#1A3E09';
      default:
        return '#E8FFDA'; // For empty tiles
    }
  };

  const getFontColor = (value) => {
      switch (value) {
        case 2:
        case 4:
          return '#776E65';
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
          return '#FFFFFF'
        default:
          return '#FFFFFF'
      }
  }

  return (
    <View style={[styles.tile, { backgroundColor: getTileColor(value) }]}>
      {value > 0 && <Text style={[styles.tileText,{color: getFontColor(value)}]}>{value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 12,
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#776e65',
  },
});

export default Tile;