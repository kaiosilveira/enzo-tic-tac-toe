import * as S from "./styled";

const Square = ({ symbol, onClick }) => (
  <S.Square role="square" onClick={onClick}>
    <S.SquareText>{symbol}</S.SquareText>
  </S.Square>
);

export default Square;
