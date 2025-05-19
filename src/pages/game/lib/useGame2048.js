import { useState, useEffect } from 'react';

// Направления движения
const DIRECTIONS = {
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down',
  LEFT: 'left',
};

// Функция для генерации начального состояния игры
const getInitialTiles = () => {
  // Создаем пустую доску 4x4
  const tiles = Array(4).fill().map(() => Array(4).fill(0));

  // Добавляем первые две плитки
  return addRandomTile(addRandomTile(tiles));
};

// Функция для добавления случайной плитки (2 или 4)
const addRandomTile = (tiles) => {
  const newTiles = JSON.parse(JSON.stringify(tiles));
  const emptyTiles = [];

  // Находим все пустые ячейки
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (newTiles[i][j] === 0) {
        emptyTiles.push({ row: i, col: j });
      }
    }
  }

  // Если пустых ячеек нет, возвращаем доску без изменений
  if (emptyTiles.length === 0) return newTiles;

  // Выбираем случайную пустую ячейку
  const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

  // С вероятностью 90% добавляем 2, с вероятностью 10% добавляем 4
  newTiles[row][col] = Math.random() < 0.9 ? 2 : 4;

  return newTiles;
};

// Функция для проверки возможности хода
const canMoveTiles = (tiles) => {
  // Проверяем наличие пустых ячеек
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (tiles[i][j] === 0) return true;
    }
  }

  // Проверяем возможность слияния соседних ячеек
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const currentValue = tiles[i][j];

      // Проверяем ячейку справа
      if (j < 3 && tiles[i][j + 1] === currentValue) return true;

      // Проверяем ячейку снизу
      if (i < 3 && tiles[i + 1][j] === currentValue) return true;
    }
  }

  return false;
};

// Функция для проверки победы (достигнуто ли число 2048)
const checkWin = (tiles) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (tiles[i][j] === 2048) return true;
    }
  }
  return false;
};

// Функция для движения плиток в определенном направлении
const moveTiles = (tiles, direction, updateScore) => {
  let newTiles = JSON.parse(JSON.stringify(tiles));
  let scoreIncrement = 0;
  let hasChanged = false;

  const rotateLeft = (matrix) => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push([]);
      for (let j = 0; j < 4; j++) {
        result[i][j] = matrix[j][3 - i];
      }
    }
    return result;
  };

  const rotateRight = (matrix) => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push([]);
      for (let j = 0; j < 4; j++) {
        result[i][j] = matrix[3 - j][i];
      }
    }
    return result;
  };

  // Получаем правильную ориентацию для движения влево
  if (direction === DIRECTIONS.UP) {
    newTiles = rotateLeft(newTiles);
  } else if (direction === DIRECTIONS.RIGHT) {
    newTiles = rotateRight(rotateRight(newTiles));
  } else if (direction === DIRECTIONS.DOWN) {
    newTiles = rotateRight(newTiles);
  }

  // Двигаем и объединяем плитки по строкам
  for (let i = 0; i < 4; i++) {
    const row = newTiles[i].filter(tile => tile !== 0); // Убираем нули
    const newRow = [];

    // Объединяем одинаковые соседние плитки
    for (let j = 0; j < row.length; j++) {
      if (j < row.length - 1 && row[j] === row[j + 1]) {
        const mergedValue = row[j] * 2;
        newRow.push(mergedValue);
        scoreIncrement += mergedValue;
        j++; // Пропускаем следующую плитку
      } else {
        newRow.push(row[j]);
      }
    }

    // Дополняем строку нулями до длины 4
    while (newRow.length < 4) {
      newRow.push(0);
    }

    // Проверяем, изменилась ли строка
    if (JSON.stringify(newTiles[i]) !== JSON.stringify(newRow)) {
      hasChanged = true;
    }

    newTiles[i] = newRow;
  }

  // Возвращаем доску в исходную ориентацию
  if (direction === DIRECTIONS.UP) {
    newTiles = rotateRight(newTiles);
  } else if (direction === DIRECTIONS.RIGHT) {
    newTiles = rotateRight(rotateRight(newTiles));
  } else if (direction === DIRECTIONS.DOWN) {
    newTiles = rotateLeft(newTiles);
  }

  // Обновляем счет
  if (scoreIncrement > 0 && updateScore) {
    updateScore(scoreIncrement);
  }

  return { tiles: newTiles, hasChanged };
};

// Основной хук для игры
export const useGame = () => {
  const [tiles, setTiles] = useState(getInitialTiles());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'game-over'

  // Обработчик хода
  const move = (direction) => {
    if (gameState !== 'playing') return;

    const updateScore = (increment) => {
      setScore(prevScore => {
        const newScore = prevScore + increment;
        if (newScore > bestScore) {
          setBestScore(newScore);
        }
        return newScore;
      });
    };

    const { tiles: newTiles, hasChanged } = moveTiles(tiles, direction, updateScore);

    if (hasChanged) {
      const tilesWithNewTile = addRandomTile(newTiles);
      setTiles(tilesWithNewTile);

      // Проверяем победу
      if (checkWin(tilesWithNewTile)) {
        setGameState('won');
      }
      // Проверяем проигрыш
      else if (!canMoveTiles(tilesWithNewTile)) {
        setGameState('game-over');
      }
    }
  };

  // Сброс игры
  const resetGame = () => {
    setTiles(getInitialTiles());
    setScore(0);
    setGameState('playing');
  };

  // Продолжение игры после победы
  const continueGame = () => {
    if (gameState === 'won') {
      setGameState('playing');
    }
  };

  return {
    tiles,
    score,
    bestScore,
    gameState,
    move,
    resetGame,
    continueGame,
    DIRECTIONS,
  };
};

// Хук для обнаружения свайпов
export const useSwipe = (onSwipe) => {
  const [touchStart, setTouchStart] = useState(null);

  const onTouchStart = (e) => {
    setTouchStart({
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    });
  };

  const onTouchEnd = (e) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    // Определяем направление свайпа
    if (Math.abs(dx) > Math.abs(dy)) {
      // Горизонтальный свайп
      if (Math.abs(dx) > 30) { // Минимальное расстояние для определения свайпа
        onSwipe(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
      }
    } else {
      // Вертикальный свайп
      if (Math.abs(dy) > 30) {
        onSwipe(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
      }
    }

    setTouchStart(null);
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};

// Цветовая тема для плиток
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