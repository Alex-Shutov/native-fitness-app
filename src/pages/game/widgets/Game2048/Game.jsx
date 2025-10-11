import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Board from './Board';
import { GameOverModal, GameWonModal } from './Modals';
import {
  moveLeft, moveRight, moveUp, moveDown, addRandomTile,
  checkForWin, checkForGameOver
} from '../../lib/boardUtils';
import { useSwipeHandler } from '~/pages/game/lib/useSwipeHandler';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import {Typo}from '~/shared/ui/typo';
import Theme, { SPACING } from '~/core/styles/theme';
import InfoCard from '~/widgets/InfoCard/InfoCard';
import { useNavigation } from '@react-navigation/native';

const Game2048 = () => {
  const navigation = useNavigation();

  const [board, setBoard] = useState(() => {
    let initialBoard = [
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    ];
    initialBoard = addRandomTile(initialBoard);
    return addRandomTile(initialBoard);
  });

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const restartGame = () => {
    let newBoard = [
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    ];
    newBoard = addRandomTile(newBoard);
    setBoard(addRandomTile(newBoard));
    setScore(0); // Reset the score
    setGameOver(false);
    setGameWon(false);
  };

  const closeGame = () => {
    navigation.goBack()
  }

  const handleMove = useCallback((direction) => {
    let newBoard;
    const updateScore = (points) => setScore(prevScore => prevScore + points);

    const previousBoard = JSON.parse(JSON.stringify(board));

    switch (direction) {
      case 'left':
        newBoard = moveLeft(board, updateScore);
        break;
      case 'right':
        newBoard = moveRight(board, updateScore);
        break;
      case 'up':
        newBoard = moveUp(board, updateScore);
        break;
      case 'down':
        newBoard = moveDown(board, updateScore);
        break;
      default:
        return; // Ignore other directions
    }

    const boardsAreDifferent = (board1, board2) => {
      return board1.some((row, rowIndex) =>
        row.some((tile, colIndex) => tile.value !== board2[rowIndex][colIndex].value)
      );
    };

    if (boardsAreDifferent(previousBoard, newBoard)) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);

      if (checkForWin(newBoard)) {
        setGameWon(true);
      } else if (checkForGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board]);

  const gestureHandler = useSwipeHandler(handleMove);

  return (
    <ScreenTransition>
      <ScreenBackground showHeader={true} title={<Typo variant={'subtitle1'} style={styles.screenHeader}>2048</Typo>} >
    <PanGestureHandler onHandlerStateChange={gestureHandler}>

      <View style={styles.container}>
        <View style={styles.headerContainer}>

        </View>
        <View style={styles.cards}>
        {/*<Text style={styles.score}>Счет {score}</Text>*/}
        <InfoCard label={'Счет'} value={
          <Typo variant={'body0'}>{score}</Typo>
        }/>

        </View>


        <Board board={board} />
        <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
          <Typo variant={'body0'} style={styles.buttonText}>Перезапустить</Typo>
        </TouchableOpacity>

        <GameOverModal visible={gameOver} onRestart={restartGame} onClose={closeGame} />
        <GameWonModal visible={gameWon} onRestart={restartGame} onClose={closeGame} />
      </View>
    </PanGestureHandler>
      </ScreenBackground>
    </ScreenTransition>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 136, // Отступ для нижней навигации

  },
  screenHeader:{
    fontSize: SPACING.xl * 1.5 ,
    lineHeight: SPACING.xl * 2.2,
  },
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  header: {
    fontSize: SPACING.xl * 1.5,
    lineHeight: SPACING.xl * 1.8,
  },
  cards:{
    gap:12,
    flexDirection: 'row',
  },
  restartButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#FAFBFD',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    color: '#2A2A34',
    fontWeight: 'bold',
    fontSize:Theme.fontSizes.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    marginVertical: 10,
  },
});

export default Game2048;