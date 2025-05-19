import React from 'react';
import { View, StyleSheet } from 'react-native';
import Tile from './Tile';

const Board = ({ board }) => {
  return (
    <View style={styles.boardContainer}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              value={tile.value}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    marginTop: 20,
    width: '100%',
    // height: '100%',
    backgroundColor: '#FAFBFD',
    justifyContent: 'center',
    borderRadius:12,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Board;