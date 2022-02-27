import * as S from './styled';

const Square = ({
  symbol,
  onClick,
  isPartOfWinningSequence,
  dimensions = { width: '200px', height: '200px' },
}) => (
  <S.Square
    role="square"
    style={{ backgroundColor: isPartOfWinningSequence ? '#65C18C' : '', ...dimensions }}
    onClick={onClick}
  >
    <S.SquareText>{symbol}</S.SquareText>
  </S.Square>
);

export default Square;
