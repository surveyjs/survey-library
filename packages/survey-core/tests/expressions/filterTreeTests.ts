import { describe, test, expect, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { toFilterTree, FilterTreeNode } from "../../src/expressions/filter-tree";
import { FunctionFactory } from "../../src/functionsfactory";
import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { filterTreeOperators } from "../typings/filter-tree-export";

// 2026-11-23 10:00 in the machine's own time zone
const now = new Date(2026, 10, 23, 10, 0, 0);
const registered: Array<string> = [];
function registerFunction(info: any): void {
  FunctionFactory.Instance.register(info);
  registered.push(info.name);
}
const storeUtcDates = settings.storeUtcDates;
afterEach(() => {
  vi.useRealTimers();
  settings.storeUtcDates = storeUtcDates;
  registered.splice(0).forEach(name => FunctionFactory.Instance.unregister(name));
});
function expectError(expression: string, message: string): void {
  expect(() => toFilterTree(expression), expression).toThrow(new Error("Cannot convert the filter: " + message));
}
const pad = (num: number) => ("0" + num).slice(-2);

describe("toFilterTree: what the Filter Control emits", () => {
  test("contains keeps quotes and apostrophes as the value", () => {
    expect(toFilterTree("{name} contains 'it\\'s \\\"q\\\"'")).toEqual({ field: "name", op: "contains", value: "it's \"q\"" });
  });
  test("anyof and allof carry the list", () => {
    expect(toFilterTree("{cat} anyof ['b', 'c']")).toEqual({ field: "cat", op: "anyof", value: ["b", "c"] });
    expect(toFilterTree("{tags} allof ['x', 'y']")).toEqual({ field: "tags", op: "allof", value: ["x", "y"] });
  });
  test("comparisons with numbers keep the numbers", () => {
    expect(toFilterTree("{price} > 10")).toEqual({ field: "price", op: "greater", value: 10 });
    expect(toFilterTree("{price} <= 5.5")).toEqual({ field: "price", op: "lessorequal", value: 5.5 });
  });
  test("a date typed as a quoted text stays the text", () => {
    expect(toFilterTree("{at} >= '2026-11-16'")).toEqual({ field: "at", op: "greaterorequal", value: "2026-11-16" });
  });
  test("a boolean stays a boolean", () => {
    expect(toFilterTree("{ok} = false")).toEqual({ field: "ok", op: "equal", value: false });
  });
  test("empty and notempty have no value key", () => {
    const empty = toFilterTree("{name} empty");
    expect(empty).toEqual({ field: "name", op: "empty" });
    expect(Object.keys(<any>empty)).toEqual(["field", "op"]);
    expect(toFilterTree("{name} notempty")).toEqual({ field: "name", op: "notempty" });
  });
  const presetAndSearch: FilterTreeNode = { and: [
    { field: "cat", op: "anyof", value: ["b"] },
    { field: "price", op: "less", value: 20 },
    { or: [{ field: "name", op: "contains", value: "bev" }, { field: "cat", op: "anyof", value: ["b"] }] }
  ] };
  test("a preset with a search flattens into one and", () => {
    expect(toFilterTree("({cat} anyof ['b'] and {price} < 20) and ({name} contains 'bev' or {cat} anyof ['b'])")).toEqual(presetAndSearch);
  });
  test("a search that cannot match is the const false", () => {
    expect(toFilterTree("false")).toEqual({ const: false });
  });
  test("the expression a real Filter Control composes for a preset and a search", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [
        { name: "name", cellType: "text" },
        { name: "cat", cellType: "dropdown", choices: [{ value: "b", text: "Beverages" }, "c"] },
        { name: "tags", cellType: "checkbox", choices: ["x", "y"] },
        { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f1", source: "m", showSearch: true, searchFields: ["name", "cat", "tags"],
        items: [{ name: "p", expression: "{cat} anyof ['b'] and {price} < 20" }] }] });
    const filter = <QuestionFilterModel>survey.getQuestionByName("f1");
    const expression = filter.composeFilterExpression({ activeItemName: "p", searchString: "bev" });
    expect(expression).toBe("({cat} anyof ['b'] and {price} < 20) and ({name} contains 'bev' or {cat} anyof ['b'])");
    expect(toFilterTree(expression)).toEqual(presetAndSearch);
  });
});

describe("toFilterTree: refusals", () => {
  test("no text is no filter", () => {
    expect(toFilterTree("")).toBeNull();
    expect(toFilterTree("  ")).toBeNull();
  });
  test("a text that does not parse", () => {
    expectError("{a} =", "the text does not parse: {a} =");
  });
  test("arithmetic over a field", () => {
    expectError("{a} + {b} > 10", "arithmetic: (({a} + {b}) > 10)");
    expectError("{a} * 2 = 4", "arithmetic: (({a} * 2) == 4)");
  });
  test("arithmetic on the value side, even of constants", () => {
    expectError("{price} > 10 * 2", "arithmetic: ({price} > (10 * 2))");
  });
  test("a field compared with a field", () => {
    expectError("{a} = {b}", "a field compared with a field: ({a} == {b})");
    expectError("{f} anyof [{g}]", "a field compared with a field: ({f} anyof [{g}])");
  });
  test("a function of a field", () => {
    expectError("age({b}) > 18", "a function of a field: (age({b}) > 18)");
    expectError("iif({a} > 1, true, false)", "a function of a field: iif(({a} > 1), true, false)");
    expectError("{f} = age({b})", "a function of a field: ({f} == age({b}))");
  });
  test("an async function", () => {
    registerFunction({ name: "asyncFunc", func: function (this: any) { this.returnResult(1); }, isAsync: true });
    expectError("{f} = asyncFunc()", "an async function: ({f} == asyncFunc())");
    expectError("{f} = displayValue('q')", "an async function: ({f} == displayValue('q'))");
  });
  test("a function that reads the survey does not fold", () => {
    // hasValue('q') answers false without a survey: folding it would filter by a wrong constant
    expectError("{f} = hasValue('q')", "hasValue() reads the survey: ({f} == hasValue('q'))");
    expectError("{f} = iif(hasValue('q'), 1, 2)", "hasValue() reads the survey: ({f} == iif(hasValue('q'), 1, 2))");
    expectError("hasValue('q')", "hasValue() reads the survey: hasValue('q')");
  });
  test("a custom function registered without resultDependsOn reads the survey", () => {
    registerFunction({ name: "customRead", func: () => 1 });
    expectError("{f} = customRead()", "customRead() reads the survey: ({f} == customRead())");
  });
  test("a parameters function that answers undefined has no value", () => {
    registerFunction({ name: "noValue", func: () => undefined, resultDependsOn: "parameters" });
    expectError("{f} = noValue(1)", "noValue() has no value: ({f} == noValue(1))");
  });
  test("a folded value that is not a scalar has no value", () => {
    registerFunction({ name: "listValue", func: () => ["a"], resultDependsOn: "parameters" });
    registerFunction({ name: "throwing", func: () => { throw new Error("x"); }, resultDependsOn: "parameters" });
    expectError("{f} anyof listValue()", "listValue() has no value: ({f} anyof listValue())");
    expectError("{f} = throwing()", "throwing() has no value: ({f} == throwing())");
    expectError("{f} = getDate('abc')", "getDate() has no value: ({f} == getDate('abc'))");
  });
  test("only comparisons flip a constant on the left", () => {
    expectError("'a' contains {f}", "not a field condition: ('a' contains {f})");
  });
  test("a shape that is not a field condition", () => {
    expectError("{f}", "not a field condition: {f}");
    expectError("'abc'", "not a field condition: 'abc'");
    expectError("null", "not a field condition: null");
    expectError("{f} contains", "not a field condition: ({f} contains )");
    expectError("{f} = ['a']", "not a field condition: ({f} == ['a'])");
    expectError("{f} anyof ['a', null]", "not a field condition: ({f} anyof ['a', null])");
    expectError("{f} = !true", "not a field condition: ({f} == ! true)");
    expectError("!{f}", "not a field condition: {f}");
    expectError("{f} = 1 and 'abc'", "not a field condition: 'abc'");
  });
});

describe("toFilterTree: folds", () => {
  test("a parameters function and a clock function fold to their value", () => {
    vi.setSystemTime(now);
    expect(toFilterTree("{n} = round(2.567, 1)")).toEqual({ field: "n", op: "equal", value: 2.6 });
    expect(toFilterTree("{y} = currentYear()")).toEqual({ field: "y", op: "equal", value: 2026 });
  });
  test("a constant on the left of a comparison flips", () => {
    expect(toFilterTree("10 < {price}")).toEqual({ field: "price", op: "greater", value: 10 });
    expect(toFilterTree("10 >= {price}")).toEqual({ field: "price", op: "lessorequal", value: 10 });
    expect(toFilterTree("null = {f}")).toEqual({ field: "f", op: "empty" });
  });
  test("= null and = '' are empty, <> null and <> '' are notempty", () => {
    expect(toFilterTree("{f} = null")).toEqual({ field: "f", op: "empty" });
    expect(toFilterTree("{f} = ''")).toEqual({ field: "f", op: "empty" });
    expect(toFilterTree("{f} <> null")).toEqual({ field: "f", op: "notempty" });
    expect(toFilterTree("{f} <> ''")).toEqual({ field: "f", op: "notempty" });
  });
  test("contains '' is false for every value", () => {
    expect(toFilterTree("{f} contains ''")).toEqual({ const: false });
  });
  test("an empty list answers the same for every value", () => {
    expect(toFilterTree("{f} anyof []")).toEqual({ const: true });
    expect(toFilterTree("{f} noneof []")).toEqual({ const: false });
    expect(toFilterTree("{f} allof []")).toEqual({ const: true });
  });
  test("notcontains '' depends on the field and stays", () => {
    expect(toFilterTree("{f} notcontains ''")).toEqual({ field: "f", op: "notcontains", value: "" });
  });
  test("a list operator with one value takes it as a list of one", () => {
    expect(toFilterTree("{f} anyof 'a'")).toEqual({ field: "f", op: "anyof", value: ["a"] });
  });
  test("a constant part drops out of and, decides or", () => {
    expect(toFilterTree("{f} = 1 and 1 = 1")).toEqual({ field: "f", op: "equal", value: 1 });
    expect(toFilterTree("{f} = 1 or 1 = 1")).toEqual({ const: true });
    expect(toFilterTree("{f} = 1 and false")).toEqual({ const: false });
    expect(toFilterTree("{f} = 1 or false")).toEqual({ field: "f", op: "equal", value: 1 });
    expect(toFilterTree("currentYear() > 2000 and {f} = 1")).toEqual({ field: "f", op: "equal", value: 1 });
  });
  test("not collapses", () => {
    expect(toFilterTree("!({f} = 1)")).toEqual({ not: { field: "f", op: "equal", value: 1 } });
    expect(toFilterTree("!!({f} = 1)")).toEqual({ field: "f", op: "equal", value: 1 });
    expect(toFilterTree("!false")).toEqual({ const: true });
    expect(toFilterTree("!({f} = 1 and {g} = 2)")).toEqual({ not: { and: [
      { field: "f", op: "equal", value: 1 }, { field: "g", op: "equal", value: 2 }] } });
  });
  test("nested and/or flatten", () => {
    expect(toFilterTree("{a} = 1 and ({b} = 2 and {c} = 3)")).toEqual({ and: [
      { field: "a", op: "equal", value: 1 }, { field: "b", op: "equal", value: 2 }, { field: "c", op: "equal", value: 3 }] });
    expect(toFilterTree("{a} = 1 or ({b} = 2 and {c} = 3)")).toEqual({ or: [
      { field: "a", op: "equal", value: 1 },
      { and: [{ field: "b", op: "equal", value: 2 }, { field: "c", op: "equal", value: 3 }] }] });
  });
  test("field names are kept as written, without the conversion flag", () => {
    expect(toFilterTree("{row.x} = 1")).toEqual({ field: "row.x", op: "equal", value: 1 });
    expect(toFilterTree("{address.city} = 'x'")).toEqual({ field: "address.city", op: "equal", value: "x" });
    expect(toFilterTree("{#f} = 1")).toEqual({ field: "f", op: "equal", value: 1 });
  });
  test("values keep the type the expression typed", () => {
    expect(toFilterTree("{f} = '10'")).toEqual({ field: "f", op: "equal", value: "10" });
    expect(toFilterTree("{f} = 10")).toEqual({ field: "f", op: "equal", value: 10 });
    expect(toFilterTree("{f} = 'true'")).toEqual({ field: "f", op: "equal", value: "true" });
    expect(toFilterTree("{f} = '0123'")).toEqual({ field: "f", op: "equal", value: "0123" });
  });
});

describe("toFilterTree: dates", () => {
  test("today() is the local calendar date", () => {
    vi.setSystemTime(now);
    expect(toFilterTree("{at} >= today(-7)")).toEqual({ field: "at", op: "greaterorequal", value: "2026-11-16" });
  });
  test("under storeUtcDates today() is the UTC calendar date", () => {
    vi.setSystemTime(now);
    settings.storeUtcDates = true;
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7));
    const expected = day.getUTCFullYear() + "-" + pad(day.getUTCMonth() + 1) + "-" + pad(day.getUTCDate());
    expect(toFilterTree("{at} >= today(-7)")).toEqual({ field: "at", op: "greaterorequal", value: expected });
  });
  test("dateAdd over today() folds", () => {
    vi.setSystemTime(now);
    expect(toFilterTree("{at} > dateAdd(today(), -1, 'months')")).toEqual({ field: "at", op: "greater", value: "2026-10-23" });
  });
  test("a moment is ISO 8601 with the local offset", () => {
    vi.setSystemTime(now);
    const offset = -now.getTimezoneOffset();
    const expected = "2026-11-23T10:00:00.000" + (offset < 0 ? "-" : "+") +
      pad(Math.floor(Math.abs(offset) / 60)) + ":" + pad(Math.abs(offset) % 60);
    expect(toFilterTree("{at} < currentDate()")).toEqual({ field: "at", op: "less", value: expected });
    expect(new Date(<string>(<any>toFilterTree("{at} < currentDate()")).value).getTime()).toBe(now.getTime());
  });
});

// A reader of the keywords filter-tree.schema.json uses, so the shipped file itself is tested without a validator
// dependency. An unknown keyword throws: a schema change must extend the reader.
const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../src/expressions/filter-tree.schema.json"), "utf8"));
const annotations = ["$schema", "title", "description", "$defs"];
function isValid(value: any, node: any = schema): boolean {
  if (node === true) return true;
  return Object.keys(node).every(key => {
    const arg = node[key];
    switch(key) {
      case "$ref": return isValid(value, arg.split("/").slice(1).reduce((res: any, name: string) => res[name], schema));
      case "oneOf": return arg.filter((sub: any) => isValid(value, sub)).length === 1;
      case "allOf": return arg.every((sub: any) => isValid(value, sub));
      case "not": return !isValid(value, arg);
      case "if": return !isValid(value, arg) || !node.then || isValid(value, node.then);
      case "then": return true;
      case "type": return [].concat(arg).some((type: string) => type === "array" ? Array.isArray(value) :
        type === "object" ? typeof value === "object" && value !== null && !Array.isArray(value) : typeof value === type);
      case "enum": return arg.indexOf(value) > -1;
      case "required": return !isObject(value) || arg.every((name: string) => Object.prototype.hasOwnProperty.call(value, name));
      case "properties": return !isObject(value) || Object.keys(arg).every(name => !(name in value) || isValid(value[name], arg[name]));
      case "additionalProperties": return !isObject(value) || arg !== false || Object.keys(value).every(name => name in (node.properties || {}));
      case "items": return !Array.isArray(value) || value.every(item => isValid(item, arg));
      case "minItems": return !Array.isArray(value) || value.length >= arg;
      case "minLength": return typeof value !== "string" || value.length >= arg;
    }
    if (annotations.indexOf(key) > -1) return true;
    throw new Error("The test reader does not know the schema keyword " + key);
  });
}
function isObject(value: any): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

describe("filter-tree.schema.json", () => {
  const operators = Object.keys(filterTreeOperators);
  test("its operator enum is FilterTreeOperator", () => {
    expect(schema.$defs.condition.properties.op.enum.slice().sort()).toEqual(operators.slice().sort());
  });
  test("toFilterTree emits every operator of the list and only those", () => {
    const expressions = ["{f} = 1", "{f} <> 1", "{f} > 1", "{f} < 1", "{f} >= 1", "{f} <= 1", "{f} contains 'a'",
      "{f} notcontains 'a'", "{f} anyof ['a']", "{f} noneof ['a']", "{f} allof ['a']", "{f} empty", "{f} notempty"];
    const emitted = expressions.map(text => (<any>toFilterTree(text)).op);
    expect(emitted.slice().sort()).toEqual(operators.slice().sort());
    expressions.forEach(text => expect(isValid(toFilterTree(text)), text).toBe(true));
  });
  test("accepts the trees toFilterTree builds", () => {
    vi.setSystemTime(now);
    ["{name} contains 'it\\'s'", "{cat} anyof ['b', 'c']", "{price} <= 5.5", "{ok} = false", "{name} empty", "false",
      "({cat} anyof ['b'] and {price} < 20) and ({name} contains 'bev' or {cat} anyof ['b'])",
      "!({f} = 1)", "!({f} = 1 or {g} = 2)", "{f} anyof []", "{f} notcontains ''", "{at} >= today(-7)", "{at} < currentDate()"
    ].forEach(text => expect(isValid(toFilterTree(text)), text).toBe(true));
  });
  test("rejects what a reader must not receive", () => {
    const rejected: Array<any> = [
      { and: [{ field: "f", op: "empty" }] },
      { field: "f", op: "eq", value: 1 },
      { field: "f", op: "anyof" },
      { field: "f", op: "anyof", value: [] },
      { field: "f", op: "anyof", value: [["a"]] },
      { field: "f", op: "equal" },
      { field: "f", op: "equal", value: null },
      { field: "f", op: "equal", value: ["a"] },
      { field: "f", op: "empty", value: "" },
      { field: "f", op: "equal", value: 1, extra: true },
      { const: "true" },
      { not: { field: "f", op: "empty" }, and: [] },
      { field: "", op: "empty" }
    ];
    rejected.forEach(tree => expect(isValid(tree), JSON.stringify(tree)).toBe(false));
  });
});
