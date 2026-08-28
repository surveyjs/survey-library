import { describe, test, expect } from "vitest";
import { ConditionsParser, FunctionFactory } from "survey-core";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { withFunction } from "./lint-test-helpers";

function findingsOf(json: any, ruleId?: string): Array<ILintFinding> {
  const all = lintSurvey(json).findings;
  return ruleId ? all.filter(f => f.ruleId === ruleId) : all;
}

// One question guarded by the condition under test, plus a question the condition can refer to.
function guardedBy(condition: string): any {
  return {
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", visibleIf: condition },
    ],
  };
}

function verdictOf(condition: string): { ruleId: string, reason: string } | undefined {
  const findings = findingsOf(guardedBy(condition))
    .filter(f => f.ruleId === "expression/contradiction" ||
      f.ruleId === "expression/meaningless-condition");
  if (findings.length === 0) return undefined;
  expect(findings).toHaveLength(1);
  return { ruleId: findings[0].ruleId, reason: findings[0].reason };
}

describe("the six forms the core reports as a semantic error", () => {
  test("a condition built only from constants", () => {
    expect(verdictOf("1 = 2")).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalse" });
    expect(verdictOf("1 = 1 and 2 = 3")).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalse" });
    expect(verdictOf("1 = 1")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "alwaysTrue" });
  });
  test("arithmetic at the root of a condition", () => {
    expect(verdictOf("{q1} + 1")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "notABoolean" });
  });
  test("a constant branch of and/or", () => {
    expect(verdictOf("{q1} = 1 or 2 = 2")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "meaninglessFragment" });
  });
  test("a comparison of two constants inside a bigger condition", () => {
    expect(verdictOf("{q1} = 1 and 2 = 3")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "meaninglessFragment" });
  });
  test("an operand compared with itself", () => {
    expect(verdictOf("{q1} = {q1}")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "meaninglessFragment" });
  });
  test("a unary operator over a constant", () => {
    // the whole condition is constant, so knowing its value beats knowing its shape
    expect(verdictOf("'abc' notempty")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "alwaysTrue" });
  });
});

describe("classification of a fully constant condition", () => {
  test("the value decides, not the shape", () => {
    // constant arithmetic is reported by its value, not as notABoolean: the core agrees, it adds
    // the arithmetic error only when the operand is not constant
    expect(verdictOf("1 + 1")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "alwaysTrue" });
    expect(verdictOf("2 > 3")).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalse" });
    expect(verdictOf("'a' = 'b'")).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalse" });
    expect(verdictOf("''")).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalse" });
  });
});

describe("what stays clean", () => {
  test("a lone boolean constant is a switch the author meant", () => {
    expect(verdictOf("true")).toBeUndefined();
    expect(verdictOf("false")).toBeUndefined();
  });
  test("a condition that depends on the data", () => {
    expect(verdictOf("{q1} = 1")).toBeUndefined();
    expect(verdictOf("{q1} = {q2}")).toBeUndefined();
  });
  test("a boolean question used as the whole condition", () => {
    expect(verdictOf("{q1}")).toBeUndefined();
  });
  test("a value-producing expression may legitimately be constant", () => {
    const findings = findingsOf({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "cv", expression: "1 + 2" }],
    });
    expect(findings.filter(f => f.ruleId === "expression/contradiction" ||
      f.ruleId === "expression/meaningless-condition")).toHaveLength(0);
  });
  test("a syntactically broken condition is left to expression/syntax", () => {
    const findings = findingsOf(guardedBy("{q1} ==="));
    expect(findings.filter(f => f.ruleId === "expression/meaningless-condition")).toHaveLength(0);
    expect(findings.filter(f => f.ruleId === "expression/syntax")).toHaveLength(1);
  });
});

describe("no function is executed while linting", () => {
  test("a call is never constant, so it is neither reported nor run", () => {
    let calls = 0;
    withFunction("probeFn", () => { calls++; return 1; }, () => {
      expect(verdictOf("probeFn(1) = 2")).toBeUndefined();
      expect(verdictOf("probeFn(1) = probeFn(1)")).toBeUndefined();
    });
    expect(calls).toBe(0);
  });
});

describe("parity with the semantic check of the core", () => {
  const expressions = [
    "1 = 2", "1 = 1", "1 = 1 and 2 = 3", "'a' = 'b'", "2 > 3", "1 + 1", "''",
    "'abc' notempty", "{q1} + 1", "{q1} = 1 or 2 = 2", "{q1} = 1 and 2 = 3", "{q1} = {q1}",
    "true", "false", "{q1} = 1", "{q1}", "{q1} = {q2}", "{q1} notempty",
  ];
  test("the linter reports exactly what addConditionSemanticErrors reports", () => {
    const mismatches: Array<string> = [];
    expressions.forEach(expression => {
      const ast = new ConditionsParser().parseExpression(expression);
      const coreErrors: Array<any> = [];
      if (!!ast) ast.addConditionSemanticErrors(coreErrors);
      const coreReports = coreErrors.length > 0;
      const linterReports = !!verdictOf(expression);
      if (coreReports !== linterReports) {
        mismatches.push(expression + ": core=" + coreReports + " linter=" + linterReports);
      }
    });
    expect(mismatches).toEqual([]);
  });
});

describe("how these rules sit next to the ones that read a variable against a constant", () => {
  test("a condition with no variable-to-constant pair is reported by the new rules alone", () => {
    ["1 = 2", "{q1} = {q1}"].forEach(condition => {
      const findings = findingsOf(guardedBy(condition));
      expect(findings.filter(f => f.ruleId === "expression/type-mismatch")).toHaveLength(0);
      expect(findings.filter(f => f.ruleId === "expression/unknown-choice")).toHaveLength(0);
    });
  });
  test("arithmetic over a text question is reported by both rules, about different things", () => {
    // notABoolean is about the condition not producing a boolean at all; type-mismatch is about
    // the text question being used in arithmetic. Both hold, and each rule can be switched off
    // on its own, so neither suppresses the other.
    const findings = findingsOf(guardedBy("{q1} + 1"));
    expect(findings.filter(f => f.ruleId === "expression/meaningless-condition")
      .map(f => f.reason)).toEqual(["notABoolean"]);
    expect(findings.filter(f => f.ruleId === "expression/type-mismatch")
      .map(f => f.messageData.reason)).toEqual(["text-ordering"]);
  });
  test("the overlap comes from the question type, not from the condition", () => {
    const findings = findingsOf({
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2", visibleIf: "{q1} + 1" },
      ],
    });
    expect(findings.filter(f => f.ruleId === "expression/meaningless-condition")
      .map(f => f.reason)).toEqual(["notABoolean"]);
    expect(findings.filter(f => f.ruleId === "expression/type-mismatch")).toHaveLength(0);
  });
});

describe("the conditions of every element kind are judged", () => {
  test("enableIf, requiredIf and a trigger expression are conditions too", () => {
    const findings = findingsOf({
      elements: [
        { type: "text", name: "q1", enableIf: "1 = 2" },
        { type: "text", name: "q2", requiredIf: "1 = 1" },
      ],
      triggers: [{ type: "complete", expression: "2 > 3" }],
    });
    const byRule = (id: string) => findings.filter(f => f.ruleId === id).map(f => f.reason);
    expect(byRule("expression/contradiction").sort()).toEqual(["alwaysFalse", "alwaysFalse"]);
    expect(byRule("expression/meaningless-condition")).toEqual(["alwaysTrue"]);
  });
});

describe("the finding carries what a host needs to compose its own message", () => {
  test("expression, prop and the computed value", () => {
    const findings = findingsOf(guardedBy("1 = 2"), "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.expression).toBe("1 = 2");
    expect(findings[0].messageData.prop).toBe("visibleIf");
    expect(findings[0].messageData.value).toBe(false);
    expect(findings[0].elementName).toBe("q2");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("elements[1].visibleIf");
  });
  test("alwaysTrue reports the value too, the other reasons do not", () => {
    const alwaysTrue = findingsOf(guardedBy("1 = 1"), "expression/meaningless-condition");
    expect(alwaysTrue[0].messageData.value).toBe(true);
    const fragment = findingsOf(guardedBy("{q1} = {q1}"), "expression/meaningless-condition");
    expect(fragment[0].messageData.value).toBeUndefined();
  });
});
