import { describe, test, expect } from "vitest";
import { ExpressionRunner } from "../../src/expressions/expressionRunner";
import { BinaryOperand, OperandMaker, hasBinaryOperator, runBinaryOperator } from "../../src/expressions/expressions";
import { settings } from "../../src/settings";

// runBinaryOperator is the public, model-free way to apply a condition operator.
// It must agree with the operator the expression runtime applies for the same
// operands, or a tool that uses it (the linter) reports findings the runtime
// would not produce.
function runByExpression(operatorName: string, left: any, right: any): any {
  const text = "{a} " + OperandMaker.operatorToString(operatorName) + " {b}";
  return new ExpressionRunner(text).runValues({ a: left, b: right });
}

const CASES: Array<{ op: string, left: any, right: any }> = [
  { op: "equal", left: "abc", right: "abc" },
  { op: "equal", left: "ABC", right: "abc" },
  { op: "equal", left: 1, right: "1" },
  { op: "equal", left: 0, right: "" },
  { op: "equal", left: false, right: "false" },
  { op: "equal", left: [1, 2], right: [2, 1] },
  { op: "notequal", left: "abc", right: "abd" },
  { op: "less", left: 1, right: 2 },
  { op: "greater", left: 2, right: 1 },
  { op: "lessorequal", left: 2, right: 2 },
  { op: "greaterorequal", left: 2, right: 3 },
  { op: "contains", left: "apricot", right: "apr" },
  { op: "contains", left: "apricot", right: "APR" },
  { op: "contains", left: [1, 2, 3], right: 2 },
  { op: "contains", left: [], right: 1 },
  { op: "contains", left: "", right: "a" },
  { op: "notcontains", left: [1, 2], right: 3 },
  { op: "anyof", left: [1, 2], right: [2, 3] },
  { op: "anyof", left: [1, 2], right: [3, 4] },
  { op: "anyof", left: 1, right: [1, 2] },
  { op: "allof", left: [1, 2, 3], right: [1, 3] },
  { op: "allof", left: [1, 2], right: [1, 3] },
  { op: "noneof", left: [1, 2], right: [3, 4] },
  { op: "and", left: true, right: false },
  { op: "or", left: true, right: false },
  { op: "plus", left: 1, right: 2 },
  { op: "plus", left: undefined, right: 2 },
  { op: "minus", left: 5, right: 2 },
  { op: "minus", left: null, right: 2 },
  { op: "mul", left: 3, right: 4 },
  { op: "div", left: 6, right: 3 },
  { op: "mod", left: 7, right: 3 },
  { op: "power", left: 2, right: 3 },
];

describe("runBinaryOperator", () => {
  CASES.forEach(item => {
    const title = item.op + "(" + JSON.stringify(item.left) + ", " + JSON.stringify(item.right) + ")";
    test("agrees with the expression runtime: " + title, () => {
      expect(runBinaryOperator(item.op, item.left, item.right))
        .toEqual(runByExpression(item.op, item.left, item.right));
    });
  });

  // The operands are applied as given. Inside an expression they first pass through
  // the operand conversion ("0" becomes 0, "false" becomes false), so a caller that
  // wants runtime-identical results must feed it runtime values - which is what
  // comparing a question value against a parsed Const already does.
  test("applies the operator only, it does not convert the operands", () => {
    expect(runBinaryOperator("contains", 0, "0")).toBe(true);
    expect(runByExpression("contains", 0, "0")).toBe(false);
    expect(runBinaryOperator("contains", 0, 0)).toBe(false);
  });

  test("arithmetic operators go through the empty-operand normalization", () => {
    // the raw binaryFunctions.plus would return null here; the runtime converts the
    // empty operand first, and runBinaryOperator must do the same
    expect(runBinaryOperator("plus", undefined, 2)).toBe(2);
    expect(runBinaryOperator("minus", undefined, 2)).toBe(-2);
  });

  test("honours settings.comparator.caseSensitive", () => {
    const prev = settings.comparator.caseSensitive;
    try {
      settings.comparator.caseSensitive = true;
      expect(runBinaryOperator("equal", "ABC", "abc")).toBe(false);
      expect(runBinaryOperator("contains", "apricot", "APR")).toBe(false);
      settings.comparator.caseSensitive = false;
      expect(runBinaryOperator("equal", "ABC", "abc")).toBe(true);
      expect(runBinaryOperator("contains", "apricot", "APR")).toBe(true);
    } finally {
      settings.comparator.caseSensitive = prev;
    }
  });

  test("normalizes the \"undefined\" string, like the runtime does", () => {
    expect(runBinaryOperator("equal", "undefined", undefined)).toBe(true);
  });

  test("an operator name from Object.prototype is not an operator", () => {
    expect(hasBinaryOperator("constructor")).toBe(false);
    expect(hasBinaryOperator("__proto__")).toBe(false);
    expect(hasBinaryOperator("toString")).toBe(false);
    expect(() => runBinaryOperator("constructor", 1, 2)).toThrow();
    expect(() => new BinaryOperand("constructor", null, null)).toThrow();
  });

  test("the internal helpers of binaryFunctions are not operators", () => {
    expect(hasBinaryOperator("arithmeticOp")).toBe(false);
    expect(hasBinaryOperator("containsCore")).toBe(false);
    expect(() => runBinaryOperator("containsCore", "abc", "a")).toThrow();
  });

  test("known operators are reported as known", () => {
    ["equal", "notequal", "contains", "anyof", "allof", "noneof", "less", "plus"].forEach(op => {
      expect(hasBinaryOperator(op)).toBe(true);
    });
    expect(hasBinaryOperator("")).toBe(false);
    expect(hasBinaryOperator(undefined)).toBe(false);
  });
});
