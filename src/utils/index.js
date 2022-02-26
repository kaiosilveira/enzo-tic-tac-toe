export const checkForWinningMove = (playedSymbol, board) => {
  const FIRST_ROW = { name: 'first_row', positions: [0, 1, 2] };
  const SECOND_ROW = { name: 'second_row', positions: [3, 4, 5] };
  const THIRD_ROW = { name: 'third_row', positions: [6, 7, 8] };
  const FIRST_COL = { name: 'first_col', positions: [0, 3, 6] };
  const SECOND_COL = { name: 'second_col', positions: [1, 4, 7] };
  const THIRD_COL = { name: 'third_col', positions: [2, 5, 8] };
  const BACKWARD_DIAGONAL = { name: 'backward_diagonal', positions: [2, 4, 6] };
  const FORWARD_DIAGONAL = { name: 'forward_diagonal', positions: [0, 4, 8] };

  const sequenceHasFullMatch = (sequence, board, playedSymbol) =>
    sequence.map(v => board[v]).every(i => i === playedSymbol);

  return [
    FIRST_ROW,
    SECOND_ROW,
    THIRD_ROW,
    FIRST_COL,
    SECOND_COL,
    THIRD_COL,
    BACKWARD_DIAGONAL,
    FORWARD_DIAGONAL,
  ].find(s => sequenceHasFullMatch(s.positions, board, playedSymbol));
};

export const isPartOfWinningSequence = (winner, position) => {
  return !!winner.sequence.name && winner.sequence.positions.includes(position);
};

export const hasAnyAvailableMove = board => board.some(v => v === '');