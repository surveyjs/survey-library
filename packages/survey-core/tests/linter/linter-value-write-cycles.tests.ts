import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId = "cycle/value-write"): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

describe("cycle/value-write - loops between questions", () => {
  test("a setValueExpression pair reading each other is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "a", inputType: "number", setValueExpression: "{b} + 1" },
        { type: "text", name: "b", inputType: "number", setValueExpression: "{a} + 1" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("loop");
    expect(findings[0].severity).toBe("warning");
  });
  test("a defaultValueExpression pair is flagged with the until-answered caveat", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "a", defaultValueExpression: "{b}" },
        { type: "text", name: "b", defaultValueExpression: "{a}" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("until");
  });
  test("a valueName is the same slot as its question", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "a", setValueExpression: "{v} + 1" },
        { type: "text", name: "b", valueName: "v", setValueExpression: "{a} + 1" },
      ],
    })).toHaveLength(1);
  });
  test("a chain without a loop is clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b", setValueExpression: "{a} + 1" },
        { type: "text", name: "c", setValueExpression: "{b} + 1" },
      ],
    })).toHaveLength(0);
  });
  test("a template question inside a dynamic panel builds no node", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p1", templateElements: [
          { type: "text", name: "a", setValueExpression: "{b} + 1" },
          { type: "text", name: "b", setValueExpression: "{a} + 1" },
        ],
      }],
    })).toHaveLength(0);
  });
  test("an ambiguous name is left out", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "dup", setValueExpression: "{b} + 1" },
        { type: "text", name: "dup" },
        { type: "text", name: "b", setValueExpression: "{dup} + 1" },
      ],
    })).toHaveLength(0);
  });
});

describe("cycle/value-write - self references", () => {
  test("resetValueIf reading its own value is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q13", resetValueIf: "{q13} = 'x'" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("self");
  });
  test("{self} in setValueExpression counts as the own value", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", setValueExpression: "{self} + 1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("self");
  });
  test("defaultValueExpression reading its own value is flagged", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", defaultValueExpression: "{q1} + 1" }],
    })).toHaveLength(1);
  });
  test("setValueIf reading the question it guards is fine alone", () => {
    // the guard reads q1, the expression writes from elsewhere - still a self edge on q1
    const findings = byRule({
      elements: [
        { type: "text", name: "q2" },
        { type: "text", name: "q1", setValueIf: "{q1} empty", setValueExpression: "{q2}" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("self");
  });
});

describe("cycle/value-write - across domains", () => {
  test("a trigger and a calculated value looping through a question are flagged", () => {
    const findings = byRule({
      calculatedValues: [{ name: "cv", expression: "{q5} + 1" }],
      triggers: [{
        type: "runexpression", expression: "{cv} > 0",
        runExpression: "{cv} * 2", setToName: "q5",
      }],
      elements: [{ type: "text", name: "q5", inputType: "number" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("loop");
  });
  test("a loop of calculated values alone is left to cycle/calculated-value", () => {
    const json = {
      calculatedValues: [
        { name: "c1", expression: "{c2} + 1" },
        { name: "c2", expression: "{c1} + 1" },
      ],
      elements: [{ type: "text", name: "q1" }],
    };
    expect(byRule(json)).toHaveLength(0);
    expect(byRule(json, "cycle/calculated-value")).toHaveLength(1);
  });
  test("a loop of triggers alone is left to cycle/trigger", () => {
    const json = {
      elements: [
        { type: "text", name: "a", inputType: "number" },
        { type: "text", name: "b", inputType: "number" },
      ],
      triggers: [
        { type: "setvalue", expression: "{a} > 0", setToName: "b", setValue: 1 },
        { type: "setvalue", expression: "{b} > 0", setToName: "a", setValue: 1 },
      ],
    };
    expect(byRule(json)).toHaveLength(0);
    expect(byRule(json, "cycle/trigger")).toHaveLength(1);
  });
});

describe("cycle/trigger - runExpression and fromName edges", () => {
  test("triggers looping through runExpression reads are flagged", () => {
    const json = {
      elements: [
        { type: "text", name: "x" },
        { type: "text", name: "a", inputType: "number" },
        { type: "text", name: "b", inputType: "number" },
      ],
      triggers: [
        { type: "runexpression", expression: "{x} notempty", runExpression: "{b} + 1", setToName: "a" },
        { type: "runexpression", expression: "{x} notempty", runExpression: "{a} + 1", setToName: "b" },
      ],
    };
    expect(byRule(json, "cycle/trigger")).toHaveLength(1);
    expect(byRule(json)).toHaveLength(0);
  });
  test("copyvalue triggers looping through fromName are flagged", () => {
    const json = {
      elements: [
        { type: "text", name: "x" },
        { type: "text", name: "a" },
        { type: "text", name: "b" },
      ],
      triggers: [
        { type: "copyvalue", expression: "{x} notempty", fromName: "b", setToName: "a" },
        { type: "copyvalue", expression: "{x} notempty", fromName: "a", setToName: "b" },
      ],
    };
    expect(byRule(json, "cycle/trigger")).toHaveLength(1);
  });
});
