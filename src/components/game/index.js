import React, { useState } from 'react';
import Square from '../square';
import * as S from './styled';

const INITIAL_BOARD_STATE = new Array(9).fill('');
const SYMBOLS = { X: 'X', O: 'O' };

const Game = () => {
  const [board, setBoard] = useState(INITIAL_BOARD_STATE);
  const [boardHistory, setBoardHistory] = useState([board]);
  const [currentSymbol, setCurrentSymbol] = useState(SYMBOLS.O);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(undefined);

  const redoPlay = () => {
    const targetMove = Math.min(boardHistory.length - 1, currentMove + 1);
    setBoard(boardHistory[targetMove]);
    setCurrentMove(targetMove);
  };

  const undoPlay = () => {
    const targetMove = Math.max(0, currentMove - 1);
    setBoard(boardHistory[targetMove]);
    setCurrentMove(targetMove);
  };

  const play = position => {
    if (board[position] !== '') return;
    if (currentMove < Math.max(0, boardHistory.length - 1)) return;
    if (winner) return;

    const playedSymbol = currentSymbol === SYMBOLS.X ? SYMBOLS.O : SYMBOLS.X;
    setCurrentSymbol(playedSymbol);

    const newBoardState = [...board];
    newBoardState[position] = playedSymbol;

    setBoard(newBoardState);
    setBoardHistory([...boardHistory, newBoardState]);
    setCurrentMove(currentMove + 1);

    if (
      newBoardState.slice(0, 3).every(i => i === playedSymbol) ||
      newBoardState.slice(3, 6).every(i => i === playedSymbol) ||
      newBoardState.slice(6, 9).every(i => i === playedSymbol) ||
      [newBoardState[2], newBoardState[4], newBoardState[6]].every(i => i === playedSymbol) ||
      [newBoardState[0], newBoardState[4], newBoardState[8]].every(i => i === playedSymbol)
    ) {
      setWinner(playedSymbol);
    }
  };

  const reset = () => {
    setWinner('');
    setBoard(INITIAL_BOARD_STATE);
    setBoardHistory([]);
    setCurrentMove(0);
  };

  return (
    <React.Fragment>
      {winner && <div>Winner: {winner}</div>}
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
          <Square key={i} symbol={value} onClick={() => play(i)} />
        ))}
      </S.Game>
    </React.Fragment>
  );
};

export default Game;
