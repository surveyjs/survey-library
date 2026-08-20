import { describe, test, expect } from "vitest";
import { Trigger } from "../../src/trigger";
import { lintSurvey } from "../../src/linter/index";

// walker.ts synthesizes the expression of a legacy name/operator/value trigger the
// same way Trigger.buildExpression does. That mirror cannot import OperandMaker
// (not part of the public API) nor construct a Trigger (issue #11693 forbids
// building a model), so this test pins the two implementations against each other.
function runtimeExpression(json: any): string {
  const trigger = new Trigger();
  trigger.name = json.name;
  if (json.operator !== undefined) trigger.operator = json.operator;
  trigger.value = json.value;
  return trigger.expression;
}

// the synthesized expression is reachable through the finding path: a legacy
// trigger whose expression is built gets its site registered at "triggers[i]"
function linterExpression(json: any): string {
  const res = lintSurvey({
    elements: [{ type: "text", name: "q1" }],
    triggers: [Object.assign({ type: "setvalue", setToName: "q1" }, json)],
  }, { rules: { "trigger/unknown-target": "off" } });
  const finding = res.findings.filter(f => f.path === "triggers[0]" &&
    f.messageData && typeof f.messageData.expression === "string")[0];
  return finding ? finding.messageData.expression : "";
}

const CASES: Array<any> = [
  { name: "q2", operator: "equal", value: "yes" },
  { name: "q2", operator: "notequal", value: "yes" },
  { name: "q2", operator: "greater", value: 5 },
  { name: "q2", operator: "equal", value: 0 },
  { name: "q2", operator: "empty" },
  { name: "q2", operator: "notempty" },
  { name: "q2", value: "yes" },
  // an operator Trigger does not know silently becomes "equal"
  { name: "q2", operator: "anyof", value: "yes" },
  { name: "q2", operator: "EQUAL", value: "yes" },
  // whitespace-only value counts as empty, because Base.isValueEmpty trims
  { name: "q2", operator: "equal", value: "   " },
  { name: "q2", operator: "equal", value: "" },
  { name: "", operator: "equal", value: "yes" },
  { name: "q2", operator: "equal", value: "it's" },
  { name: "q2", operator: "equal", value: "true" },
];

describe("legacy trigger expression parity with Trigger.buildExpression", () => {
  CASES.forEach((json, i) => {
    test("case " + i + ": " + JSON.stringify(json), () => {
      expect(linterExpression(json)).toBe(runtimeExpression(json));
    });
  });

  test("a boolean value does not throw, unlike OperandMaker.toOperandString", () => {
    expect(() => runtimeExpression({ name: "q2", operator: "equal", value: true })).toThrow();
    expect(linterExpression({ name: "q2", operator: "equal", value: true })).toBe("{q2} equal true");
  });
});
