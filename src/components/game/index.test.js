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
      const firstSquare = screen.queryAllByRole('square')[0];
      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent('X');
    });

    it('should not allow multiple clicks on the same square', () => {
      render(<Game />);
      const firstSquare = screen.queryAllByRole('square')[0];

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
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const firstSquare = squares[0];
      const secondSquare = squares[1];
      const fourthSquare = squares[3];
      const fifthSquare = squares[4];
      const sixthSquare = squares[5];

      fireEvent.click(fourthSquare);
      fireEvent.click(firstSquare);
      fireEvent.click(fifthSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(sixthSquare);

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    -  -  -
    O  O  -
    X  X  X
    `, () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const fourthSquare = squares[3];
      const fifthSquare = squares[4];
      const seventhSquare = squares[6];
      const eighthSquare = squares[7];
      const ninethSquare = squares[8];

      act(() => seventhSquare.click());
      act(() => fourthSquare.click());
      act(() => eighthSquare.click());
      act(() => fifthSquare.click());
      act(() => ninethSquare.click());

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    O  O  X
    -  X  -
    X  -  -
    `, () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const firstSquare = squares[0];
      const secondSquare = squares[1];
      const thirdSquare = squares[2];
      const fifthSquare = squares[4];
      const seventhSquare = squares[6];

      act(() => thirdSquare.click());
      act(() => secondSquare.click());
      act(() => fifthSquare.click());
      act(() => firstSquare.click());
      act(() => seventhSquare.click());

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    X  O  O
    -  X  -
    -  -  X
    `, () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const firstSquare = squares[0];
      const secondSquare = squares[1];
      const thirdSquare = squares[2];
      const fifthSquare = squares[4];
      const ninethSquare = squares[8];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fifthSquare.click());
      act(() => thirdSquare.click());
      act(() => ninethSquare.click());

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    X  O  -
    X  O  -
    X  -  -
    `, () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const firstSquare = squares[0];
      const secondSquare = squares[1];
      const fourthSquare = squares[3];
      const fifthSquare = squares[4];
      const seventhSquare = squares[6];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fourthSquare.click());
      act(() => fifthSquare.click());
      act(() => seventhSquare.click());

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    X  O  -
    X  O  -
    X  -  -
    `, () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const firstSquare = squares[0];
      const secondSquare = squares[1];
      const fourthSquare = squares[3];
      const fifthSquare = squares[4];
      const seventhSquare = squares[6];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fourthSquare.click());
      act(() => fifthSquare.click());
      act(() => seventhSquare.click());

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    O  X  -
    O  X  -
    -  X  -
    `, () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const firstSquare = squares[0];
      const secondSquare = squares[1];
      const fourthSquare = squares[3];
      const fifthSquare = squares[4];
      const eigthSquare = squares[7];

      act(() => secondSquare.click());
      act(() => firstSquare.click());
      act(() => fifthSquare.click());
      act(() => fourthSquare.click());
      act(() => eigthSquare.click());

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });

    it(`
    -  O  X
    -  O  X
    -  -  X
    `, () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const secondSquare = squares[1];
      const thirdSquare = squares[2];
      const fifthSquare = squares[4];
      const sixthSquare = squares[5];
      const ninethSquare = squares[8];

      fireEvent.click(thirdSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(sixthSquare);
      fireEvent.click(fifthSquare);
      fireEvent.click(ninethSquare);

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();
    });
  });

  describe('tie', () => {
    it(`
    X X O
    O X X
    X O O
    `, () => {
      const aGame = render(<Game />);
      const [
        firstSquare,
        secondSquare,
        thirdSquare,
        fourthSquare,
        fifthSquare,
        sixthSquare,
        seventhSquare,
        eighthSquare,
        ninethSquare,
      ] = aGame.queryAllByRole('square');

      fireEvent.click(fifthSquare);
      fireEvent.click(ninethSquare);
      fireEvent.click(sixthSquare);
      fireEvent.click(fourthSquare);
      fireEvent.click(seventhSquare);
      fireEvent.click(thirdSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(eighthSquare);
      fireEvent.click(firstSquare);

      expect(aGame.getByText(`Tie!`)).toBeInTheDocument();
    });
  });

  describe('reset', () => {
    it('should allow to reset the board after a winner', () => {
      const aGame = render(<Game />);
      const squares = aGame.queryAllByRole('square');
      const firstSquare = squares[0];
      const secondSquare = squares[1];
      const thirdSquare = squares[2];
      const fifthSquare = squares[4];
      const ninethSquare = squares[8];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => fifthSquare.click());
      act(() => thirdSquare.click());
      act(() => ninethSquare.click());

      expect(aGame.getByText(`Winner: X`)).toBeInTheDocument();

      const resetBtn = aGame.getByText('reset');
      act(() => resetBtn.click());

      const reRenderedSquares = aGame.queryAllByRole('square');
      expect(reRenderedSquares.length).toBe(9);
      reRenderedSquares.forEach(node => {
        expect(node.getElementsByTagName('span')[0].innerHTML).toBe('');
      });
    });
  });
});
