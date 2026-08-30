import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { withFunction } from "./lint-test-helpers";

function findingsOf(json: any, ruleId?: string): Array<ILintFinding> {
  const all = lintSurvey(json).findings;
  return ruleId ? all.filter(f => f.ruleId === ruleId) : all;
}

// A calculated value with the given expression, plus a question guarded by the condition
// under test and a plain question the condition can refer to.
function withCalculated(calculatedValues: Array<any>, condition: string): any {
  return {
    calculatedValues: calculatedValues,
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", visibleIf: condition },
    ],
  };
}

function verdictOf(json: any): { ruleId: string, reason: string } | undefined {
  const findings = findingsOf(json).filter(f => f.ruleId === "expression/contradiction" ||
    f.ruleId === "expression/meaningless-condition");
  if (findings.length === 0) return undefined;
  expect(findings).toHaveLength(1);
  return { ruleId: findings[0].ruleId, reason: findings[0].reason };
}

function verdictFor(expression: string, condition: string): { ruleId: string, reason: string } | undefined {
  return verdictOf(withCalculated([{ name: "c1", expression: expression }], condition));
}

describe("a condition decided by a constant calculated value", () => {
  test("the condition can never hold", () => {
    expect(verdictFor("1 + 1", "{c1} = 5")).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalseViaConstants" });
  });
  test("the condition always holds", () => {
    expect(verdictFor("1 + 1", "{c1} = 2")).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "alwaysTrueViaConstants" });
  });
  test("a constant on both sides", () => {
    expect(verdictOf(withCalculated(
      [{ name: "c1", expression: "1" }, { name: "c2", expression: "2" }], "{c1} = {c2}"))).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalseViaConstants" });
  });
  test("the name is matched the way the runtime matches it - case-insensitively", () => {
    expect(verdictFor("1 + 1", "{C1} = 5")).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalseViaConstants" });
  });
  test("every condition property is judged, not just visibleIf", () => {
    const findings = findingsOf({
      calculatedValues: [{ name: "c1", expression: "1" }],
      elements: [{ type: "text", name: "q1", enableIf: "{c1} = 5" }],
      triggers: [{ type: "complete", expression: "{c1} = 5" }],
    }, "expression/contradiction");
    expect(findings.map(f => f.reason)).toEqual(["alwaysFalseViaConstants", "alwaysFalseViaConstants"]);
  });
});

describe("a chain of constant sources", () => {
  const chain = [
    { name: "c1", expression: "1 + 1" },
    { name: "c2", expression: "{c1} * 2" },
    { name: "c3", expression: "{c2} + 1" },
  ];
  test("a source built from another constant source is constant too", () => {
    expect(verdictOf(withCalculated(chain, "{c3} = 9"))).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalseViaConstants" });
    expect(verdictOf(withCalculated(chain, "{c3} = 5"))).toEqual(
      { ruleId: "expression/meaningless-condition", reason: "alwaysTrueViaConstants" });
  });
  test("the declaration order does not matter", () => {
    expect(verdictOf(withCalculated(chain.slice().reverse(), "{c3} = 9"))).toEqual(
      { ruleId: "expression/contradiction", reason: "alwaysFalseViaConstants" });
  });
  test("only the sources the condition names are reported", () => {
    const findings = findingsOf(withCalculated(chain, "{c3} = 9"), "expression/contradiction");
    expect(findings[0].messageData.constants).toEqual({ c3: 5 });
    expect(findings[0].related).toEqual([
      { path: "calculatedValues[2].expression", elementName: "c3" },
    ]);
  });
  test("a chain broken by an answer is not constant at any link", () => {
    expect(verdictOf(withCalculated([
      { name: "c1", expression: "{q1} + 1" },
      { name: "c2", expression: "{c1} * 2" },
    ], "{c2} = 9"))).toBeUndefined();
  });
  test("a cycle never settles, so nothing in it is constant", () => {
    const json = withCalculated([
      { name: "a", expression: "{b} + 1" },
      { name: "b", expression: "{a} + 1" },
    ], "{a} = 5");
    expect(verdictOf(json)).toBeUndefined();
    expect(findingsOf(json, "cycle/calculated-value")).toHaveLength(1);
  });
  test("a self-reference is not constant either", () => {
    expect(verdictOf(withCalculated([{ name: "a", expression: "{a} + 1" }], "{a} = 5")))
      .toBeUndefined();
  });
});

describe("what stays clean", () => {
  test("a source that depends on an answer is not a constant", () => {
    expect(verdictFor("{q1} + 1", "{c1} = 5")).toBeUndefined();
  });
  test("a source built with a function is not evaluated", () => {
    let calls = 0;
    withFunction("probeFn", () => { calls++; return 1; }, () => {
      expect(verdictFor("probeFn(1)", "{c1} = 5")).toBeUndefined();
    });
    expect(calls).toBe(0);
  });
  test("a source that a trigger can overwrite is not a constant", () => {
    expect(verdictOf({
      calculatedValues: [{ name: "c1", expression: "1" }],
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", visibleIf: "{c1} = 5" }],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "c1", setValue: 7 }],
    })).toBeUndefined();
  });
  test("a source with an empty expression holds whatever the data holds", () => {
    expect(verdictOf(withCalculated([{ name: "c1" }], "{c1} = 5"))).toBeUndefined();
  });
  test("a reference with a sub-path or an index is not folded", () => {
    expect(verdictFor("1 + 1", "{c1.x} = 5")).toBeUndefined();
    expect(verdictFor("1 + 1", "{c1[0]} = 5")).toBeUndefined();
  });
  test("a lone reference stays a switch, like a lone boolean constant", () => {
    expect(verdictFor("1 + 1", "{c1}")).toBeUndefined();
  });
  test("a shadowed name is ambiguous, so nothing is folded", () => {
    expect(verdictOf({
      calculatedValues: [{ name: "c1", expression: "1" }],
      elements: [{ type: "text", name: "c1" }, { type: "text", name: "q2", visibleIf: "{c1} = 5" }],
    })).toBeUndefined();
  });
  test("a name shadowed inside a dynamic panel template resolves to the template question", () => {
    // the runtime answers {c1} with the panel's own question here, not with the calculated value
    expect(verdictOf({
      calculatedValues: [{ name: "c1", expression: "1" }],
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [
          { type: "text", name: "c1" },
          { type: "text", name: "inner", visibleIf: "{c1} = 5" },
        ],
      }],
    })).toBeUndefined();
  });
  test("a name shadowed inside a matrix row resolves to the column", () => {
    expect(verdictOf({
      calculatedValues: [{ name: "c1", expression: "1" }],
      elements: [{
        type: "matrixdynamic", name: "m",
        columns: [{ name: "c1" }, { name: "col2", visibleIf: "{row.c1} = 5" }],
      }],
    })).toBeUndefined();
  });
});

describe("the finding carries what a host needs to compose its own message", () => {
  test("the folded values and the source of each of them", () => {
    const findings = findingsOf(withCalculated([{ name: "c1", expression: "1 + 1" }], "{c1} = 5"),
      "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.expression).toBe("{c1} = 5");
    expect(findings[0].messageData.prop).toBe("visibleIf");
    expect(findings[0].messageData.value).toBe(false);
    expect(findings[0].messageData.constants).toEqual({ c1: 2 });
    expect(findings[0].related).toEqual([
      { path: "calculatedValues[0].expression", elementName: "c1" },
    ]);
    expect(findings[0].message).toContain("{c1}");
    expect(findings[0].path).toBe("elements[1].visibleIf");
    expect(findings[0].elementName).toBe("q2");
  });
  test("alwaysTrue reports the value too", () => {
    const findings = findingsOf(withCalculated([{ name: "c1", expression: "1 + 1" }], "{c1} = 2"),
      "expression/meaningless-condition");
    expect(findings[0].messageData.value).toBe(true);
    expect(findings[0].messageData.constants).toEqual({ c1: 2 });
  });
});
