import React, { useState } from 'react';
import * as S from './styled';
import Button from '../Button';
import Square from '../square';
import WinnerBanner from '../winner-banner';
import { checkForWinningMove, isPartOfWinningSequence, hasAnyAvailableMove } from '../../utils';

const SYMBOLS = { X: 'X', O: 'O' };
const TIME_TRAVELLING_DIRECTIONS = {
  BACKWARD: 'backward',
  FORWARD: 'forward',
};
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
    console.log(targetMove, currentMove);
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
      <WinnerBanner winner={winner} hasMovesAvailable={hasAnyAvailableMove(board)} />
      <S.Controls>
        <Button disabled={currentMove === 0} text="<" handleClick={moveBackwards} />
        <Button
          disabled={currentMove === boardHistory.length - 1}
          text=">"
          handleClick={moveForwards}
        />
        <Button text="reset" handleClick={reset} />
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
