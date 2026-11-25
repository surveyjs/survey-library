import { describe, test, expect } from "vitest";
import { Model } from "survey-core";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

// A calculated value has settled when one more run of its expression returns the value it holds
function expectSettled(survey: Model, calculatedValues: Array<{ name: string, expression: string }>): void {
  calculatedValues.forEach(cv => {
    expect(survey.runExpression(cv.expression), cv.name).toEqual(survey.getVariable(cv.name));
  });
}

describe("cycle/calculated-value", () => {
  test("two calculated values depending on each other", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "subtotal", inputType: "number" }],
      calculatedValues: [
        { name: "total", expression: "{subtotal} - {discount}" },
        { name: "discount", expression: "{total} * 0.1" },
      ],
    }, "cycle/calculated-value");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.cycle).toEqual(["discount", "total", "discount"]);
    expect(findings[0].related).toHaveLength(2);
    expect(findings[0].reproduction).toBeDefined();
    expect(findings[0].reproduction.steps[0]).toEqual({ set: { subtotal: 1 } });
  });
  test("self-loop is a 1-cycle with its own message", () => {
    const findings = byRule({
      calculatedValues: [{ name: "a", expression: "{a} + 1" }],
    }, "cycle/calculated-value");
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("references itself");
  });
  test("a self-loop that computes from itself does not settle at runtime", () => {
    const json = { calculatedValues: [{ name: "a", expression: "{a} + 1" }] };
    const survey = new Model(json);
    // each pass at load starts from the previous result
    expect(survey.getVariable("a")).toBeGreaterThan(1);
    expect(byRule(json, "cycle/calculated-value")).toHaveLength(1);
  });
  test("a fallback self-reference settles and is not reported (#12407)", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [
        { name: "a", expression: "{a} || 'first'" },
        { name: "b", expression: "{b} || {q1} || 'none'" },
        { name: "c", expression: "iif({c} empty, 'first', {c})" },
        { name: "d", expression: "iif({d} notempty, {d}, 'first')" },
      ],
    };
    expect(byRule(json, "cycle/calculated-value")).toHaveLength(0);
    expect(byRule(json, "cycle/value-write")).toHaveLength(0);
    const survey = new Model(json);
    expect(survey.getVariable("a")).toBe("first");
    expect(survey.getVariable("b")).toBe("none");
    expect(survey.getVariable("c")).toBe("first");
    expect(survey.getVariable("d")).toBe("first");
    survey.setValue("q1", "x");
    expect(survey.getVariable("a")).toBe("first");
    expect(survey.getVariable("b")).toBe("none");
  });
  test("a fallback in parentheses, with a function, or passing the value through is not reported", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [
        { name: "a", expression: "({a} || today())" },
        { name: "b", expression: "{b} || 'x' || 'y'" },
        { name: "c", expression: "{q1} || {c}" },
        { name: "d", expression: "iif({q1} = 1, {d}, 'other')" },
      ],
    };
    expect(byRule(json, "cycle/calculated-value")).toHaveLength(0);
    const survey = new Model(json);
    expectSettled(survey, json.calculatedValues);
    survey.setValue("q1", "v");
    expect(survey.getVariable("c")).toBe("v");
    expectSettled(survey, json.calculatedValues);
  });
  test("an iif() returning the value itself in one branch settles, whatever its condition", () => {
    const json = {
      elements: [{ type: "text", name: "reset" }],
      calculatedValues: [
        { name: "a", expression: "iif({a} = '', 'first', {a})" },
        { name: "b", expression: "iif({reset} = true or {b} empty, 'first', {b})" },
        { name: "c", expression: "iif({c} > 5, {c}, 10)" },
      ],
    };
    expect(byRule(json, "cycle/calculated-value")).toHaveLength(0);
    const survey = new Model(json);
    expect(["a", "b", "c"].map(name => survey.getVariable(name))).toEqual(["first", "first", 10]);
    expectSettled(survey, json.calculatedValues);
    survey.setValue("reset", true);
    expectSettled(survey, json.calculatedValues);
  });
  test("a self-reference that computes a new value is still a cycle", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [
        { name: "a", expression: "({a} || 0) + 1" },
        { name: "b", expression: "iif({b} empty, 1, {b} + 1)" },
        { name: "c", expression: "iif({c} = 1, 2, 1)" },
        { name: "d", expression: "sum({d}, 1)" },
      ],
    };
    const findings = byRule(json, "cycle/calculated-value");
    expect(findings.map(f => f.elementName)).toEqual(["a", "b", "c", "d"]);
    // one more run moves each of them away from the value the load left
    const survey = new Model(json);
    json.calculatedValues.forEach(cv => {
      expect(survey.runExpression(cv.expression), cv.name).not.toEqual(survey.getVariable(cv.name));
    });
  });
  test("a calculated value reading its own length computes from itself", () => {
    const json = { calculatedValues: [{ name: "a", expression: "{a.length} || 'abc'" }] };
    expect(byRule(json, "cycle/calculated-value")).toHaveLength(1);
    const survey = new Model(json);
    expect(survey.getVariable("a")).toBe("abc");
    expect(survey.runExpression("{a.length} || 'abc'")).toBe(3);
  });
  test("a loop between two values is still an error when each falls back", () => {
    const json = {
      calculatedValues: [
        { name: "a", expression: "{b} || 1" },
        { name: "b", expression: "{a} || 2" },
      ],
    };
    const findings = byRule(json, "cycle/calculated-value");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("loop");
    expect(findings[0].severity).toBe("error");
    // the values depend on the order the two are declared in
    const survey = new Model(json);
    expect([survey.getVariable("a"), survey.getVariable("b")]).toEqual([2, 2]);
    const reversed = new Model({ calculatedValues: json.calculatedValues.slice().reverse() });
    expect([reversed.getVariable("a"), reversed.getVariable("b")]).toEqual([1, 1]);
  });
  test("three-member cycle reported once", () => {
    const findings = byRule({
      calculatedValues: [
        { name: "a", expression: "{c} + 1" },
        { name: "b", expression: "{a} + 1" },
        { name: "c", expression: "{b} + 1" },
      ],
    }, "cycle/calculated-value");
    expect(findings).toHaveLength(1);
    expect(findings[0].related).toHaveLength(3);
  });
  test("diamond dependency without a cycle is clean", () => {
    expect(byRule({
      elements: [{ type: "text", name: "x", inputType: "number" }],
      calculatedValues: [
        { name: "a", expression: "{x} + 1" },
        { name: "b", expression: "{x} + 2" },
        { name: "c", expression: "{a} + {b}" },
      ],
    }, "cycle/calculated-value")).toHaveLength(0);
  });
  test("case-insensitive references still form a cycle", () => {
    expect(byRule({
      calculatedValues: [
        { name: "Total", expression: "{Discount} + 1" },
        { name: "Discount", expression: "{TOTAL} + 1" },
      ],
    }, "cycle/calculated-value")).toHaveLength(1);
  });
});

describe("cycle/trigger", () => {
  test("two setvalue triggers reacting to each other", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "a", inputType: "number" },
        { type: "text", name: "b", inputType: "number" },
      ],
      triggers: [
        { type: "setvalue", expression: "{a} = 1", setToName: "b", setValue: 1 },
        { type: "setvalue", expression: "{b} = 1", setToName: "a", setValue: 1 },
      ],
    }, "cycle/trigger");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].related).toHaveLength(2);
    expect(findings[0].reproduction.steps[0]).toEqual({ set: { a: 1 } });
  });
  test("trigger reacting to its own set value is a self-loop", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "a", inputType: "number" }],
      triggers: [
        { type: "runexpression", expression: "{a} > 0", setToName: "a", runExpression: "{a} + 1" },
      ],
    }, "cycle/trigger");
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("sets itself");
  });
  test("indexed setToName cycles through the root name", () => {
    const findings = byRule({
      elements: [
        { type: "paneldynamic", name: "panel1", templateElements: [{ type: "text", name: "q1" }] },
        { type: "text", name: "flag" },
      ],
      triggers: [
        { type: "copyvalue", expression: "{flag} = 1", setToName: "panel1[0].q1", fromName: "flag" },
        { type: "setvalue", expression: "{panel1} notempty", setToName: "flag", setValue: 1 },
      ],
    }, "cycle/trigger");
    expect(findings).toHaveLength(1);
  });
  test("legacy-form trigger participates in a cycle", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b" },
      ],
      triggers: [
        { type: "setvalue", name: "a", operator: "equal", value: 1, setToName: "b", setValue: 1 },
        { type: "setvalue", expression: "{b} = 1", setToName: "a", setValue: 1 },
      ],
    }, "cycle/trigger");
    expect(findings).toHaveLength(1);
  });
  test("independent triggers are clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b" },
        { type: "text", name: "c" },
      ],
      triggers: [
        { type: "setvalue", expression: "{a} = 1", setToName: "b", setValue: 1 },
        { type: "setvalue", expression: "{b} = 1", setToName: "c", setValue: 1 },
      ],
    }, "cycle/trigger")).toHaveLength(0);
  });
});

describe("cycle/trigger through valueName", () => {
  // triggers write and expressions read data keys: setting q1 stores under its
  // valueName "v1", so a trigger reacting to {v1} closes a genuine runtime loop
  test("a cycle where one edge goes through a question's valueName is detected", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1", valueName: "v1" },
        { type: "text", name: "flag" },
      ],
      triggers: [
        { type: "setvalue", expression: "{flag} = 1", setToName: "q1", setToValue: 2 },
        { type: "setvalue", expression: "{v1} = 2", setToName: "flag", setToValue: 1 },
      ],
    }, "cycle/trigger");
    expect(findings).toHaveLength(1);
  });
});
