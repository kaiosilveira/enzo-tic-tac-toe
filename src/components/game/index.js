import React, { useState } from 'react';
import * as S from './styled';
import Button from '../Button';
import WinnerBanner from '../winner-banner';
import { checkForWinningMove, hasAnyAvailableMove } from '../../utils';
import Board from '../board';

const SYMBOLS = { X: 'X', O: 'O' };
const INITIAL_BOARD_STATE = new Array(9).fill('');
const INITIAL_WINNER_STATE = {
  sequence: { name: '', positions: [] },
  playedSymbol: '',
  exists: false,
};

const Game = () => {
  const [board, setBoard] = useState(INITIAL_BOARD_STATE);
  const [boardHistory, setBoardHistory] = useState([board]);
  const [currentSymbol, setCurrentSymbol] = useState(SYMBOLS.O);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(INITIAL_WINNER_STATE);

  const travelInTime = ({ targetMove }) => {
    setBoard(boardHistory[targetMove]);
    setCurrentMove(targetMove);
  };

  const isTimeTravelling = () => currentMove < Math.max(0, boardHistory.length - 1);
  const moveBackwards = () => {
    const targetMove = Math.max(0, currentMove - 1);
    travelInTime({ targetMove });
  };
  const moveForwards = () => {
    travelInTime({ targetMove: Math.min(boardHistory.length - 1, currentMove + 1) });
  };

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
      <WinnerBanner
        winner={winner}
        hasMovesAvailable={hasAnyAvailableMove(board)}
        onPressPlayAgain={reset}
        winningBoard={board}
      />
      <S.Controls>
        <Button disabled={currentMove === 0} text="<" handleClick={moveBackwards} />
        <Button
          disabled={currentMove === boardHistory.length - 1}
          text=">"
          handleClick={moveForwards}
        />
        <Button text="reset" handleClick={reset} />
      </S.Controls>
      <Board
        board={board}
        handlePlay={i => play(i)}
        winner={winner}
        isTimeTravelling={isTimeTravelling()}
      />
    </React.Fragment>
  );
};

export default Game;
