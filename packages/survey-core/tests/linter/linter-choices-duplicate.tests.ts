import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { withSettings } from "./lint-test-helpers";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "choices/duplicate");
}

describe("choices/duplicate - repeated values", () => {
  test("a value listed twice in choices is flagged on the second item", () => {
    const findings = byRule({
      elements: [{ type: "radiogroup", name: "q1", choices: ["red", "green", "red"] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("duplicateValue");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("elements[0].choices[2]");
    expect(findings[0].messageData.value).toBe("red");
    expect(findings[0].related.map(r => r.path)).toEqual(["elements[0].choices[0]"]);
  });
  test("values equal at runtime but written differently are flagged", () => {
    const findings = byRule({
      elements: [{ type: "dropdown", name: "q1", choices: [1, "1"] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("duplicateValue");
  });
  test("the object item form is read through its value", () => {
    const findings = byRule({
      elements: [{
        type: "dropdown", name: "q1",
        choices: [{ value: "a", text: "First" }, { value: "a", text: "Second" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].choices[1]");
  });
  test("a value listed three times is reported once per extra item", () => {
    const findings = byRule({
      elements: [{ type: "dropdown", name: "q1", choices: ["a", "a", "a"] }],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.path)).toEqual(["elements[0].choices[1]", "elements[0].choices[2]"]);
  });
  test("duplicate rating rateValues are flagged", () => {
    const findings = byRule({
      elements: [{ type: "rating", name: "r1", rateValues: [1, 2, 2] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.prop).toBe("rateValues");
  });
  test("duplicate rows and columns of a single-choice matrix are flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrix", name: "m1",
        rows: ["r1", "r1"], columns: ["c1", "c1"],
      }],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.messageData.prop).sort()).toEqual(["columns", "rows"]);
  });
  test("duplicate rows of a matrixdropdown are flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdropdown", name: "m1",
        rows: ["r1", "r1"], columns: [{ name: "c1" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.prop).toBe("rows");
  });
  test("the shared choices of a matrix are checked once, not per column", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdropdown", name: "m1", rows: ["r1"], choices: ["a", "a"],
        columns: [{ name: "c1" }, { name: "c2" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].choices[1]");
  });
  test("the own choices of a matrix column are flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdropdown", name: "m1", rows: ["r1"],
        columns: [{ name: "c1", cellType: "dropdown", choices: ["a", "a"] }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[0].choices[1]");
  });
  test("choices inside a dynamic panel template are flagged", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "dropdown", name: "inner", choices: ["a", "a"] }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].elementName).toBe("inner");
  });
  test("distinct values across questions and arrays stay clean", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b"] },
        { type: "dropdown", name: "q2", choices: ["a", "b"] },
        { type: "matrix", name: "m1", rows: ["a", "b"], columns: ["a", "b"] },
      ],
    })).toHaveLength(0);
  });
  test("a carry-forward question is left alone", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "src", choices: ["a", "b"] },
        { type: "dropdown", name: "q1", choicesFromQuestion: "src", choices: ["a", "a"] },
      ],
    })).toHaveLength(0);
  });
  test("duplicate column names of a matrixdropdown are left to name/duplicate", () => {
    expect(byRule({
      elements: [{
        type: "matrixdropdown", name: "m1", rows: ["r1"],
        columns: [{ name: "c1" }, { name: "c1" }],
      }],
    })).toHaveLength(0);
  });
});

describe("choices/duplicate - special items", () => {
  test("a choice colliding with the None item is flagged", () => {
    const findings = byRule({
      elements: [{ type: "dropdown", name: "q1", choices: ["red", "none"], showNoneItem: true }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("specialItemCollision");
    expect(findings[0].messageData.specialItem).toBe("none");
    expect(findings[0].messageData.toggleProp).toBe("showNoneItem");
  });
  test("a choice colliding with the Other item is flagged", () => {
    const findings = byRule({
      elements: [{ type: "checkbox", name: "q1", choices: ["a", "other"], hasOther: true }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.specialItem).toBe("other");
  });
  test("the refuse and dontknow items are covered", () => {
    const findings = byRule({
      elements: [{
        type: "dropdown", name: "q1", choices: ["refused", "dontknow"],
        showRefuseItem: true, showDontKnowItem: true,
      }],
    });
    expect(findings).toHaveLength(2);
  });
  test("a customized noneItemValue is honoured", () => {
    withSettings({ noneItemValue: "nothing" }, () => {
      const findings = byRule({
        elements: [{ type: "dropdown", name: "q1", choices: ["nothing"], showNoneItem: true }],
      });
      expect(findings).toHaveLength(1);
      expect(findings[0].messageData.value).toBe("nothing");
    });
    expect(byRule({
      elements: [{ type: "dropdown", name: "q1", choices: ["nothing"], showNoneItem: true }],
    })).toHaveLength(0);
  });
  test("the same value without the toggle is clean", () => {
    expect(byRule({
      elements: [{ type: "dropdown", name: "q1", choices: ["red", "none", "other"] }],
    })).toHaveLength(0);
  });
});

describe("choices/duplicate - configuration", () => {
  test("the rule can be switched off", () => {
    const result = lintSurvey(
      { elements: [{ type: "dropdown", name: "q1", choices: ["a", "a"] }] },
      { rules: { "choices/duplicate": "off" } });
    expect(result.findings.filter(f => f.ruleId === "choices/duplicate")).toHaveLength(0);
  });
  test("a finding is suppressed by path", () => {
    const result = lintSurvey(
      { elements: [{ type: "dropdown", name: "q1", choices: ["a", "a"] }] },
      { suppress: [{ ruleId: "choices/duplicate", path: "elements[0].*" }] });
    expect(result.findings.filter(f => f.ruleId === "choices/duplicate")).toHaveLength(0);
  });
});
