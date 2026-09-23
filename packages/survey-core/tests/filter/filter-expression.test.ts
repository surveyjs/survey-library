import { describe, test, expect } from "vitest";
import { escapeExpressionText, toExpressionConst } from "../../src/filter/filter-expression";
import { combineFilterExpressions } from "../../src/dynamic-data/dynamic-data-filter";
import { passesFilter } from "../../src/dynamic-data/dynamic-data-filter";

describe("filter-expression: building text the parser accepts", () => {
  test("an apostrophe is escaped and the expression still runs", () => {
    const expression = "{name} contains " + toExpressionConst("O'Brien");
    expect(expression).toBe("{name} contains 'O\\'Brien'");
    expect(passesFilter({ name: "Mr O'Brien" }, expression)).toBe(true);
    expect(passesFilter({ name: "Mr Smith" }, expression)).toBe(false);
  });
  test("a double quote is escaped too: the grammar forbids a bare one inside a string", () => {
    const expression = "{name} contains " + toExpressionConst("say \"hi\"");
    expect(passesFilter({ name: "they say \"hi\" a lot" }, expression)).toBe(true);
  });
  test("a backslash in front of a quote or at the end is dropped, not doubled", () => {
    expect(escapeExpressionText("C:\\")).toBe("C:");
    expect(passesFilter({ name: "C:\\temp" }, "{name} contains " + toExpressionConst("C:\\"))).toBe(true);
  });
  test("numbers and booleans are not quoted, numeric strings are", () => {
    expect(toExpressionConst(5)).toBe("5");
    expect(toExpressionConst(true)).toBe("true");
    expect(toExpressionConst("5")).toBe("'5'");
    expect(toExpressionConst("true")).toBe("'true'");
  });
  test("combine parenthesizes both sides: or binds looser than and", () => {
    const res = combineFilterExpressions("{a} = 1 or {b} = 2", "{c} contains 'x'");
    expect(res).toBe("({a} = 1 or {b} = 2) and ({c} contains 'x')");
    expect(passesFilter({ a: 1, b: 0, c: "zzz" }, res)).toBe(false);
    expect(passesFilter({ a: 1, b: 0, c: "xxx" }, res)).toBe(true);
  });
  test("an empty operand is dropped and the other one is not wrapped", () => {
    expect(combineFilterExpressions("", "{c} contains 'x'")).toBe("{c} contains 'x'");
    expect(combineFilterExpressions("{a} = 1", "  ")).toBe("{a} = 1");
    expect(combineFilterExpressions("", "")).toBe("");
  });
});
