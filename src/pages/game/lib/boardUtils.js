export const slideAndCombineRow = (row, updateScore) => {
  let arr = row.filter(tile => tile.value); // Filter out all zeros
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value === arr[i + 1].value) { // Combine equal tiles
      arr[i].value *= 2;
      arr[i].isCombined = true;
      updateScore(arr[i].value); // Update the score with the new tile value
      arr[i + 1].value = 0;
    }
  }
  arr = arr.filter(tile => tile.value); // Filter out zeros again after combination
  return [...arr, ...Array(4 - arr.length).fill({ value: 0, isNew: false, isCombined: false })]; // Pad the rest with zeros
};

export const moveLeft = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  return newBoard.map(row => slideAndCombineRow(row, updateScore));
};

export const moveRight = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  return newBoard.map(row => slideAndCombineRow(row.reverse(), updateScore).reverse());
};

export const moveUp = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  const transposed = transpose(newBoard);
  const moved = transposed.map(row => slideAndCombineRow(row, updateScore));
  return transpose(moved);
};

export const moveDown = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  const transposed = transpose(newBoard);
  const moved = transposed.map(row => slideAndCombineRow(row.reverse(), updateScore).reverse());
  return transpose(moved);
};

export const transpose = (board) => {
  return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
};

export const resetTileStates = (board) => {
  return board.map(row =>
    row.map(tile => ({
      value: tile.value,
      isNew: false,
      isCombined: false,
    }))
  );
};

export const getRandomPosition = (board) => {
  const emptyTiles = [];
  board.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile.value === 0) {
        emptyTiles.push([rowIndex, colIndex]);
      }
    });
  });

  if (emptyTiles.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomIndex];
};

export const addRandomTile = (board) => {
  const position = getRandomPosition(board);
  if (position === null) return board;

  const [row, col] = position;
  const newBoard = [...board];
  newBoard[row][col] = { value: Math.random() < 0.6 ? 2 : 4, isNew: true, isCombined: false };
  return newBoard;
};

export const checkForWin = (board) => {
  for (let row of board) {
    if (row.some(tile => tile.value === 2048)) {
      return true;
    }
  }
  return false;
};

export const checkForGameOver = (board) => {
  for (let row of board) {
    if (row.some(tile => tile.value === 0)) {
      return false; // There are still empty spaces
    }
  }

  // Check for possible merges horizontally and vertically
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length - 1; j++) {
      if (board[i][j].value === board[i][j + 1].value || (board[j] && board[j][i].value === board[j + 1][i].value)) {
        return false;
      }
    }
  }
  return true; // No more moves available
};