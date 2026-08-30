import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function findingsOf(json: any, ruleId?: string): Array<ILintFinding> {
  const all = lintSurvey(json).findings;
  return ruleId ? all.filter(f => f.ruleId === ruleId) : all;
}

function rangeVerdictOf(source: any, condition: string): string | undefined {
  const findings = findingsOf({
    elements: [
      { type: "text", name: "q1" },
      Object.assign({ name: "v" }, source),
      { type: "text", name: "guarded", visibleIf: condition },
    ],
  }).filter(f => f.ruleId === "expression/contradiction" ||
    f.ruleId === "expression/meaningless-condition");
  if (findings.length === 0) return undefined;
  expect(findings).toHaveLength(1);
  return findings[0].ruleId + "/" + findings[0].reason;
}

const numeric = { type: "text", inputType: "number", min: 1, max: 5 };

describe("a comparison no value in the range can satisfy", () => {
  test("above the maximum", () => {
    expect(rangeVerdictOf(numeric, "{v} > 10")).toBe("expression/contradiction/outOfRange");
    expect(rangeVerdictOf(numeric, "{v} >= 6")).toBe("expression/contradiction/outOfRange");
  });
  test("below the minimum", () => {
    expect(rangeVerdictOf(numeric, "{v} < 0")).toBe("expression/contradiction/outOfRange");
    expect(rangeVerdictOf(numeric, "{v} <= 0")).toBe("expression/contradiction/outOfRange");
  });
  test("an equality outside the range", () => {
    expect(rangeVerdictOf(numeric, "{v} = 7")).toBe("expression/contradiction/outOfRange");
  });
  test("one bound is enough", () => {
    expect(rangeVerdictOf({ type: "text", inputType: "number", max: 5 }, "{v} > 10"))
      .toBe("expression/contradiction/outOfRange");
    expect(rangeVerdictOf({ type: "text", inputType: "number", min: 1 }, "{v} < 0"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("a date range is read the same way", () => {
    expect(rangeVerdictOf(
      { type: "text", inputType: "date", min: "2020-01-01", max: "2020-12-31" },
      "{v} < '2000-01-01'")).toBe("expression/contradiction/outOfRange");
  });
  test("a dead branch sinks the whole condition", () => {
    expect(rangeVerdictOf(numeric, "{q1} notempty and {v} > 10"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("the finding names the bounds it used", () => {
    const findings = findingsOf({
      elements: [Object.assign({ name: "v" }, numeric),
        { type: "text", name: "guarded", visibleIf: "{v} > 10" }],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.ranges).toEqual([{ name: "v", min: 1, max: 5 }]);
    expect(findings[0].related).toEqual([{ path: "elements[0]", elementName: "v" }]);
  });
});

describe("a comparison the range cannot decide", () => {
  test("a satisfiable comparison", () => {
    expect(rangeVerdictOf(numeric, "{v} > 3")).toBeUndefined();
    expect(rangeVerdictOf(numeric, "{v} = 3")).toBeUndefined();
  });
  test("a comparison every value satisfies is not reported either", () => {
    // an unanswered question makes it false at runtime, so "always true" would be a lie
    expect(rangeVerdictOf(numeric, "{v} <= 5")).toBeUndefined();
    expect(rangeVerdictOf(numeric, "{v} >= 1")).toBeUndefined();
  });
  test("notequal is satisfiable whatever the bounds are", () => {
    expect(rangeVerdictOf(numeric, "{v} <> 7")).toBeUndefined();
  });
  test("a bound computed at runtime is not a bound here", () => {
    expect(rangeVerdictOf(
      { type: "text", inputType: "number", max: 5, maxValueExpression: "{q1}" }, "{v} > 10"))
      .toBeUndefined();
  });
  test("time and week are compared by their own arithmetic at runtime", () => {
    expect(rangeVerdictOf({ type: "text", inputType: "time", min: "09:00", max: "12:00" }, "{v} > '23:00'"))
      .toBeUndefined();
    expect(rangeVerdictOf({ type: "text", inputType: "week", min: "2020-W01", max: "2020-W10" }, "{v} > '2030-W01'"))
      .toBeUndefined();
  });
  test("a text question without min or max has no range", () => {
    expect(rangeVerdictOf({ type: "text", inputType: "number" }, "{v} > 10")).toBeUndefined();
  });
  test("comparing a number to a string is left to expression/type-mismatch", () => {
    expect(rangeVerdictOf(numeric, "{v} > 'ten'")).toBeUndefined();
    expect(findingsOf({
      elements: [Object.assign({ name: "v" }, numeric),
        { type: "text", name: "guarded", visibleIf: "{v} > 'ten'" }],
    }, "expression/type-mismatch")).toHaveLength(1);
  });
});
