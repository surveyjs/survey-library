import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";

// The published survey-core/linter is a standalone bundle with its own copies of
// settings and FunctionFactory (deliberate isolation, see rollup.config.mjs), so
// runtime customizations made through the app's "survey-core" import are invisible
// to it. options.functions / options.settings let the app hand its own instances in:
//   lintSurvey(json, { settings, functions: FunctionFactory.Instance })
describe("runtime options injection", () => {
  test("custom functions via options.functions", () => {
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "myAge({q1}) > 18" }] };
    const without = lintSurvey(json);
    expect(without.findings.filter(f => f.ruleId === "expression/unknown-function")).toHaveLength(1);
    const res = lintSurvey(json, {
      functions: { hasFunction: name => name === "myAge", getAll: () => ["myAge"] },
    });
    expect(res.findings.filter(f => f.ruleId === "expression/unknown-function")).toHaveLength(0);
  });
  test("injected functions feed typo suggestions", () => {
    const res = lintSurvey(
      { elements: [{ type: "text", name: "q1", visibleIf: "myAg({q1}) > 18" }] },
      { functions: { hasFunction: name => name === "myAge", getAll: () => ["myAge"] } });
    const findings = res.findings.filter(f => f.ruleId === "expression/unknown-function");
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("myAge");
  });
  test("options.settings.expressionVariables overrides scope prefixes", () => {
    const json = {
      elements: [{
        type: "matrixdynamic",
        name: "m",
        columns: [{ name: "col1" }, { name: "col2", visibleIf: "{fila.col1} notempty" }],
      }],
    };
    const without = lintSurvey(json);
    expect(without.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(1);
    const res = lintSurvey(json, { settings: { expressionVariables: { row: "fila" } } });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
  });
  test("options.settings.noneItemValue is used for choice checks", () => {
    const json = {
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b"], showNoneItem: true },
        { type: "text", name: "q2", visibleIf: "{q1} = 'nada'" },
      ],
    };
    const without = lintSurvey(json);
    expect(without.findings.filter(f => f.ruleId === "expression/unknown-choice")).toHaveLength(1);
    const res = lintSurvey(json, { settings: { noneItemValue: "nada" } });
    expect(res.findings.filter(f => f.ruleId === "expression/unknown-choice")).toHaveLength(0);
  });
});
