import { describe, test, expect } from "vitest";
import { Trigger, buildTriggerExpression, hasTriggerOperator } from "../src/trigger";
import { OperandMaker } from "../src/expressions/expressions";

// buildTriggerExpression is what a legacy name/operator/value trigger runs as.
// Trigger.expression delegates to it, and tools that analyze survey JSON without
// building a survey (the linter) call it directly - so the two cannot diverge.
function fromTrigger(json: any): string {
  const trigger = new Trigger();
  trigger.name = json.name;
  if (json.operator !== undefined) trigger.operator = json.operator;
  trigger.value = json.value;
  return trigger.expression;
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

describe("buildTriggerExpression", () => {
  CASES.forEach((json, i) => {
    test("case " + i + ": " + JSON.stringify(json), () => {
      expect(buildTriggerExpression(json.name, json.operator, json.value)).toBe(fromTrigger(json));
    });
  });

  test("builds the expected expressions", () => {
    expect(buildTriggerExpression("q1", "equal", "yes")).toBe("{q1} equal 'yes'");
    expect(buildTriggerExpression("q1", "greater", 5)).toBe("{q1} greater 5");
    expect(buildTriggerExpression("q1", "empty", undefined)).toBe("{q1} empty undefined");
    expect(buildTriggerExpression("q1", undefined, "yes")).toBe("{q1} equal 'yes'");
    expect(buildTriggerExpression("", "equal", "yes")).toBe("");
    expect(buildTriggerExpression("q1", "equal", "  ")).toBe("");
  });

  // OperandMaker.isBooleanValue used to call toLowerCase() on whatever it got, so a
  // legacy trigger with a real boolean threw when its expression was read
  test("a boolean value does not throw and is not quoted", () => {
    expect(buildTriggerExpression("q1", "equal", true)).toBe("{q1} equal true");
    expect(buildTriggerExpression("q1", "equal", false)).toBe("{q1} equal false");
    expect(fromTrigger({ name: "q1", operator: "equal", value: true })).toBe("{q1} equal true");
    expect(OperandMaker.isBooleanValue(true)).toBe(true);
    expect(OperandMaker.isBooleanValue(5)).toBe(false);
    expect(OperandMaker.toOperandString(true)).toBe(true);
    expect(OperandMaker.toOperandString(5)).toBe(5);
  });

  test("an operator name from Object.prototype is not an operator", () => {
    expect(hasTriggerOperator("constructor")).toBe(false);
    expect(hasTriggerOperator("__proto__")).toBe(false);
    expect(hasTriggerOperator("equal")).toBe(true);
    expect(buildTriggerExpression("q1", "constructor", "yes")).toBe("{q1} equal 'yes'");
    const trigger = new Trigger();
    trigger.name = "q1";
    trigger.operator = "constructor";
    expect(trigger.operator).toBe("equal");
    expect(() => trigger.check("yes")).not.toThrow();
  });
});
