import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
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
