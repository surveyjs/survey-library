import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

describe("expression sites - expression/unknown-choice", () => {
  test("a typo inside iif() in setValueExpression is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "dropdown", name: "color", choices: ["red", "green"] },
        { type: "text", name: "q7", setValueExpression: "iif({color} = 'blue', 1, 2)" },
      ],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("notAmongChoices");
    expect(findings[0].messageData.prop).toBe("setValueExpression");
    expect(findings[0].message).toContain("The expression");
  });
  test("a typo inside iif() in defaultValueExpression is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "dropdown", name: "color", choices: ["red", "green"] },
        { type: "text", name: "q8", defaultValueExpression: "iif({color} = 'blue', 1, 2)" },
      ],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
  });
  test("a typo in a calculated value expression is flagged", () => {
    const findings = byRule({
      calculatedValues: [{ name: "cv", expression: "iif({color} = 'blue', 1, 2)" }],
      elements: [{ type: "dropdown", name: "color", choices: ["red", "green"] }],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
  });
  test("a typo in a trigger runExpression is flagged", () => {
    const findings = byRule({
      triggers: [{
        type: "runexpression", expression: "{color} notempty",
        runExpression: "iif({color} = 'blue', 1, 2)", setToName: "q9",
      }],
      elements: [
        { type: "dropdown", name: "color", choices: ["red", "green"] },
        { type: "text", name: "q9" },
      ],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
  });
  test("a listed choice inside iif() is clean", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "color", choices: ["red", "green"] },
        { type: "text", name: "q7", setValueExpression: "iif({color} = 'red', 1, 2)" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("a condition site still reads as a condition", () => {
    const findings = byRule({
      elements: [
        { type: "dropdown", name: "color", choices: ["red", "green"] },
        { type: "text", name: "q7", visibleIf: "{color} = 'blue'" },
      ],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("The condition");
  });
});

describe("expression sites - expression/type-mismatch", () => {
  test("boolean vs string inside iif() in setValueExpression is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "boolean", name: "agree" },
        { type: "text", name: "q7", setValueExpression: "iif({agree} = 'yes', 1, 2)" },
      ],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("boolean-vs-const");
    expect(findings[0].messageData.prop).toBe("setValueExpression");
    expect(findings[0].message).toContain("The expression");
  });
  test("number vs string inside iif() is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "age", inputType: "number" },
        { type: "text", name: "q7", defaultValueExpression: "iif({age} > 'ten', 1, 2)" },
      ],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("number-vs-string");
  });
  test("checkbox = scalar inside iif() is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a", "b"] },
        { type: "text", name: "q7", setValueExpression: "iif({tags} = 'a', 1, 2)" },
      ],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("array-vs-scalar");
  });
  test("summing plain text questions in an expression is not text-ordering noise", () => {
    expect(byRule({
      calculatedValues: [{ name: "total", expression: "{q1} + {q2}" }],
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
    }, "expression/type-mismatch")).toHaveLength(0);
  });
  test("ordering a plain text question inside iif() is still flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q7", setValueExpression: "iif({q1} > 3, 1, 2)" },
      ],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("text-ordering");
  });
  test("arithmetic on a valueless question in an expression is flagged", () => {
    const findings = byRule({
      calculatedValues: [{ name: "cv", expression: "{banner} + 1" }],
      elements: [{ type: "html", name: "banner" }],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("no-value");
  });
  test("arithmetic on plain text in a condition still reads as a condition", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} + 1 > 2" },
      ],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("The condition");
  });
});

describe("iif() conditions - expression/contradiction", () => {
  test("an unsatisfiable iif() condition in defaultValueExpression is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "dropdown", name: "color", choices: ["red", "green"] },
        { type: "text", name: "q8",
          defaultValueExpression: "iif({color} notempty and {color} empty, 1, 2)" },
      ],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("unsatisfiable");
    expect(findings[0].path).toContain(".iif[0]");
  });
  test("an out-of-range iif() condition in setValueExpression is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "rating", name: "score" },
        { type: "text", name: "q7", setValueExpression: "iif({score} > 10, 1, 2)" },
      ],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("outOfRange");
  });
  test("an unsatisfiable iif() condition inside a visibleIf is flagged once", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2",
          visibleIf: "iif({q1} notempty and {q1} empty, 1, 0) = 1" },
      ],
    }, "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toContain(".iif[0]");
  });
  test("a satisfiable iif() condition is clean", () => {
    expect(byRule({
      elements: [
        { type: "rating", name: "score" },
        { type: "text", name: "q7", setValueExpression: "iif({score} > 3, 1, 2)" },
      ],
    }, "expression/contradiction")).toHaveLength(0);
  });
});

describe("iif() conditions - expression/meaningless-condition", () => {
  test("a constant true iif() condition is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q7", setValueExpression: "iif(1 = 1, 'a', 'b')" },
      ],
    }, "expression/meaningless-condition");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("alwaysTrue");
    expect(findings[0].path).toContain(".iif[0]");
  });
  test("an arithmetic iif() condition is flagged as not a boolean", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "age", inputType: "number" },
        { type: "text", name: "q7", setValueExpression: "iif({age} + 1, 'a', 'b')" },
      ],
    }, "expression/meaningless-condition");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("notABoolean");
  });
  test("a constant boolean expression root without iif() stays legitimate", () => {
    expect(byRule({
      calculatedValues: [{ name: "flag", expression: "1 = 1" }],
      elements: [{ type: "text", name: "q1" }],
    }, "expression/meaningless-condition")).toHaveLength(0);
  });
  test("plain constant arithmetic in an expression stays legitimate", () => {
    expect(byRule({
      calculatedValues: [{ name: "sum", expression: "1 + 2" }],
      elements: [{ type: "text", name: "q1" }],
    }, "expression/meaningless-condition")).toHaveLength(0);
  });
});
