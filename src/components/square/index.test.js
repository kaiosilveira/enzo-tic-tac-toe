import { fireEvent, render, screen } from '@testing-library/react';
import Square from '.';

const symbol = 'X';
const onClick = jest.fn();

describe('Square', () => {
  it('should render a symbol', () => {
    render(<Square symbol={symbol}></Square>);
    expect(screen.getByText(symbol)).toBeInTheDocument();
  });

  it('should handle clicks', () => {
    render(<Square symbol={symbol} onClick={onClick}></Square>);
    const square = screen.getByText(symbol);
    fireEvent.click(square);
    expect(onClick).toHaveBeenCalled();
  });

  it('should have a different background color if is part of a winning position', () => {
    render(<Square symbol={symbol} isPartOfWinningSequence={true} />);
    const aSquare = screen.getByRole('square');
    expect(aSquare).toHaveStyle({ backgroundColor: '#65C18C' });
  });
});
