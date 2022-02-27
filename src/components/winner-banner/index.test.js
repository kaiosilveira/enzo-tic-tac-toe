import { fireEvent, render, screen } from '@testing-library/react';
import WinnerBanner from '.';

describe('WinnerBanner', () => {
  describe('when there is a winner', () => {
    it('should ask whether the user wants to play again', () => {
      const winner = { exists: true };
      const playAgainFn = jest.fn();
      render(<WinnerBanner winner={winner} onPressPlayAgain={playAgainFn} />);
      const btn = screen.getByText('Play again?');
      fireEvent.click(btn);
      expect(playAgainFn).toHaveBeenCalledTimes(1);
    });
  });
});
