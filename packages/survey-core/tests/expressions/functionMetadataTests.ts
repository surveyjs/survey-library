import { FunctionFactory, registerFunction, unregisterFunction } from "../../src/functionsfactory";

import { describe, test, expect } from "vitest";

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
