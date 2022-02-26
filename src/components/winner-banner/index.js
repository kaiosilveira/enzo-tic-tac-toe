import React from 'react';

const WinnerBanner = ({ winner, hasMovesAvailable }) => {
  if (winner.exists) {
    return <span>Winner: {winner.playedSymbol}</span>;
  }

  if (!hasMovesAvailable) {
    return <div>Tie!</div>;
  }

  return <React.Fragment />;
};

export default WinnerBanner;
