import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";
import { withFunction, withSettings } from "./lint-test-helpers";

// survey-core is external to the linter bundle, so both share one module closure:
// a function registered in FunctionFactory.Instance and a customized setting are
// visible to the linter without being passed in.
describe("shared survey-core closure", () => {
  test("a function registered at runtime is known to the linter", () => {
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "myAge({q1}) > 18" }] };
    expect(lintSurvey(json).findings
      .filter(f => f.ruleId === "expression/unknown-function")).toHaveLength(1);
    withFunction("myAge", () => 0, () => {
      expect(lintSurvey(json).findings
        .filter(f => f.ruleId === "expression/unknown-function")).toHaveLength(0);
    });
  });

  test("a registered function feeds typo suggestions", () => {
    withFunction("myAge", () => 0, () => {
      const findings = lintSurvey({ elements: [{ type: "text", name: "q1", visibleIf: "myAg({q1}) > 18" }] })
        .findings.filter(f => f.ruleId === "expression/unknown-function");
      expect(findings).toHaveLength(1);
      expect(findings[0].suggestion).toBe("myAge");
    });
  });

  test("settings.expressionVariables renames scope prefixes", () => {
    const json = {
      elements: [{
        type: "matrixdynamic",
        name: "m",
        columns: [{ name: "col1" }, { name: "col2", visibleIf: "{fila.col1} notempty" }],
      }],
    };
    expect(lintSurvey(json).findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(1);
    withSettings({ "expressionVariables.row": "fila" }, () => {
      expect(lintSurvey(json).findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
    });
  });

  test("settings.noneItemValue is used for choice checks", () => {
    const json = {
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b"], showNoneItem: true },
        { type: "text", name: "q2", visibleIf: "{q1} = 'nada'" },
      ],
    };
    expect(lintSurvey(json).findings.filter(f => f.ruleId === "expression/unknown-choice")).toHaveLength(1);
    withSettings({ noneItemValue: "nada" }, () => {
      expect(lintSurvey(json).findings.filter(f => f.ruleId === "expression/unknown-choice")).toHaveLength(0);
    });
  });

  test("a settings change is restored after the run", () => {
    withSettings({ commentSuffix: "-Note" }, () => { /* mutated inside */ });
    const json = {
      elements: [
        { type: "text", name: "q1", showCommentArea: true },
        { type: "text", name: "q2", visibleIf: "{q1-Note} notempty" },
      ],
    };
    expect(lintSurvey(json).findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(1);
  });
});
