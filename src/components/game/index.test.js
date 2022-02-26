import { fireEvent, render, screen } from "@testing-library/react";
import Game from ".";

describe("Game", () => {
  describe("rendering squares", () => {
    it("should render 9 squares", () => {
      render(<Game />);
      const squares = screen.getByTestId("game");
      expect(squares.childElementCount).toEqual(9);
    });
  });

  describe("clicking squares", () => {
    it("should set the square value when clicked", () => {
      render(<Game />);
      const aboard = screen.getByTestId("game");
      const firstSquare = aboard.childNodes[0];
      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent("X");
    });

    it("should not allow multiple clicks on the same square", () => {
      render(<Game />);
      const aboard = screen.getByTestId("game");
      const firstSquare = aboard.childNodes[0];

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent("X");

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent("X");
    });
  });

  describe("undoing actions", () => {
    it("should allow the user to move back a move", () => {
      render(<Game />);
      const rollbackBtn = screen.getByText("<");
      const firstSquare = screen.queryAllByRole("square")[0];

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent("X");

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent("");
    });

    it("should not allow to move back if there are no more moves to rollback", () => {
      render(<Game />);
      const rollbackBtn = screen.getByText("<");
      const firstSquare = screen.queryAllByRole("square")[0];
      const secondSquare = screen.queryAllByRole("square")[1];

      fireEvent.click(firstSquare);
      fireEvent.click(secondSquare);
      expect(firstSquare).toHaveTextContent("X");
      expect(secondSquare).toHaveTextContent("O");

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent("X");
      expect(secondSquare).toHaveTextContent("");

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent("");
      expect(secondSquare).toHaveTextContent("");

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent("");
      expect(secondSquare).toHaveTextContent("");
    });
  });

  describe("redoing actions", () => {
    it("should allow the user to move forward to a move made", () => {
      render(<Game />);
      const rollbackBtn = screen.getByText("<");
      const rollForwardBtn = screen.getByText(">");
      const firstSquare = screen.queryAllByRole("square")[0];

      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent("X");

      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent("");

      fireEvent.click(rollForwardBtn);
      expect(firstSquare).toHaveTextContent("X");
    });

    it("should not allow to move forward if there are no more moves ahead", () => {
      render(<Game />);
      const rollbackBtn = screen.getByText("<");
      const rollForwardBtn = screen.getByText(">");
      const firstSquare = screen.queryAllByRole("square")[0];
      const secondSquare = screen.queryAllByRole("square")[1];
      const thirdSquare = screen.queryAllByRole("square")[2];

      fireEvent.click(firstSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(thirdSquare);
      expect(firstSquare).toHaveTextContent("X");
      expect(secondSquare).toHaveTextContent("O");
      expect(thirdSquare).toHaveTextContent("X");

      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      expect(firstSquare).toHaveTextContent("");
      expect(secondSquare).toHaveTextContent("");
      expect(thirdSquare).toHaveTextContent("");

      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      expect(firstSquare).toHaveTextContent("X");
      expect(secondSquare).toHaveTextContent("O");
      expect(thirdSquare).toHaveTextContent("X");
    });

    it("should ignore plays if the current board state is not the last one", () => {
      render(<Game />);
      const rollbackBtn = screen.getByText("<");
      const rollForwardBtn = screen.getByText(">");
      const firstSquare = screen.queryAllByRole("square")[0];
      const secondSquare = screen.queryAllByRole("square")[1];
      const thirdSquare = screen.queryAllByRole("square")[2];

      fireEvent.click(firstSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(thirdSquare);
      expect(firstSquare).toHaveTextContent("X");
      expect(secondSquare).toHaveTextContent("O");
      expect(thirdSquare).toHaveTextContent("X");

      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(rollbackBtn);
      fireEvent.click(firstSquare);
      expect(firstSquare).toHaveTextContent("");
      expect(secondSquare).toHaveTextContent("");
      expect(thirdSquare).toHaveTextContent("");

      fireEvent.click(rollForwardBtn);
      fireEvent.click(secondSquare);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(thirdSquare);
      fireEvent.click(rollForwardBtn);
      fireEvent.click(rollForwardBtn);
      expect(firstSquare).toHaveTextContent("X");
      expect(secondSquare).toHaveTextContent("O");
      expect(thirdSquare).toHaveTextContent("X");
    });
  });

  describe("calculating the winner", () => {
    // eslint-disable-next-line jest/valid-title
    it(`
    X, X, X
    O  O  -
    -  -  -
`, () => {
      render(<Game />);
      const firstSquare = screen.queryAllByRole("square")[0];
      const secondSquare = screen.queryAllByRole("square")[1];
      const thirdSquare = screen.queryAllByRole("square")[2];
      const fourthSquare = screen.queryAllByRole("square")[3];
      const fifthSquare = screen.queryAllByRole("square")[4];

      fireEvent.click(firstSquare);
      fireEvent.click(fourthSquare);
      fireEvent.click(secondSquare);
      fireEvent.click(fifthSquare);
      fireEvent.click(thirdSquare);
      expect(screen.getByText(`Winner: X`)).toBeInTheDocument();
    });
  });
});
