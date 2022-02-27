import React from 'react';
import * as S from './styled';
import Square from '../square';
import { isPartOfWinningSequence } from '../../utils';

const Board = ({
  board,
  winner,
  handlePlay,
  isTimeTravelling,
  dimensions = { width: '600px', height: '600px' },
  squareDimensions = { width: '200px', height: '200px' },
}) => (
  <S.Board data-testid="game" style={dimensions}>
    {board.map((value, i) => (
      <Square
        data-testid={`square-${i}`}
        key={i}
        symbol={value}
        dimensions={squareDimensions}
        isPartOfWinningSequence={!isTimeTravelling && isPartOfWinningSequence(winner, i)}
        onClick={() => handlePlay(i)}
      />
    ))}
  </S.Board>
);

export default Board;
