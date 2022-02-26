import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Game from '.';

describe('Game', () => {
  describe('rendering squares', () => {
    it('should render 9 squares', () => {
      render(<Game />);
      const squares = screen.getByTestId('game');
      expect(squares.childElementCount).toEqual(9);
    });

    it('should have the control buttons to move backwards and forwards disabled', () => {
      const { getByText } = render(<Game />);
      expect(getByText('<')).toBeDisabled();
      expect(getByText('>')).toBeDisabled();
    });
  });

  describe('clicking squares', () => {
    it('should set the square value when clicked', () => {
      render(<Game />);
      const aboard = screen.getByTestId('game');
      const firstSquare = aboard.childNodes[0];
      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent('X');
    });

    it('should not allow multiple clicks on the same square', () => {
      render(<Game />);
      const aboard = screen.getByTestId('game');
      const firstSquare = aboard.childNodes[0];

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent('X');

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent('X');
    });
  });

  describe('undoing actions', () => {
    it('should allow the user to move back a move', () => {
      render(<Game />);
      const rollbackBtn = screen.getByText('<');
      const firstSquare = screen.queryAllByRole('square')[0];

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent('X');

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent('');
    });

    it('should not allow to move back if there are no more moves to rollback', () => {
      render(<Game />);
      const rollbackBtn = screen.getByText('<');
      const firstSquare = screen.queryAllByRole('square')[0];
      const secondSquare = screen.queryAllByRole('square')[1];

      fireEvent.click(firstSquare);
      fireEvent.click(secondSquare);
      expect(firstSquare).toHaveTextContent('X');
      expect(secondSquare).toHaveTextContent('O');

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent('X');
      expect(secondSquare).toHaveTextContent('');

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent('');
      expect(secondSquare).toHaveTextContent('');

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent('');
      expect(secondSquare).toHaveTextContent('');
    });
  });

  describe('redoing actions', () => {
    it('should allow the user to move forward to a move made', () => {
      render(<Game />);
      const rollbackBtn = screen.getByText('<');
      const rollForwardBtn = screen.getByText('>');
      const firstSquare = screen.queryAllByRole('square')[0];

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent('X');

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent('');

      fireEvent.click(rollForwardBtn);
      expect(firstSquare).toHaveTextContent('X');
    });

    it('should not allow to move forward if there are no more moves ahead', () => {
      render(<Game />);
      const rollbackBtn = screen.getByText('<');
      const rollForwardBtn = screen.getByText('>');
      const firstSquare = screen.queryAllByRole('square')[0];
      const secondSquare = screen.queryAllByRole('square')[1];
      const thirdSquare = screen.queryAllByRole('square')[2];

      fireEvent.click(firstSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(thirdSquare);
      expect(firstSquare).toHaveTextContent('X');
      expect(secondSquare).toHaveTextContent('O');
      expect(thirdSquare).toHaveTextContent('X');

      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent('');
      expect(secondSquare).toHaveTextContent('');
      expect(thirdSquare).toHaveTextContent('');

      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      expect(firstSquare).toHaveTextContent('X');
      expect(secondSquare).toHaveTextContent('O');
      expect(thirdSquare).toHaveTextContent('X');
    });

    it('should ignore plays if the current board state is not the last one', () => {
      render(<Game />);
      const rollbackBtn = screen.getByText('<');
      const rollForwardBtn = screen.getByText('>');
      const firstSquare = screen.queryAllByRole('square')[0];
      const secondSquare = screen.queryAllByRole('square')[1];
      const thirdSquare = screen.queryAllByRole('square')[2];

      fireEvent.click(firstSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(thirdSquare);
      expect(firstSquare).toHaveTextContent('X');
      expect(secondSquare).toHaveTextContent('O');
      expect(thirdSquare).toHaveTextContent('X');

      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent('');
      expect(secondSquare).toHaveTextContent('');
      expect(thirdSquare).toHaveTextContent('');

      fireEvent.click(rollForwardBtn);
      fireEvent.click(secondSquare);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(thirdSquare);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      expect(firstSquare).toHaveTextContent('X');
      expect(secondSquare).toHaveTextContent('O');
      expect(thirdSquare).toHaveTextContent('X');
    });
  });

  describe('calculating the winner', () => {
    // eslint-disable-next-line jest/valid-title
    it(`
    X  X  X
    O  O  -
    -  -  -
`, () => {
      render(<Game />);
      const firstSquare = screen.queryAllByRole('square')[0];
      const secondSquare = screen.queryAllByRole('square')[1];
      const thirdSquare = screen.queryAllByRole('square')[2];
      const fourthSquare = screen.queryAllByRole('square')[3];
      const fifthSquare = screen.queryAllByRole('square')[4];

      fireEvent.click(firstSquare);
      fireEvent.click(fourthSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(fifthSquare);
      fireEvent.click(thirdSquare);
      expect(screen.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    O  O  -
    X  X  X
    -  -  -
    `, () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId('game').childNodes[0];
      const secondSquare = el.getByTestId('game').childNodes[1];
      const fourthSquare = el.getByTestId('game').childNodes[3];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const sixthSquare = el.getByTestId('game').childNodes[5];

      act(() => fourthSquare.click());
      act(() => firstSquare.click());
      act(() => fifthSquare.click());
      act(() => secondSquare.click());
      act(() => sixthSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    -  -  -
    O  O  -
    X  X  X
    `, () => {
      const el = render(<Game />);
      const fourthSquare = el.getByTestId('game').childNodes[3];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const seventhSquare = el.getByTestId('game').childNodes[6];
      const eighthSquare = el.getByTestId('game').childNodes[7];
      const ninethSquare = el.getByTestId('game').childNodes[8];

      act(() => seventhSquare.click());
      act(() => fourthSquare.click());
      act(() => eighthSquare.click());
      act(() => fifthSquare.click());
      act(() => ninethSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    O  O  X
    -  X  -
    X  -  -
    `, () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId('game').childNodes[0];
      const secondSquare = el.getByTestId('game').childNodes[1];
      const thirdSquare = el.getByTestId('game').childNodes[2];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const seventhSquare = el.getByTestId('game').childNodes[6];

      act(() => thirdSquare.click());
      act(() => secondSquare.click());
      act(() => fifthSquare.click());
      act(() => firstSquare.click());
      act(() => seventhSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    X  O  O
    -  X  -
    -  -  X
    `, () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId('game').childNodes[0];
      const secondSquare = el.getByTestId('game').childNodes[1];
      const thirdSquare = el.getByTestId('game').childNodes[2];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const ninethSquare = el.getByTestId('game').childNodes[8];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fifthSquare.click());
      act(() => thirdSquare.click());
      act(() => ninethSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    X  O  -
    X  O  -
    X  -  -
    `, () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId('game').childNodes[0];
      const secondSquare = el.getByTestId('game').childNodes[1];
      const fourthSquare = el.getByTestId('game').childNodes[3];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const seventhSquare = el.getByTestId('game').childNodes[6];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fourthSquare.click());
      act(() => fifthSquare.click());
      act(() => seventhSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    X  O  -
    X  O  -
    X  -  -
    `, () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId('game').childNodes[0];
      const secondSquare = el.getByTestId('game').childNodes[1];
      const fourthSquare = el.getByTestId('game').childNodes[3];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const seventhSquare = el.getByTestId('game').childNodes[6];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fourthSquare.click());
      act(() => fifthSquare.click());
      act(() => seventhSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    O  X  -
    O  X  -
    -  X  -
    `, () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId('game').childNodes[0];
      const secondSquare = el.getByTestId('game').childNodes[1];
      const fourthSquare = el.getByTestId('game').childNodes[3];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const eigthSquare = el.getByTestId('game').childNodes[7];

      act(() => secondSquare.click());
      act(() => firstSquare.click());
      act(() => fifthSquare.click());
      act(() => fourthSquare.click());
      act(() => eigthSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    -  O  X
    -  O  X
    -  -  X
    `, () => {
      const el = render(<Game />);
      const secondSquare = el.getByTestId('game').childNodes[1];
      const thirdSquare = el.getByTestId('game').childNodes[2];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const sixthSquare = el.getByTestId('game').childNodes[5];
      const ninethSquare = el.getByTestId('game').childNodes[8];

      act(() => thirdSquare.click());
      act(() => secondSquare.click());
      act(() => sixthSquare.click());
      act(() => fifthSquare.click());
      act(() => ninethSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });
  });

  describe('reset', () => {
    it('should allow to reset the board after a winner', () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId('game').childNodes[0];
      const secondSquare = el.getByTestId('game').childNodes[1];
      const thirdSquare = el.getByTestId('game').childNodes[2];
      const fifthSquare = el.getByTestId('game').childNodes[4];
      const ninethSquare = el.getByTestId('game').childNodes[8];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fifthSquare.click());
      act(() => thirdSquare.click());
      act(() => ninethSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();

      const resetBtn = el.getByText('reset');
      act(() => resetBtn.click());

      expect(el.getByTestId('game').childNodes.length).toBe(9);
      el.getByTestId('game').childNodes.forEach(node => {
        expect(node.getElementsByTagName('span')[0].innerHTML).toBe('');
      });
    });
  });
});
