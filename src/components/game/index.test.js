import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Game from ".";

describe("Game", () => {
  describe("rendering squares", () => {
    it("should render 9 squares", () => {
      const el = render(<Game />);
      const squares = el.getByTestId("game");
      expect(squares.childElementCount).toEqual(9);
    });
  });

  describe("clicking squares", () => {
    it("should set the square value when clicked", () => {
      const el = render(<Game />).getByTestId("game");
      const firstSquare = el.childNodes[0];

      act(() => firstSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
    });

    it("should not allow multiple clicks on the same square", () => {
      const el = render(<Game />).getByTestId("game");
      const firstSquare = el.childNodes[0];

      act(() => firstSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");

      act(() => firstSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
    });
  });

  describe("undoing actions", () => {
    it("should allow the user to move back a move", () => {
      const el = render(<Game />);
      const rollbackBtn = el.getByText("<");
      const firstSquare = el.getByTestId("game").childNodes[0];

      act(() => firstSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");

      act(() => rollbackBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
    });

    it("should not allow to move back if there are no more moves to rollback", () => {
      const el = render(<Game />);
      const rollbackBtn = el.getByText("<");
      const firstSquare = el.getByTestId("game").childNodes[0];
      const secondSquare = el.getByTestId("game").childNodes[1];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("O");

      act(() => rollbackBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("");

      act(() => rollbackBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("");

      act(() => rollbackBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
    });
  });

  describe("redoing actions", () => {
    it("should allow the user to move forward to a move made", () => {
      const el = render(<Game />);
      const rollbackBtn = el.getByText("<");
      const rollForwardBtn = el.getByText(">");
      const firstSquare = el.getByTestId("game").childNodes[0];

      act(() => firstSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");

      act(() => rollbackBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("");

      act(() => rollForwardBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
    });

    it("should not allow to move forward if there are no more moves ahead", () => {
      const el = render(<Game />);
      const rollbackBtn = el.getByText("<");
      const rollForwardBtn = el.getByText(">");
      const firstSquare = el.getByTestId("game").childNodes[0];
      const secondSquare = el.getByTestId("game").childNodes[1];
      const thirdSquare = el.getByTestId("game").childNodes[2];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => thirdSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("O");
      expect(thirdSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");

      act(() => rollbackBtn.click());
      act(() => rollbackBtn.click());
      act(() => rollbackBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
      expect(thirdSquare.getElementsByTagName("span")[0].innerHTML).toBe("");

      act(() => rollForwardBtn.click());
      act(() => rollForwardBtn.click());
      act(() => rollForwardBtn.click());
      act(() => rollForwardBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("O");
      expect(thirdSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
    });

    it("should ignore plays if the current board state is not the last one", () => {
      const el = render(<Game />);
      const rollbackBtn = el.getByText("<");
      const rollForwardBtn = el.getByText(">");
      const firstSquare = el.getByTestId("game").childNodes[0];
      const secondSquare = el.getByTestId("game").childNodes[1];
      const thirdSquare = el.getByTestId("game").childNodes[2];

      act(() => firstSquare.click());
      act(() => secondSquare.click());
      act(() => thirdSquare.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("O");
      expect(thirdSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");

      act(() => rollbackBtn.click());
      act(() => rollbackBtn.click());
      act(() => rollbackBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("");
      expect(thirdSquare.getElementsByTagName("span")[0].innerHTML).toBe("");

      act(() => rollForwardBtn.click());
      act(() => rollForwardBtn.click());
      act(() => rollForwardBtn.click());
      act(() => rollForwardBtn.click());
      expect(firstSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
      expect(secondSquare.getElementsByTagName("span")[0].innerHTML).toBe("O");
      expect(thirdSquare.getElementsByTagName("span")[0].innerHTML).toBe("X");
    });
  });

  describe("calculating the winner", () => {
    it(`
    X, X, X
    O  O  -
    -  -  -
    `, () => {
      const el = render(<Game />);
      const firstSquare = el.getByTestId("game").childNodes[0];
      const secondSquare = el.getByTestId("game").childNodes[1];
      const thirdSquare = el.getByTestId("game").childNodes[2];
      const fourthSquare = el.getByTestId("game").childNodes[3];
      const fifthSquare = el.getByTestId("game").childNodes[4];

      act(() => firstSquare.click());
      act(() => fourthSquare.click());
      act(() => secondSquare.click());
      act(() => fifthSquare.click());
      act(() => thirdSquare.click());

      expect(el.getByText(`Winner: X`)).toBeInTheDocument();
    });
  });
});
