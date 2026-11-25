import { describe, test, expect } from "vitest";
import { Model } from "survey-core";
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
  test("{self} in setValueExpression counts as the own value", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", setValueExpression: "{self} + 1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("self");
  });
  test("defaultValueExpression computing from its own value is flagged", () => {
    const json = { elements: [{ type: "text", name: "q1", defaultValueExpression: "{q1} + 1" }] };
    const findings = byRule(json);
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("self");
    expect(findings[0].message).toContain("previous result");
    // each run at load starts from the previous result, and one more run moves it again
    const survey = new Model(json);
    expect(survey.getValue("q1")).toBeGreaterThan(1);
    expect(survey.runExpression("{q1} + 1")).not.toBe(survey.getValue("q1"));
  });
  test("a setValueExpression reading its own length computes a new value", () => {
    ["{q1.length}", "iif({q1} notempty, {q1.length}, 0)"].forEach(expression => {
      const json = { elements: [{ type: "text", name: "q1", setValueExpression: expression }] };
      expect(byRule(json).map(f => f.reason), expression).toEqual(["self"]);
      const survey = new Model(json);
      survey.setValue("q1", "abc");
      expect(survey.getValue("q1"), expression).toBe(3);
    });
  });
  test("a self-reading setValueExpression rewrites the answer at runtime", () => {
    const json = { elements: [{ type: "text", name: "q1", setValueExpression: "{q1} + 1" }] };
    const survey = new Model(json);
    survey.setValue("q1", 5);
    expect(survey.getValue("q1")).toBe(6);
    expect(byRule(json)).toHaveLength(1);
  });
});

describe("cycle/value-write - self references that settle (#12407)", () => {
  test("a fallback defaultValueExpression is not flagged and applies at load", () => {
    const json = { elements: [{ type: "text", name: "q1", defaultValueExpression: "{q1} || 'n/a'" }] };
    expect(byRule(json)).toHaveLength(0);
    expect(new Model(json).getValue("q1")).toBe("n/a");
  });
  test("a fallback setValueExpression is not flagged and keeps the answer", () => {
    const json = {
      elements: [
        { type: "text", name: "q2" },
        { type: "text", name: "q1", setValueExpression: "{q1} || {q2}" },
      ],
    };
    expect(byRule(json)).toHaveLength(0);
    const survey = new Model(json);
    survey.setValue("q2", "a");
    expect(survey.getValue("q1")).toBe("a");
    survey.setValue("q2", "b");
    expect(survey.getValue("q1")).toBe("a");
  });
  test("iif fallbacks on the own value being empty are not flagged", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", defaultValueExpression: "iif({q1} empty, 'n/a', {q1})" },
        { type: "text", name: "q2", defaultValueExpression: "iif({q2} notempty, {q2}, 'n/a')" },
      ],
    };
    expect(byRule(json)).toHaveLength(0);
    const survey = new Model(json);
    expect(survey.getValue("q1")).toBe("n/a");
    expect(survey.getValue("q2")).toBe("n/a");
    survey.setValue("q1", "v");
    survey.setValue("q2", "w");
    expect(survey.getValue("q1")).toBe("v");
    expect(survey.getValue("q2")).toBe("w");
  });
  test("an iif() returning the own value in one branch is not flagged", () => {
    const json = { elements: [{ type: "text", name: "q1", setValueExpression: "iif({q1} = 'x', 'y', {q1})" }] };
    expect(byRule(json)).toHaveLength(0);
    const survey = new Model(json);
    survey.setValue("q1", "x");
    expect(survey.getValue("q1")).toBe("y");
    survey.setValue("q1", "z");
    expect(survey.getValue("q1")).toBe("z");
  });
  test("a setValueIf guard reading the own value is not flagged and runs", () => {
    const json = {
      elements: [
        { type: "text", name: "status" },
        {
          type: "text", name: "closedAt",
          setValueIf: "{status} = 'closed' and {closedAt} empty", setValueExpression: "'set'",
        },
      ],
    };
    expect(byRule(json)).toHaveLength(0);
    const survey = new Model(json);
    survey.setValue("status", "closed");
    expect(survey.getValue("closedAt")).toBe("set");
    survey.setValue("status", "reopened");
    expect(survey.getValue("closedAt")).toBe("set");
  });
  test("a setValueIf guard reading only the own value is not flagged", () => {
    const json = {
      elements: [
        { type: "text", name: "q2" },
        { type: "text", name: "q1", setValueIf: "{q1} empty", setValueExpression: "{q2}" },
      ],
    };
    expect(byRule(json)).toHaveLength(0);
    const survey = new Model(json);
    survey.setValue("q2", "a");
    expect(survey.getValue("q1")).toBe("a");
    survey.setValue("q2", "b");
    expect(survey.getValue("q1")).toBe("a");
  });
  test("resetValueIf reading its own value is not flagged and resets the answer", () => {
    const json = { elements: [{ type: "text", name: "q1", resetValueIf: "{q1} = 'x'" }] };
    expect(byRule(json)).toHaveLength(0);
    const survey = new Model(json);
    survey.setValue("q1", "x");
    expect(survey.getValue("q1")).toBeUndefined();
  });
  test("an expression that only copies its own value is flagged as a no-op", () => {
    const json = { elements: [{ type: "text", name: "q1", defaultValueExpression: "{q1}" }] };
    const findings = byRule(json);
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("copiesItself");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].message).toContain("never");
    expect(new Model(json).getValue("q1")).toBeUndefined();
  });
  test("{self} alone only copies the own value too", () => {
    const json = { elements: [{ type: "text", name: "q1", setValueExpression: "{self}" }] };
    const findings = byRule(json);
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("copiesItself");
    const survey = new Model(json);
    expect(survey.getValue("q1")).toBeUndefined();
    survey.setValue("q1", "v");
    expect(survey.getValue("q1")).toBe("v");
  });
  test("a calculated value that only copies itself is a warning, not an error", () => {
    const json = { calculatedValues: [{ name: "c1", expression: "{c1}" }] };
    expect(byRule(json, "cycle/calculated-value")).toHaveLength(0);
    const findings = byRule(json);
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("copiesItself");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("calculatedValues[0].expression");
    expect(new Model(json).getVariable("c1")).toBeUndefined();
  });
  test("a calculated value that only copies itself is named and can be suppressed by name", () => {
    const json = { calculatedValues: [{ name: "c1", expression: "{c1}" }] };
    const findings = byRule(json);
    expect(findings).toHaveLength(1);
    expect(findings[0].elementName).toBe("c1");
    expect(findings[0].elementType).toBe("calculatedvalue");
    const suppressed = lintSurvey(json, { suppress: [{ elementName: "c1" }] }).findings;
    expect(suppressed.filter(f => f.ruleId === "cycle/value-write")).toHaveLength(0);
    expect(new Model(json).getVariable("c1")).toBeUndefined();
  });
});

describe("cycle/value-write - inArray filters", () => {
  const matrix = (): any => ({ type: "matrixdynamic", name: "m", columns: [{ name: "col", cellType: "text" }] });
  const rows = [{ col: 1 }, { col: 5 }];
  test("a setValueExpression reading its own value in an inArray filter computes from it", () => {
    const json = { elements: [matrix(), { type: "text", name: "q1", setValueExpression: "sumInArray({m}, 'col', {col} > {q1})" }] };
    expect(byRule(json).map(f => f.reason)).toEqual(["self"]);
    const survey = new Model(json);
    survey.setValue("m", rows);
    survey.setValue("q1", 0);
    expect(survey.getValue("q1")).toBe(6);
  });
  test("a calculated value reading a question in an inArray filter loops with it", () => {
    const json = {
      elements: [matrix(), { type: "text", name: "q1", setValueExpression: "{cnt} + 1" }],
      calculatedValues: [{ name: "cnt", expression: "sumInArray({m}, 'col', {col} > {q1})" }],
    };
    expect(byRule(json).map(f => f.reason)).toEqual(["loop"]);
    const survey = new Model(json);
    survey.setValue("m", rows);
    survey.setValue("q1", 0);
    // the loop stops with q1 out of step with the value it is computed from ({cnt} + 1)
    expect([survey.getValue("q1"), survey.getVariable("cnt")]).toEqual([7, 0]);
  });
  test("a trigger reading a question in an inArray filter loops with it", () => {
    const json = {
      elements: [matrix(), { type: "text", name: "q2" }, { type: "text", name: "q1", setValueExpression: "{q2} + 1" }],
      triggers: [{ type: "setvalue", expression: "countInArray({m}, 'col', {col} > {q1}) >= 0", setToName: "q2", setValue: 10 }],
    };
    expect(byRule(json).map(f => f.reason)).toEqual(["loop"]);
    const survey = new Model(json);
    survey.setValue("m", rows);
    survey.setValue("q1", 0);
    // the trigger ran on the change of q1, and q1 is out of step with the value it is computed from ({q2} + 1)
    expect([survey.getValue("q1"), survey.getValue("q2")]).toEqual([0, 10]);
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
