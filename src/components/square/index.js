import * as S from "./styled";

const Square = ({ symbol, onClick }) => (
  <S.Square role="button" onClick={onClick}>
    <S.SquareText>{symbol}</S.SquareText>
  </S.Square>
);

export default Square;
