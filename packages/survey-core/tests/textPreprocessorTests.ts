import {
  TextPreProcessor,
  TextPreProcessorValue,
} from "../src/textPreProcessor";
import { ValueGetter, VariableGetterContext } from "../src/conditions/conditionProcessValue";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("TextPreprocessorTests", () => {
  test("Replace simple names", () => {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = true;
      textValue.value = "aaa" + textValue.name;
    };
    var result = processor.process("test1 {111} test2");
    expect(result, "in the middle").toBe("test1 aaa111 test2");
    result = processor.process("{111} test2");
    expect(result, "at the start").toBe("aaa111 test2");
    result = processor.process("test1{111}");
    expect(result, "at the end").toBe("test1aaa111");
    result = processor.process("test1{aaa bbb}");
    expect(result, "several words").toBe("test1aaaaaa bbb");
    result = processor.process("test1{aaa-bbb}");
    expect(result, "complex name").toBe("test1aaaaaa-bbb");
    result = processor.process("test1{   bbb   }");
    expect(result, "removespaces").toBe("test1aaabbb");
    result = processor.process("test1{ }");
    expect(result, "do not process empty").toBe("test1{ }");
  });

  test("onHasValue event", () => {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = textValue.name == "myname";
      if (textValue.isExists) {
        textValue.value = "Andrew";
      }
    };
    var result = processor.process("test1 {name} test2");
    expect(result, "do not process - name is unknown").toBe("test1 {name} test2");
    var result = processor.process("test1 {myname} test2");
    expect(result, "process successfull").toBe("test1 Andrew test2");
  });

  test("ValueGetter getValue/hasValue, nested values", () => {
    var getter = new ValueGetter();
    var context = new VariableGetterContext({ a: 1, b: { d: 2 }, c: { e: { f: 3 } }, g: 0 });
    expect(getter.getValue("a", context), "a=1").toBe(1);
    expect(getter.getValue("b.d", context), "b.d=2").toBe(2);
    expect(getter.getValue("c.e.f", context), "c.e.f=3").toBe(3);
    expect(getter.getValueInfo({ name: "aaa", context: context }).isFound).toBe(false);
    expect(getter.getValueInfo({ name: "a", context: context }).isFound).toBe(true);
    expect(getter.getValueInfo({ name: "b", context: context }).isFound).toBe(true);
    expect(getter.getValueInfo({ name: "b.d", context: context }).isFound).toBe(true);
    expect(getter.getValueInfo({ name: "c", context: context }).isFound).toBe(true);
    expect(getter.getValueInfo({ name: "c.e", context: context }).isFound).toBe(true);
    expect(getter.getValueInfo({ name: "c.e.f", context: context }).isFound).toBe(true);
    expect(getter.getValueInfo({ name: "g", context: context }).isFound).toBe(true);
    expect(getter.getValue("g", context)).toBe(0);
  });
  test("ValueGetter getValue/hasValue 2", () => {
    var getter = new ValueGetter();
    var context = new VariableGetterContext({ abc: 1, ab: 2 });
    expect(getter.getValue("AB", context), "ab=2").toBe(2);
  });

  test("ValueGetter getValue/hasValue, arrays and nested values", () => {
    var getter = new ValueGetter();
    var context = new VariableGetterContext({ a: [1, 2], b: [{ d: 2 }, { c: [3, { d: 4 }] }] });
    expect(getter.getValue("a[0]", context), "a[0]=1").toBe(1);
    expect(getter.getValue("a[1]", context), "a[1]=2").toBe(2);
    expect(getter.getValue("a[3]", context), "a[3] - out of bounds").toBe(undefined);
    expect(getter.getValue("b[0].d", context), "b[0].d=2").toBe(2);
    expect(getter.getValue("b[1].c[0]", context), "c[0]=3").toBe(3);
    expect(getter.getValue("b[1].c[1].d", context), "c[0].d=4").toBe(4);
  });

  test("ValueGetter value name has dot inside", () => {
    var getter = new ValueGetter();
    var context = new VariableGetterContext({ "a.b": 1, "a.b.c": 2, "a.bc": { d: 3 } });
    expect(getter.getValue("a.b", context), "'a.b'=1").toBe(1);
    expect(getter.getValue("a.b.c", context), "'a.b.c'=2").toBe(2);
    expect(getter.getValue("a.bc.d", context), "'a.bc'.d=3").toBe(3);
  });

  test("ValueGetter insenstive names", () => {
    var getter = new ValueGetter();
    var context = new VariableGetterContext({ Q11: { R11: { C11: 1 } }, q1: { r1: { c1: 2 } } });
    expect(getter.getValue("Q1.R1.C1", context), "q1.r1.c1 == Q1.R1.C1").toBe(2);
    expect(getter.getValue("Q11.R11.C11", context), "Q11.R11.C11 == Q11.R11.C11").toBe(1);
  });
  test("ValueGetter getValueInfo()", () => {
    var getter = new ValueGetter();
    var value: any = { Q11: { R11: { C11: 1 } }, q1: { r1: { c1: 2 } } };
    var context = new VariableGetterContext(value);
    var result = getter.getValueInfo({ name: "Q11.R11.C11", context: context });
    expect(result.value, "value is correct").toBe(1);
    expect(result.isFound, "value is here").toBe(true);
    value.Q11.R11.C11 = 3;
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.C11", context: context });
    expect(result.value, "value is 3 now").toBe(3);
    expect(result.isFound, "value is here again").toBe(true);
    value.Q11.R11 = null;
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.C11", context: context });
    expect(result.value, "value is undefined").toBe(undefined);
    expect(result.isFound, "value is not here").toBe(false);
  });
  test("ValueGetter getValueInfo() with array", () => {
    var getter = new ValueGetter();
    var value: any = { Q11: { R11: [{ a: 1 }, { a: 2 }] } };
    var context = new VariableGetterContext(value);
    var result = getter.getValueInfo({ name: "Q11.R11[1].a", context: context });
    expect(result.value, "value is correct").toBe(2);
    expect(result.isFound, "value is here").toBe(true);
    value.Q11.R11[1].a = 3;
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11[1].a", context: context });
    expect(result.value, "value is 3 now").toBe(3);
    expect(result.isFound, "value is here again").toBe(true);
    value.Q11.R11 = [{ a: 1 }];
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11[1].a", context: context });
    expect(result.value, "value is undefined").toBe(undefined);
    expect(result.isFound, "value is not here").toBe(false);
  });
  test("ValueGetter getValueInfo() numbers in non array object, Bug#2331", () => {
    var getter = new ValueGetter();
    var value: any = { v: { 1: "a", 2: "b" } };
    var context = new VariableGetterContext(value);
    var result = getter.getValueInfo({ name: "v.2", context: context });
    expect(result.value, "value is b").toBe("b");
    expect(result.isFound, "value is here").toBe(true);
    value.v[2] = "c";
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "v.2", context: context });
    expect(result.value, "get correct value, c").toBe("c");
  });
  test("ValueGetter getValueInfo() with array, change the object to undefined, Bug#2432", () => {
    var getter = new ValueGetter();
    var value: any = { Q11: { R11: [{ a: 1 }, { a: 2 }] } };
    var context = new VariableGetterContext(value);
    var result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    expect(result.value, "length is 2").toBe(2);
    expect(result.isFound, "value is here").toBe(true);
    value.Q11.R11.push({ a: 4 });
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    expect(result.value, "length is 3").toBe(3);
    value.Q11.R11 = undefined;
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    expect(result.value, "length is 0, R11 is undefined").toBe(0);
    value.Q11 = undefined;
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    expect(result.value, "length is 0, Q11 is undefined").toBe(0);
  });
  test("ValueGetter.getPath()", () => {
    const getter = new ValueGetter();
    expect(getter.getPath("a.b.c"), "getPath simple").toEqual([{ name: "a" }, { name: "b" }, { name: "c" }]);
    expect(getter.getPath("a[0].b.c"), "getPath with array").toEqual([{ name: "a", index: 0 }, { name: "b" }, { name: "c" }]);
    expect(getter.getPath("a[0].b.c[1]"), "getPath with array and index").toEqual([{ name: "a", index: 0 }, { name: "b" }, { name: "c", index: 1 }]);
    expect(getter.getPath("a[0].b.c[1].d"), "getPath with array and index and property").toEqual([{ name: "a", index: 0 }, { name: "b" }, { name: "c", index: 1 }, { name: "d" }]);
    expect(getter.getPath("a.b.c.d"), "getPath with several properties").toEqual([{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }]);
    expect(getter.getPath("a.b.c[dd0].d"), "getPath with array and property").toEqual([{ name: "a" }, { name: "b" }, { name: "c[dd0]" }, { name: "d" }]);
  });
  test("VariableGetterContext.getValue()", () => {
    const getter = new ValueGetter();
    const context = new VariableGetterContext({
      a: 1, b: 2, c: 3, d: { e: 4, f: 5 }, g: [6, 7], KmT: { nD: 8 },
      "dot.dot": { "one.two.three": 9 }, arr: [{ state: "CA" }, { state: "TX" }] });
    expect(getter.getValue("a", context), "getValue a").toBe(1);
    expect(getter.getValue("b", context), "getValue b").toBe(2);
    expect(getter.getValue("c", context), "getValue c").toBe(3);
    expect(getter.getValue("d.e", context), "getValue d.e").toBe(4);
    expect(getter.getValue("d.f", context), "getValue d.f").toBe(5);
    expect(getter.getValue("g[0]", context), "getValue g[0]").toBe(6);
    expect(getter.getValue("g[1]", context), "getValue g[1]").toBe(7);
    expect(getter.getValue("g[2]", context), "getValue g[2]").toBe(undefined);
    expect(getter.getValue("kMt.Nd", context), "getValue kMt.Nd").toBe(8);
    expect(getter.getValue("dot.dot.one.two.three", context), "getValue dot.dot.one.two.three").toBe(9);
    expect(getter.getValue("arr[0].state", context), "arr[0].state").toBe("CA");
    expect(getter.getValue("arr[1].state", context), "arr[1].state").toBe("TX");
    expect(getter.getValue("arr.length", context), "arr.length").toBe(2);
  });
  test("survey.getValueGetterContext()", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultValue: "a" },
        { type: "dropdown", name: "q2", defaultValue: 1, choices: [{ value: 1, text: "item1" }] },
      ]
    });
    survey.setValue("a", 1);
    survey.setValue("b", 2);
    const getter = new ValueGetter();
    const context = survey.getValueGetterContext();
    expect(getter.getValue("a", context), "#1").toBe(1);
    expect(getter.getValue("b", context), "#2").toBe(2);
    expect(getter.getValue("locale", context), "#3").toBe("en");
    expect(getter.getValue("pagecount", context), "#4").toBe(1);
    expect(getter.getValue("q1", context), "#5").toBe("a");
    expect(getter.getValue("q2", context), "#6").toBe(1);
    expect(getter.getDisplayValue("q2", context, true), "#text 6").toBe("item1");
  });
});
