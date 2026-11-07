import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { analyzeFilterExpression } from "../../src/filter/filter-conditions";

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
