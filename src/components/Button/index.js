const Button = ({ text, disabled, handleClick }) => (
  <button disabled={disabled} onClick={handleClick}>
    {text}
  </button>
);

export default Button;
