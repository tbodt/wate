import {
  State,
  findRowStates,
  findLetterStates,
  validHardModeGuess,
} from "./game";

function states(fmt: string): State[] {
  const TYPES = {
    c: State.Correct,
    _: State.Absent,
    p: State.Present,
    u: State.Unknown,
  };
  return fmt
    .toLowerCase()
    .split("")
    .map((x) => TYPES[x]);
}

describe("findRowStates", () => {
  test("solution is correct", () => {
    expect(findRowStates("WXYZ", "WXYZ")).toEqual(states("cccc"));
  });

  test("works", () => {
    expect(findRowStates("xWxx", "W___")).toEqual(states("p___"));
    expect(findRowStates("xWxx", "_W__")).toEqual(states("_c__"));
    expect(findRowStates("xWxx", "__W_")).toEqual(states("__p_"));
    expect(findRowStates("xWxx", "____")).toEqual(states("____"));
  });

  test("excess duplicates are marked as absent", () => {
    expect(findRowStates("xyzWW", "WWW__")).toEqual(states("pp___"));
    expect(findRowStates("xyzWW", "WW__W")).toEqual(states("p___c"));
    expect(findRowStates("xyzWW", "W__WW")).toEqual(states("___cc"));
  });
});

describe("findLetterStates", () => {
  test("all rows are used", () => {
    expect(findLetterStates("WX", ["W_", "X_"])).toEqual(
      new Map([
        ["_", State.Absent],
        ["X", State.Present],
        ["W", State.Correct],
      ])
    );
  });

  test("correct takes precedence over present", () => {
    const r = new Map([
      ["_", State.Absent],
      ["W", State.Correct],
    ]);
    expect(findLetterStates("WX", ["_W", "W_"])).toEqual(r);
    expect(findLetterStates("WX", ["W_", "_W"])).toEqual(r);
  });
});

describe("validHardModeGuess", () => {
  test("allows multiple unlucky guesses", () => {
    expect(validHardModeGuess("wxyz", ["abcd"], "efgh")).toBeUndefined();
  });

  test("forces use of present hints", () => {
    expect(validHardModeGuess("Wxyz", ["_W__"], "____")).toEqual({ use: "W" });
    expect(validHardModeGuess("Wxyz", ["_WW_"], "____")).toEqual({ use: "W" });
  });

  test("forces use and position of correct hints", () => {
    expect(validHardModeGuess("Wxyz", ["W___"], "____")).toEqual({
      use: "W",
      position: 0,
    });
    expect(validHardModeGuess("WWxy", ["WW__"], "W___")).toEqual({
      use: "W",
      position: 1,
    });
    expect(validHardModeGuess("WWxy", ["WW__"], "_W__")).toEqual({
      use: "W",
      position: 0,
    });
  });

  // test("work with duplicate letters", ());
});
