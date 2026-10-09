import { ConditionsParser } from "../../src/conditions/conditionsParser";
import {
  expressionGuideSections, expressionGuideVersion, getExpressionGuideText,
} from "../../src/expressions/expression-guide";
import { FunctionFactory, registerFunction, unregisterFunction } from "../../src/functionsfactory";

import { describe, test, expect } from "vitest";

describe("Expression syntax guide", () => {
  const examples = [];
  expressionGuideSections.forEach(section => section.examples.forEach(ex => examples.push(ex)));

  test("every example the guide shows as valid parses", () => {
    const parser = new ConditionsParser();
    const failed = examples.filter(ex => ex.isValid && !parser.parseExpression(ex.expression)).map(ex => ex.expression);
    expect(failed).toEqual([]);
  });
  test("every example the guide shows as invalid does not parse, and says why", () => {
    const parser = new ConditionsParser();
    const invalid = examples.filter(ex => !ex.isValid);
    expect(invalid.length).toBeGreaterThan(0);
    expect(invalid.filter(ex => !!parser.parseExpression(ex.expression)).map(ex => ex.expression)).toEqual([]);
    expect(invalid.filter(ex => !ex.note).map(ex => ex.expression)).toEqual([]);
  });
  test("the guide forbids what the grammar rejects and keeps what it accepts", () => {
    const parser = new ConditionsParser();
    ["not {q}", "{q} === 1", "{{q} = 1}"].forEach(x => expect(parser.parseExpression(x), x).toBeFalsy());
    ["{a} && {b}", "{a} || {b}", "!{a}", "negate {a}", "{a} <> 1", "{a} == 1"].forEach(x => expect(parser.parseExpression(x), x).toBeTruthy());
    const shown = examples.map(ex => ex.expression);
    expect(shown.some(x => x.indexOf("&&") > -1)).toBe(true);
    expect(shown.some(x => x.indexOf("||") > -1)).toBe(true);
    expect(shown.some(x => x.indexOf("<>") > -1)).toBe(true);
  });
  test("the text holds every section and every example, and names its version", () => {
    const text = getExpressionGuideText();
    expect(text.indexOf("guide version " + expressionGuideVersion)).toBeGreaterThan(-1);
    expressionGuideSections.forEach(section => {
      expect(text.indexOf("## " + section.title)).toBeGreaterThan(-1);
      section.examples.forEach(ex => expect(text.indexOf(ex.expression), ex.expression).toBeGreaterThan(-1));
    });
    expect(getExpressionGuideText()).toBe(text);
  });
  test("the functions the guide calls are registered", () => {
    const parser = new ConditionsParser();
    const names: Array<string> = [];
    examples.filter(ex => ex.isValid).forEach(ex => {
      expect(parser.parseExpression(ex.expression), ex.expression).toBeTruthy();
      (ex.expression.match(/([A-Za-z]+)\(/g) || []).forEach(m => {
        const name = m.substring(0, m.length - 1);
        if (names.indexOf(name) < 0) names.push(name);
      });
    });
    expect(names.length).toBeGreaterThan(5);
    expect(names.filter(name => !FunctionFactory.Instance.hasFunction(name))).toEqual([]);
  });
});

describe("Function metadata", () => {
  test("a registration keeps its description, parameters and return type", () => {
    registerFunction({
      name: "aiexMeta", func: () => 1, description: "Doubles a number",
      parameters: [{ name: "value", type: "number" }, { name: "times", type: "number", optional: true }],
      returnType: "number",
    });
    const reg = FunctionFactory.Instance.getRegistrations().filter(r => r.name === "aiexMeta")[0];
    expect(reg.description).toBe("Doubles a number");
    expect(reg.returnType).toBe("number");
    expect(reg.parameters).toEqual([{ name: "value", type: "number" }, { name: "times", type: "number", optional: true }]);
    // the registration hands out copies: changing them does not change the factory
    reg.parameters[0].name = "changed";
    const again = FunctionFactory.Instance.getRegistrations().filter(r => r.name === "aiexMeta")[0];
    expect(again.parameters[0].name).toBe("value");
    unregisterFunction("aiexMeta");
  });
  test("a registration without metadata has none", () => {
    FunctionFactory.Instance.register("aiexPlain", () => 1);
    const reg = FunctionFactory.Instance.getRegistrations().filter(r => r.name === "aiexPlain")[0];
    expect(reg.description).toBeUndefined();
    expect(reg.parameters).toBeUndefined();
    expect(reg.returnType).toBeUndefined();
    expect(Object.keys(reg).sort()).toEqual(["func", "isAsync", "name", "useCache"]);
    unregisterFunction("aiexPlain");
  });
  test("every built-in function is described", () => {
    const builtIns = ["sum", "min", "max", "count", "avg", "round", "trunc", "sumInArray", "minInArray", "maxInArray",
      "countInArray", "avgInArray", "iif", "getDate", "age", "dateDiff", "dateAdd", "isContainerReady", "isDisplayMode",
      "currentDate", "today", "getYear", "currentYear", "diffDays", "year", "month", "day", "weekday", "displayValue",
      "propertyValue", "substring", "getComment"];
    const regs = FunctionFactory.Instance.getRegistrations().filter(r => builtIns.indexOf(r.name) > -1);
    expect(regs.map(r => r.name).sort()).toEqual(builtIns.slice().sort());
    regs.forEach(r => {
      expect(r.description, r.name).toBeTruthy();
      expect(Array.isArray(r.parameters), r.name).toBe(true);
      expect(r.returnType, r.name).toBeTruthy();
      r.parameters.forEach(p => expect(p.name && p.type, r.name).toBeTruthy());
    });
    const iif = regs.filter(r => r.name === "iif")[0];
    expect(iif.parameters.map(p => p.name)).toEqual(["condition", "valueIfTrue", "valueIfFalse"]);
    const sum = regs.filter(r => r.name === "sum")[0];
    expect(sum.parameters[0].isRest).toBe(true);
    // the flags the short form gave keep their meaning
    const displayValue = regs.filter(r => r.name === "displayValue")[0];
    expect(displayValue.isAsync).toBe(true);
    expect(displayValue.useCache).toBe(false);
    expect(regs.filter(r => r.name === "sumInArray")[0].originalValueParams).toEqual([0]);
  });
});
