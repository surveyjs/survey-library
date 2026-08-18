import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

// Per-item conditions (a choice's/rate value's own visibleIf/enableIf) legitimately
// reference the owning question to filter items by its current value - the documented
// exclusive-"none" idiom. The runtime converges: only the item hides, the question
// value is not cleared. reference/self must fire only for element-level conditions.
const selfRefs = (json: any): Array<ILintFinding> =>
  lintSurvey(json).findings.filter(f => f.ruleId === "reference/self");

describe("reference/self and per-item conditions", () => {
  test("choice-level visibleIf referencing the owning question is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "checkbox",
        name: "q1",
        choices: ["a", "b", { value: "none", visibleIf: "{q1} notcontains 'a'" }],
      }],
    })).toHaveLength(0);
  });
  test("choice-level enableIf referencing the owner via valueName is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "checkbox",
        name: "q1",
        valueName: "v1",
        choices: ["a", { value: "b", enableIf: "{v1} notcontains 'a'" }],
      }],
    })).toHaveLength(0);
  });
  test("rate-value visibleIf referencing the owning rating is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "rating",
        name: "q1",
        rateValues: [1, 2, { value: 3, visibleIf: "{q1} notempty" }],
      }],
    })).toHaveLength(0);
  });
  test("column-choice visibleIf referencing the own column via row. is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "matrixdropdown",
        name: "m",
        rows: ["r1"],
        columns: [{
          name: "col1",
          cellType: "checkbox",
          choices: ["x", { value: "y", visibleIf: "{row.col1} notcontains 'x'" }],
        }],
      }],
    })).toHaveLength(0);
  });
  test("question-level self references are still reported", () => {
    expect(selfRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{q1} notempty" }],
    })).toHaveLength(1);
    expect(selfRefs({
      elements: [{ type: "text", name: "q1", enableIf: "{self} notempty" }],
    })).toHaveLength(1);
  });
});
