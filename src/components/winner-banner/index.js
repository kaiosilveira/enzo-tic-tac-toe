import React from 'react';
import Button from '../Button';
import * as S from './styled';

const WinnerBanner = ({ winner, hasMovesAvailable, onPressPlayAgain }) => {
  if (winner.exists) {
    return (
      <S.WinnerBanner>
        <span>Winner: {winner.playedSymbol}</span>
        <div>
          <Button text="Play again?" handleClick={onPressPlayAgain} />
        </div>
      </S.WinnerBanner>
    );
  }

  if (!hasMovesAvailable) {
    return <div>Tie!</div>;
  }

  return <React.Fragment />;
};

export default WinnerBanner;
