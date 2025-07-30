import {
  TextPreProcessor,
  TextPreProcessorValue,
} from "../src/textPreProcessor";
import { ValueGetter, VariableGetterContext } from "../src/conditionProcessValue";
import { SurveyModel } from "../src/survey";

export default QUnit.module("TextPreprocessorTests");

QUnit.test("Replace simple names", function (assert) {
  var processor = new TextPreProcessor();
  processor.onProcess = function (textValue: TextPreProcessorValue) {
    textValue.isExists = true;
    textValue.value = "aaa" + textValue.name;
  };
  var result = processor.process("test1 {111} test2");
  assert.equal(result, "test1 aaa111 test2", "in the middle");
  result = processor.process("{111} test2");
  assert.equal(result, "aaa111 test2", "at the start");
  result = processor.process("test1{111}");
  assert.equal(result, "test1aaa111", "at the end");
  result = processor.process("test1{aaa bbb}");
  assert.equal(result, "test1aaaaaa bbb", "several words");
  result = processor.process("test1{aaa-bbb}");
  assert.equal(result, "test1aaaaaa-bbb", "complex name");
  result = processor.process("test1{   bbb   }");
  assert.equal(result, "test1aaabbb", "removespaces");
  result = processor.process("test1{ }");
  assert.equal(result, "test1{ }", "do not process empty");
});

QUnit.test("onHasValue event", function (assert) {
  var processor = new TextPreProcessor();
  processor.onProcess = function (textValue: TextPreProcessorValue) {
    textValue.isExists = textValue.name == "myname";
    if (textValue.isExists) {
      textValue.value = "Andrew";
    }
  };
  var result = processor.process("test1 {name} test2");
  assert.equal(
    result,
    "test1 {name} test2",
    "do not process - name is unknown"
  );
  var result = processor.process("test1 {myname} test2");
  assert.equal(result, "test1 Andrew test2", "process successfull");
});

QUnit.test("ValueGetter getValue/hasValue, nested values", function (assert) {
  var getter = new ValueGetter();
  var context = new VariableGetterContext({ a: 1, b: { d: 2 }, c: { e: { f: 3 } }, g: 0 });
  assert.equal(getter.getValue("a", context), 1, "a=1");
  assert.equal(getter.getValue("b.d", context), 2, "b.d=2");
  assert.equal(getter.getValue("c.e.f", context), 3, "c.e.f=3");
  assert.equal(getter.getValueInfo({ name: "aaa", context: context }).isFound, false);
  assert.equal(getter.getValueInfo({ name: "a", context: context }).isFound, true);
  assert.equal(getter.getValueInfo({ name: "b", context: context }).isFound, true);
  assert.equal(getter.getValueInfo({ name: "b.d", context: context }).isFound, true);
  assert.equal(getter.getValueInfo({ name: "c", context: context }).isFound, true);
  assert.equal(getter.getValueInfo({ name: "c.e", context: context }).isFound, true);
  assert.equal(getter.getValueInfo({ name: "c.e.f", context: context }).isFound, true);
  assert.equal(getter.getValueInfo({ name: "g", context: context }).isFound, true);
  assert.equal(getter.getValue("g", context), 0);
});
QUnit.test("ValueGetter getValue/hasValue 2", function (assert) {
  var getter = new ValueGetter();
  var context = new VariableGetterContext({ abc: 1, ab: 2 });
  assert.equal(getter.getValue("AB", context), 2, "ab=2");
});

QUnit.test(
  "ValueGetter getValue/hasValue, arrays and nested values",
  function (assert) {
    var getter = new ValueGetter();
    var context = new VariableGetterContext({ a: [1, 2], b: [{ d: 2 }, { c: [3, { d: 4 }] }] });
    assert.equal(getter.getValue("a[0]", context), 1, "a[0]=1");
    assert.equal(getter.getValue("a[1]", context), 2, "a[1]=2");
    assert.equal(getter.getValue("a[3]", context), undefined, "a[3] - out of bounds");
    assert.equal(getter.getValue("b[0].d", context), 2, "b[0].d=2");
    assert.equal(getter.getValue("b[1].c[0]", context), 3, "c[0]=3");
    assert.equal(getter.getValue("b[1].c[1].d", context), 4, "c[0].d=4");
  }
);

QUnit.test("ValueGetter value name has dot inside", function (assert) {
  var getter = new ValueGetter();
  var context = new VariableGetterContext({ "a.b": 1, "a.b.c": 2, "a.bc": { d: 3 } });
  assert.equal(getter.getValue("a.b", context), 1, "'a.b'=1");
  assert.equal(getter.getValue("a.b.c", context), 2, "'a.b.c'=2");
  assert.equal(getter.getValue("a.bc.d", context), 3, "'a.bc'.d=3");
});

QUnit.test("ValueGetter insenstive names", function (assert) {
  var getter = new ValueGetter();
  var context = new VariableGetterContext({ Q11: { R11: { C11: 1 } }, q1: { r1: { c1: 2 } } });
  assert.equal(getter.getValue("Q1.R1.C1", context), 2, "q1.r1.c1 == Q1.R1.C1");
  assert.equal(
    getter.getValue("Q11.R11.C11", context),
    1,
    "Q11.R11.C11 == Q11.R11.C11"
  );
});
QUnit.test("ValueGetter getValueInfo()", function (assert) {
  var getter = new ValueGetter();
  var value: any = { Q11: { R11: { C11: 1 } }, q1: { r1: { c1: 2 } } };
  var context = new VariableGetterContext(value);
  var result = getter.getValueInfo({ name: "Q11.R11.C11", context: context });
  assert.equal(result.value, 1, "value is correct");
  assert.equal(result.isFound, true, "value is here");
  value.Q11.R11.C11 = 3;
  context = new VariableGetterContext(value);
  result = getter.getValueInfo({ name: "Q11.R11.C11", context: context });
  assert.equal(result.value, 3, "value is 3 now");
  assert.equal(result.isFound, true, "value is here again");
  value.Q11.R11 = null;
  context = new VariableGetterContext(value);
  result = getter.getValueInfo({ name: "Q11.R11.C11", context: context });
  assert.equal(result.value, undefined, "value is undefined");
  assert.equal(result.isFound, false, "value is not here");
});
QUnit.test("ValueGetter getValueInfo() with array", function (assert) {
  var getter = new ValueGetter();
  var value: any = { Q11: { R11: [{ a: 1 }, { a: 2 }] } };
  var context = new VariableGetterContext(value);
  var result = getter.getValueInfo({ name: "Q11.R11[1].a", context: context });
  assert.equal(result.value, 2, "value is correct");
  assert.equal(result.isFound, true, "value is here");
  value.Q11.R11[1].a = 3;
  context = new VariableGetterContext(value);
  result = getter.getValueInfo({ name: "Q11.R11[1].a", context: context });
  assert.equal(result.value, 3, "value is 3 now");
  assert.equal(result.isFound, true, "value is here again");
  value.Q11.R11 = [{ a: 1 }];
  context = new VariableGetterContext(value);
  result = getter.getValueInfo({ name: "Q11.R11[1].a", context: context });
  assert.equal(result.value, undefined, "value is undefined");
  assert.equal(result.isFound, false, "value is not here");
});
QUnit.test(
  "ValueGetter getValueInfo() numbers in non array object, Bug#2331",
  function (assert) {
    var getter = new ValueGetter();
    var value: any = { v: { 1: "a", 2: "b" } };
    var context = new VariableGetterContext(value);
    var result = getter.getValueInfo({ name: "v.2", context: context });
    assert.equal(result.value, "b", "value is b");
    assert.equal(result.isFound, true, "value is here");
    value.v[2] = "c";
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "v.2", context: context });
    assert.equal(result.value, "c", "get correct value, c");
  }
);
QUnit.test(
  "ValueGetter getValueInfo() with array, change the object to undefined, Bug#2432",
  function (assert) {
    var getter = new ValueGetter();
    var value: any = { Q11: { R11: [{ a: 1 }, { a: 2 }] } };
    var context = new VariableGetterContext(value);
    var result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    assert.equal(result.value, 2, "length is 2");
    assert.equal(result.isFound, true, "value is here");
    value.Q11.R11.push({ a: 4 });
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    assert.equal(result.value, 3, "length is 3");
    value.Q11.R11 = undefined;
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    assert.equal(result.value, 0, "length is 0, R11 is undefined");
    value.Q11 = undefined;
    context = new VariableGetterContext(value);
    result = getter.getValueInfo({ name: "Q11.R11.length", context: context });
    assert.equal(result.value, 0, "length is 0, Q11 is undefined");
  }
);
QUnit.test("ValueGetter.getPath()", function (assert) {
  const getter = new ValueGetter();
  assert.deepEqual(getter.getPath("a.b.c"), [{ name: "a" }, { name: "b" }, { name: "c" }], "getPath simple");
  assert.deepEqual(getter.getPath("a[0].b.c"), [{ name: "a", index: 0 }, { name: "b" }, { name: "c" }], "getPath with array");
  assert.deepEqual(getter.getPath("a[0].b.c[1]"), [{ name: "a", index: 0 }, { name: "b" }, { name: "c", index: 1 }], "getPath with array and index");
  assert.deepEqual(getter.getPath("a[0].b.c[1].d"), [{ name: "a", index: 0 }, { name: "b" }, { name: "c", index: 1 }, { name: "d" }], "getPath with array and index and property");
  assert.deepEqual(getter.getPath("a.b.c.d"), [{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }], "getPath with several properties");
  assert.deepEqual(getter.getPath("a.b.c[dd0].d"), [{ name: "a" }, { name: "b" }, { name: "c[dd0]" }, { name: "d" }], "getPath with array and property");
});
QUnit.test("VariableGetterContext.getValue()", function (assert) {
  const getter = new ValueGetter();
  const context = new VariableGetterContext({
    a: 1, b: 2, c: 3, d: { e: 4, f: 5 }, g: [6, 7], KmT: { nD: 8 },
    "dot.dot": { "one.two.three": 9 }, arr: [{ state: "CA" }, { state: "TX" }] });
  assert.equal(getter.getValue("a", context), 1, "getValue a");
  assert.equal(getter.getValue("b", context), 2, "getValue b");
  assert.equal(getter.getValue("c", context), 3, "getValue c");
  assert.equal(getter.getValue("d.e", context), 4, "getValue d.e");
  assert.equal(getter.getValue("d.f", context), 5, "getValue d.f");
  assert.equal(getter.getValue("g[0]", context), 6, "getValue g[0]");
  assert.equal(getter.getValue("g[1]", context), 7, "getValue g[1]");
  assert.equal(getter.getValue("g[2]", context), undefined, "getValue g[2]");
  assert.equal(getter.getValue("kMt.Nd", context), 8, "getValue kMt.Nd");
  assert.equal(getter.getValue("dot.dot.one.two.three", context), 9, "getValue dot.dot.one.two.three");
  assert.equal(getter.getValue("arr[0].state", context), "CA", "arr[0].state");
  assert.equal(getter.getValue("arr[1].state", context), "TX", "arr[1].state");
  assert.equal(getter.getValue("arr.length", context), 2, "arr.length");
});
QUnit.test("survey.getValueGetterContext()", function (assert) {
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
  assert.equal(getter.getValue("a", context), 1, "#1");
  assert.equal(getter.getValue("b", context), 2, "#2");
  assert.equal(getter.getValue("locale", context), "en", "#3");
  assert.equal(getter.getValue("pagecount", context), 1, "#4");
  assert.equal(getter.getValue("q1", context), "a", "#5");
  assert.equal(getter.getValue("q2", context), 1, "#6");
  assert.equal(getter.getDisplayValue("q2", context, true), "item1", "#text 6");
});
