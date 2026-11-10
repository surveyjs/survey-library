import { describe, test, expect, vi, afterEach } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { analyzeFilterExpression } from "../../src/filter/filter-conditions";
import { ConditionEditorItemsBuilder } from "../../src/conditions/conditionEditorItems";

// Why a preset's text does or does not decompose into conditions: the check an AI answer is put to,
// so the model can be told what to fix.
describe("analyzeFilterExpression", () => {
  const fields = createFilter().getFilterFields();
  test("conditions joined by and decompose, one per field", () => {
    expect(analyzeFilterExpression("{age} > 18 and {country} anyof ['de']", fields)).toEqual({ conditions: [
      { field: "age", operator: "greater", value: 18 }, { field: "country", operator: "anyof", value: ["de"] }] });
  });
  test("an empty text is no conditions", () => {
    expect(analyzeFilterExpression("", fields)).toEqual({ conditions: [] });
  });
  test("an or between rows", () => {
    expect(analyzeFilterExpression("{age} > 18 or {age} < 5", fields)).toEqual({ problem: { code: "not-and" } });
  });
  test("arithmetic and a function call do not decompose at all", () => {
    expect(analyzeFilterExpression("{age} + 1 > 18", fields), "#1").toEqual({ problem: { code: "unsupported" } });
    expect(analyzeFilterExpression("age({age}) > 1", fields), "#2").toEqual({ problem: { code: "unsupported" } });
  });
  test("a field the control does not have", () => {
    expect(analyzeFilterExpression("{price} > 1", fields)).toEqual({ problem: { code: "unknown-field", field: "price" } });
  });
  test("a second condition on the same field", () => {
    expect(analyzeFilterExpression("{age} > 1 and {age} < 5", fields)).toEqual({ problem: { code: "duplicate-field", field: "age" } });
  });
  test("an operator the field does not offer", () => {
    expect(analyzeFilterExpression("{age} contains 1", fields)).toEqual({ problem: { code: "operator", field: "age", operator: "contains" } });
  });
});

// The structural parse of a text is remembered for the last 200 texts of the page. The cache is the
// module's, shared by every test: each test parses texts of its own.
describe("analyzeFilterExpression: the parse cache", () => {
  const fields = createFilter().getFilterFields();
  const text = (prefix: string, n: number): string => "{age} > " + n + " and {name} = '" + prefix + "'";
  afterEach(() => { vi.restoreAllMocks(); });
  test("a text is parsed once", () => {
    const build = vi.spyOn(ConditionEditorItemsBuilder.prototype, "build");
    const first = analyzeFilterExpression(text("once", 1), fields);
    const second = analyzeFilterExpression(text("once", 1), fields);
    expect([build.mock.calls.length, second], "#1").toEqual([1, first]);
  });
  test("the oldest of 201 texts is parsed again", () => {
    for (let i = 0; i <= 200; i++) analyzeFilterExpression(text("lru", i), fields);
    const build = vi.spyOn(ConditionEditorItemsBuilder.prototype, "build");
    analyzeFilterExpression(text("lru", 200), fields);
    expect(build.mock.calls.length, "#1: the newest is kept").toBe(0);
    analyzeFilterExpression(text("lru", 0), fields);
    expect(build.mock.calls.length, "#2: the oldest was let go of").toBe(1);
  });
  test("a text read again is kept as the newest", () => {
    for (let i = 0; i < 200; i++) analyzeFilterExpression(text("hit", i), fields);
    analyzeFilterExpression(text("hit", 0), fields);
    analyzeFilterExpression(text("hit", 200), fields);
    const build = vi.spyOn(ConditionEditorItemsBuilder.prototype, "build");
    analyzeFilterExpression(text("hit", 0), fields);
    expect(build.mock.calls.length, "#1: read again, it outlived hit 1").toBe(0);
    analyzeFilterExpression(text("hit", 1), fields);
    expect(build.mock.calls.length, "#2").toBe(1);
  });
});
