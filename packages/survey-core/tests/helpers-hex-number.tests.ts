import { Helpers } from "../src/helpers";
import { ConditionRunner } from "../src/conditions/conditionRunner";
import { ExpressionRunner } from "../src/expressions/expressionRunner";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";

describe("Helpers.getNumber: a text that only starts with 0x", () => {
  test("a whole hex literal is a number", () => {
    expect(Helpers.getNumber("0xa"), "0xa").toBe(10);
    expect(Helpers.getNumber("0x1A"), "0x1A").toBe(26);
    expect(Helpers.getNumber(" 0xa "), "' 0xa '").toBe(10);
    expect(Helpers.isNumber("0xa"), "isNumber 0xa").toBe(true);
    expect(Helpers.isNumber("0x1A"), "isNumber 0x1A").toBe(true);
    expect(Helpers.isNumber(" 0xa "), "isNumber ' 0xa '").toBe(true);
  });
  test("a text that only starts with 0x is not a number", () => {
    expect(Helpers.getNumber("0xa hello"), "0xa hello").toBeNaN();
    expect(Helpers.getNumber("0x1g"), "0x1g").toBeNaN();
    expect(Helpers.getNumber("0x"), "0x").toBeNaN();
    expect(Helpers.isNumber("0xa hello"), "isNumber 0xa hello").toBe(false);
    expect(Helpers.isNumber("0x1g"), "isNumber 0x1g").toBe(false);
    expect(Helpers.isNumber("0x"), "isNumber 0x").toBe(false);
  });
  test("a 0x text longer than 32 characters is not a number, as before", () => {
    const text = "0x" + "1".repeat(31);
    expect(text.length).toBe(33);
    expect(Helpers.getNumber(text)).toBeNaN();
    expect(Helpers.isNumber(text)).toBe(false);
    const text32 = "0x" + "1".repeat(30);
    expect(text32.length).toBe(32);
    expect(Helpers.isNumber(text32), "32 characters is still a number").toBe(true);
  });
});

describe("Conditions: a text that only starts with 0x", () => {
  const run = (expression: string, value: any): boolean => new ConditionRunner(expression).runValues({ q: value });
  test("'0xa hello' is a text, not the number 10", () => {
    expect(run("{q} = 10", "0xa hello"), "= 10").toBe(false);
    expect(run("{q} contains 'hello'", "0xa hello"), "contains 'hello'").toBe(true);
  });
  test("'0xa' is still the number 10", () => {
    expect(run("{q} = 10", "0xa"), "= 10").toBe(true);
    expect(run("{q} contains 'hello'", "0xa"), "contains 'hello'").toBe(false);
  });
  test("'0x1g' is a text, not the number 1", () => {
    expect(run("{q} = 1", "0x1g"), "= 1").toBe(false);
    expect(run("{q} = 10", "0x1g"), "= 10").toBe(false);
    expect(run("{q} contains 'hello'", "0x1g"), "contains 'hello'").toBe(false);
    expect(run("{q} contains '1g'", "0x1g"), "contains '1g'").toBe(true);
  });
});

describe("Expressions: a sum with a text that only starts with 0x", () => {
  test("{a} + {b} with a = '0x1g' and b = 1", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "a" },
        { type: "text", name: "b", inputType: "number" },
        { type: "expression", name: "sum", expression: "{a} + {b}" }
      ]
    });
    survey.setValue("a", "0x1g");
    survey.setValue("b", 1);
    // Before the fix "0x1g" was read as 1 and the sum was 2. Now it is a text, and "+" with a text
    // joins the values as texts, the same as for any other non-numeric text ("abc" + 1 = "abc1").
    expect(survey.getValue("sum")).toBe("0x1g1");
  });
  test("sum() and sumInArray() with a = '0x1g'", () => {
    // Before the fix both gave 2. sum() joins a text as for "abc" ("0abc1"); sumInArray() skips a non-numeric item.
    expect(new ExpressionRunner("sum({a}, {b})").runValues({ a: "0x1g", b: 1 })).toBe("00x1g1");
    expect(new ExpressionRunner("sumInArray({m}, 'c')").runValues({ m: [{ c: "0x1g" }, { c: 1 }] })).toBe(1);
    expect(new ExpressionRunner("sumInArray({m}, 'c')").runValues({ m: [{ c: "0xa" }, { c: 1 }] })).toBe(11);
  });
});
