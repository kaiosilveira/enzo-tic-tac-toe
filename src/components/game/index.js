import React, { useState } from 'react';
import Square from '../square';
import * as S from './styled';

const SYMBOLS = { X: 'X', O: 'O' };
const INITIAL_BOARD_STATE = new Array(9).fill('');
const INITIAL_WINNER_STATE = {
  sequence: { name: '', positions: [] },
  playedSymbol: '',
  exists: false,
};

const checkForWinningMove = (playedSymbol, board) => {
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

const isPartOfWinningSequence = (winner, position) => {
  return !!winner.sequence.name && winner.sequence.positions.includes(position);
};

const Game = () => {
  const [board, setBoard] = useState(INITIAL_BOARD_STATE);
  const [boardHistory, setBoardHistory] = useState([board]);
  const [currentSymbol, setCurrentSymbol] = useState(SYMBOLS.O);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(INITIAL_WINNER_STATE);

  const undoPlay = () => {
    const targetMove = Math.max(0, currentMove - 1);
    setBoard(boardHistory[targetMove]);
    setCurrentMove(targetMove);
  };

  const redoPlay = () => {
    const targetMove = Math.min(boardHistory.length - 1, currentMove + 1);
    setBoard(boardHistory[targetMove]);
    setCurrentMove(targetMove);
  };

  const isTimeTravelling = () => currentMove < Math.max(0, boardHistory.length - 1);

  const hasMovesAvailable = () => board.some(v => v === '');

  const play = position => {
    if (board[position] !== '') return;
    if (isTimeTravelling()) return;
    if (winner.exists) return;

    const playedSymbol = currentSymbol === SYMBOLS.X ? SYMBOLS.O : SYMBOLS.X;
    setCurrentSymbol(playedSymbol);

    const newBoardState = [...board];
    newBoardState[position] = playedSymbol;

    setBoard(newBoardState);
    setBoardHistory([...boardHistory, newBoardState]);
    setCurrentMove(currentMove + 1);

    const winningSequence = checkForWinningMove(playedSymbol, newBoardState);
    if (winningSequence) {
      setWinner({ sequence: winningSequence, playedSymbol, exists: true });
    }
  };

  const reset = () => {
    setWinner(INITIAL_WINNER_STATE);
    setBoard(INITIAL_BOARD_STATE);
    setBoardHistory([]);
    setCurrentMove(0);
    setCurrentSymbol(SYMBOLS.O);
  };

  return (
    <React.Fragment>
      {winner.exists && <div>Winner: {winner.playedSymbol}</div>}
      {!hasMovesAvailable() && !winner.exists && <div>Tie!</div>}
      <S.Controls>
        <button disabled={currentMove === 0} onClick={undoPlay}>
          {'<'}
        </button>
        <button disabled={currentMove === boardHistory.length - 1} onClick={redoPlay}>
          {'>'}
        </button>
        <button onClick={reset}>reset</button>
      </S.Controls>
      <S.Game data-testid="game">
        {board.map((value, i) => (
          <Square
            data-testid={`square-${i}`}
            key={i}
            symbol={value}
            isPartOfWinningSequence={!isTimeTravelling() && isPartOfWinningSequence(winner, i)}
            onClick={() => play(i)}
          />
        ))}
      </S.Game>
    </React.Fragment>
  );
};

export default Game;
