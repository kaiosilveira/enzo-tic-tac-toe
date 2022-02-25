import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Square from ".";

const symbol = "X";
const onClick = jest.fn();

describe("Square", () => {
  it("should render a symbol", () => {
    const { getByText } = render(<Square symbol={symbol}></Square>);
    expect(getByText(symbol)).toBeInTheDocument();
  });

  it("should handle clicks", () => {
    const { getByText } = render(<Square symbol={symbol} onClick={onClick}></Square>);
    const square = getByText(symbol);

    act(() => square.click());
    expect(onClick).toHaveBeenCalled();
  });
});
