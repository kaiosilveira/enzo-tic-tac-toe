import * as S from './styled';

const Square = ({ symbol, onClick, isPartOfWinningSequence }) => (
  <S.Square
    role="square"
    style={{ backgroundColor: isPartOfWinningSequence ? '#65C18C' : '' }}
    onClick={onClick}
  >
    <S.SquareText>{symbol}</S.SquareText>
  </S.Square>
);

export default Square;
