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

describe("a rating keeps its value between its bounds", () => {
  test("the built-in bounds count, even when the JSON states none", () => {
    expect(rangeVerdictOf({ type: "rating" }, "{v} = 7"))
      .toBe("expression/contradiction/outOfRange");
    expect(rangeVerdictOf({ type: "rating" }, "{v} = 3")).toBeUndefined();
  });
  test("rateMax moves the upper bound", () => {
    expect(rangeVerdictOf({ type: "rating", rateMax: 10 }, "{v} = 7")).toBeUndefined();
    expect(rangeVerdictOf({ type: "rating", rateMax: 10 }, "{v} > 10"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("rateCount sets the upper bound when rateMax does not", () => {
    // rateMax = rateMin + rateStep * (rateCount - 1), the way the model recomputes it
    expect(rangeVerdictOf({ type: "rating", rateCount: 3 }, "{v} = 5"))
      .toBe("expression/contradiction/outOfRange");
    expect(rangeVerdictOf({ type: "rating", rateCount: 3 }, "{v} = 3")).toBeUndefined();
  });
  test("rateMin moves the lower bound", () => {
    expect(rangeVerdictOf({ type: "rating", rateMin: 0 }, "{v} = 0")).toBeUndefined();
    expect(rangeVerdictOf({ type: "rating", rateMin: 2 }, "{v} = 1"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("rateValues make it a set, and the set rule reports it", () => {
    expect(rangeVerdictOf({ type: "rating", rateValues: [1, 2, 3] }, "{v} = 7")).toBeUndefined();
    expect(findingsOf({
      elements: [{ type: "rating", name: "v", rateValues: [1, 2, 3] },
        { type: "text", name: "guarded", visibleIf: "{v} = 7" }],
    }, "expression/unknown-choice")).toHaveLength(1);
  });
});

describe("a slider keeps its value between its bounds", () => {
  test("the built-in 0..100 counts", () => {
    expect(rangeVerdictOf({ type: "slider" }, "{v} > 200"))
      .toBe("expression/contradiction/outOfRange");
    expect(rangeVerdictOf({ type: "slider" }, "{v} > 50")).toBeUndefined();
  });
  test("min and max move them", () => {
    expect(rangeVerdictOf({ type: "slider", min: 10, max: 20 }, "{v} < 5"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("a range slider holds an array, not a number", () => {
    expect(rangeVerdictOf({ type: "slider", sliderType: "range" }, "{v} > 200")).toBeUndefined();
  });
});

// The walker stores a column's cell type in effectiveType (type stays the wrapper
// "matrixdropdowncolumn"), so the domain must dispatch on the effective type.
describe("a matrix column holds the domain of its cell type", () => {
  function columnVerdictOf(column: any, condition: string): string | undefined {
    const findings = findingsOf({
      elements: [{
        type: "matrixdropdown",
        name: "m",
        rows: ["r1"],
        columns: [
          Object.assign({ name: "score" }, column),
          { name: "note", cellType: "text", visibleIf: condition },
        ],
      }],
    }).filter(f => f.ruleId === "expression/contradiction" ||
      f.ruleId === "expression/unknown-choice");
    if (findings.length === 0) return undefined;
    expect(findings).toHaveLength(1);
    return findings[0].ruleId + "/" + findings[0].reason;
  }

  test("a rating column runs 1..5 by default", () => {
    expect(columnVerdictOf({ cellType: "rating" }, "{row.score} > 10"))
      .toBe("expression/contradiction/outOfRange");
    expect(columnVerdictOf({ cellType: "rating" }, "{row.score} > 3")).toBeUndefined();
  });
  test("a numeric text column reads min/max", () => {
    expect(columnVerdictOf({ cellType: "text", inputType: "number", min: 1, max: 5 }, "{row.score} > 10"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("a slider column keeps the built-in 0..100", () => {
    expect(columnVerdictOf({ cellType: "slider" }, "{row.score} > 200"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("the matrix-level cellType reaches the column", () => {
    const findings = findingsOf({
      elements: [{
        type: "matrixdropdown", name: "m", rows: ["r1"], cellType: "rating",
        columns: [
          { name: "score" },
          { name: "note", cellType: "text", visibleIf: "{row.score} > 10" },
        ],
      }],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("outOfRange");
  });
  test("a rating column's rateValues are a value set", () => {
    expect(columnVerdictOf({ cellType: "rating", rateValues: [1, 2, 3] }, "{row.score} = 7"))
      .toBe("expression/unknown-choice/notAmongChoices");
  });
});

describe("range checks through matrix and panel sub-paths", () => {
  test("a matrixdynamic cell path with an index reads the column bounds", () => {
    const findings = findingsOf({
      elements: [
        { type: "matrixdynamic", name: "m9", columns: [{ name: "score", cellType: "rating" }] },
        { type: "text", name: "q3", visibleIf: "{m9[0].score} > 10" },
      ],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("outOfRange");
  });
  test("a matrixdropdown cell path reads the column bounds", () => {
    const findings = findingsOf({
      elements: [
        { type: "matrixdropdown", name: "m8", rows: ["r1"],
          columns: [{ name: "score", cellType: "rating" }] },
        { type: "text", name: "q3", visibleIf: "{m8.r1.score} > 10" },
      ],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("outOfRange");
  });
  test("a dynamic panel question path reads the template question bounds", () => {
    const findings = findingsOf({
      elements: [
        { type: "paneldynamic", name: "p5", templateElements: [
          { type: "text", name: "age", inputType: "number", min: 0, max: 5 },
        ] },
        { type: "text", name: "q4", visibleIf: "{p5[0].age} > 10" },
      ],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("outOfRange");
  });
  test("a matrixdynamic path without an index stays undecided", () => {
    expect(findingsOf({
      elements: [
        { type: "matrixdynamic", name: "m9", columns: [{ name: "score", cellType: "rating" }] },
        { type: "text", name: "q3", visibleIf: "{m9.score} > 10" },
      ],
    }, "expression/contradiction")).toHaveLength(0);
  });
  test("a satisfiable comparison through a sub-path is clean", () => {
    expect(findingsOf({
      elements: [
        { type: "matrixdynamic", name: "m9", columns: [{ name: "score", cellType: "rating" }] },
        { type: "text", name: "q3", visibleIf: "{m9[0].score} > 3" },
      ],
    }, "expression/contradiction")).toHaveLength(0);
  });
});
