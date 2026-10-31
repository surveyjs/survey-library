import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function findingsOf(json: any, ruleId?: string): Array<ILintFinding> {
  const all = lintSurvey(json).findings;
  return ruleId ? all.filter(f => f.ruleId === ruleId) : all;
}

function unknownChoiceOf(source: any, condition: string): Array<ILintFinding> {
  return findingsOf({
    elements: [source, { type: "text", name: "guarded", visibleIf: condition }],
  }, "expression/unknown-choice");
}

describe("a rating question lists its values in rateValues", () => {
  const rating = { type: "rating", name: "r", rateValues: [1, 2, 3] };
  test("a comparison against a value it cannot hold", () => {
    const findings = unknownChoiceOf(rating, "{r} = 11");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("notAmongChoices");
    expect(findings[0].messageData.values).toEqual([11]);
    expect(findings[0].messageData.available).toEqual([1, 2, 3]);
  });
  test("a comparison it can hold is left alone", () => {
    expect(unknownChoiceOf(rating, "{r} = 2")).toHaveLength(0);
  });
  test("rateValues written as items are read by value", () => {
    const findings = unknownChoiceOf(
      { type: "rating", name: "r", rateValues: [{ value: "low", text: "Low" }, { value: "high" }] },
      "{r} = 'medium'");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.available).toEqual(["low", "high"]);
  });
  test("a rating without rateValues is left to the range analysis", () => {
    expect(unknownChoiceOf({ type: "rating", name: "r", rateMax: 5 }, "{r} = 11")).toHaveLength(0);
  });
});

describe("a single-choice matrix answers with one of its columns", () => {
  const matrix = { type: "matrix", name: "m", rows: ["r1", "r2"], columns: ["col1", "col2"] };
  test("a row compared to something no column can be", () => {
    const findings = unknownChoiceOf(matrix, "{m.r1} = 'nope'");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("notAmongChoices");
    expect(findings[0].messageData.available).toEqual(["col1", "col2"]);
    expect(findings[0].messageData.name).toBe("m.r1");
  });
  test("a column value is fine", () => {
    expect(unknownChoiceOf(matrix, "{m.r1} = 'col2'")).toHaveLength(0);
  });
  test("an unknown row is left to reference/unknown", () => {
    expect(unknownChoiceOf(matrix, "{m.nope} = 'x'")).toHaveLength(0);
    expect(findingsOf({
      elements: [matrix, { type: "text", name: "guarded", visibleIf: "{m.nope} = 'x'" }],
    }, "reference/unknown")).toHaveLength(1);
  });
  test("the matrix itself holds an object, not a column value", () => {
    expect(unknownChoiceOf(matrix, "{m} = 'col1'")).toHaveLength(0);
  });
});

describe("a boolean question with its own true and false values", () => {
  const bool = { type: "boolean", name: "b", valueTrue: "yes", valueFalse: "no" };
  test("a comparison against a third value", () => {
    const findings = unknownChoiceOf(bool, "{b} = 'maybe'");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.available).toEqual(["yes", "no"]);
  });
  test("either of its two values is fine", () => {
    expect(unknownChoiceOf(bool, "{b} = 'yes'")).toHaveLength(0);
    expect(unknownChoiceOf(bool, "{b} = 'no'")).toHaveLength(0);
  });
  test("only one side given leaves the other at the built-in default", () => {
    const findings = unknownChoiceOf(
      { type: "boolean", name: "b", valueTrue: "yes" }, "{b} = 'maybe'");
    expect(findings).toHaveLength(1);
  });
  test("a plain boolean question stays with expression/type-mismatch", () => {
    expect(unknownChoiceOf({ type: "boolean", name: "b" }, "{b} = 'maybe'")).toHaveLength(0);
    expect(findingsOf({
      elements: [{ type: "boolean", name: "b" }, { type: "text", name: "guarded", visibleIf: "{b} = 'maybe'" }],
    }, "expression/type-mismatch")).toHaveLength(1);
  });
});

describe("a set that is not exhaustive is no set at all", () => {
  test("a question with no listed choice takes them from outside the JSON", () => {
    expect(unknownChoiceOf(
      { type: "dropdown", name: "q1", showOtherItem: true }, "{q1} = 'x'")).toHaveLength(0);
  });
});
