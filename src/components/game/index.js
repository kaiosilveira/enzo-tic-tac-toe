import React, { useEffect, useState } from "react";
import Square from "../square";
import * as S from "./styled";

const SYMBOLS = { X: "X", O: "O" };

const Game = () => {
  const [board, setBoard] = useState(new Array(9).fill(""));
  const [boardHistory, setBoardHistory] = useState([]);
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
    if (board[position] !== "") return;
    if (currentMove !== boardHistory.length - 1) return;

    const playedSymbol = currentSymbol === SYMBOLS.X ? SYMBOLS.O : SYMBOLS.X;
    setCurrentSymbol(playedSymbol);

    const newBoardState = [...board];
    newBoardState[position] = playedSymbol;
    setBoard(newBoardState);
    setBoardHistory([...boardHistory, newBoardState]);
    setCurrentMove(currentMove + 1);

    if (newBoardState.slice(0, 3).every(i => i === playedSymbol)) {
      setWinner(playedSymbol);
    }
  };

  useEffect(() => {
    setBoardHistory([board]);
  }, []);

  return (
    <React.Fragment>
      {winner && <div>Winner: {winner}</div>}
      <S.Controls>
        <button onClick={undoPlay}>{"<"}</button>
        <button onClick={redoPlay}>{">"}</button>
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
