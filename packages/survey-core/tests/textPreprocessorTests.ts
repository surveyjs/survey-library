import {
  TextPreProcessor,
  TextPreProcessorValue,
} from "../src/textPreProcessor";
import { Question } from "../src/question";
import { ProcessValue } from "../src/conditionProcessValue";

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

QUnit.test("ProcessValue getFirstName", function (assert) {
  var process = new ProcessValue();
  assert.equal(process.getFirstName("name1"), "name1", "name is the same");
  assert.equal(process.getFirstName("name-1"), "name-1", "name is the same 2");
  assert.equal(process.getFirstName("name-1.name2"), "name-1", "till .");
  assert.equal(process.getFirstName("name-1[0].value"), "name-1", "till [");
});
QUnit.test("ProcessValue getFirstName with object", function (assert) {
  var obj = { "a.b.c": { d: 1 } };
  var process = new ProcessValue();
  assert.equal(process.getFirstName("name1", obj), "name1", "name is the same");
  assert.equal(
    process.getFirstName("name-1", obj),
    "name-1",
    "name is the same 2"
  );
  assert.equal(process.getFirstName("name-1.name2", obj), "name-1", "till .");
  assert.equal(
    process.getFirstName("name-1[0].value", obj),
    "name-1",
    "till ["
  );
  assert.equal(
    process.getFirstName("a.b.c.d", obj),
    "a.b.c",
    "object with dot"
  );
});
QUnit.test("ProcessValue getValue/hasValue, nested values", function (assert) {
  var process = new ProcessValue();
  var value = { a: 1, b: { d: 2 }, c: { e: { f: 3 } }, g: 0 };
  assert.equal(process.getValue("a", value), 1, "a=1");
  assert.equal(process.getValue("b.d", value), 2, "b.d=2");
  assert.equal(process.getValue("c.e.f", value), 3, "c.e.f=3");
  assert.equal(process.hasValue("aaa", value), false);
  assert.equal(process.hasValue("a", value), true);
  assert.equal(process.hasValue("b", value), true);
  assert.equal(process.hasValue("b.d", value), true);
  assert.equal(process.hasValue("c", value), true);
  assert.equal(process.hasValue("c.e", value), true);
  assert.equal(process.hasValue("c.e.f", value), true);
  assert.equal(process.hasValue("g", value), true);
  assert.equal(process.getValue("g", value), 0);
});
QUnit.test("ProcessValue getValue/hasValue 2", function (assert) {
  var process = new ProcessValue();
  var value = { abc: 1, ab: 2 };
  assert.equal(process.getValue("AB", value), 2, "ab=2");
});

QUnit.test(
  "ProcessValue getValue/hasValue, arrays and nested values",
  function (assert) {
    var process = new ProcessValue();
    var value = { a: [1, 2], b: [{ d: 2 }, { c: [3, { d: 4 }] }] };
    assert.equal(process.getValue("a[0]", value), 1, "a[0]=1");
    assert.equal(process.getValue("a[1]", value), 2, "a[1]=2");
    assert.equal(process.getValue("a[3]", value), null, "a[3] - out of bounds");
    assert.equal(process.getValue("b[0].d", value), 2, "b[0].d=2");
    assert.equal(process.getValue("b[1].c[0]", value), 3, "c[0]=3");
    assert.equal(process.getValue("b[1].c[1].d", value), 4, "c[0].d=4");
  }
);

QUnit.test("Question process any property", function (assert) {
  var question = new Question("q1");
  var processor = new TextPreProcessor();
  processor.onProcess = (val) => question["getProcessedTextValue"](val);
  assert.equal(
    processor.process("test1 {name} test2"),
    "test1 q1 test2",
    "name is the same"
  );
});

QUnit.test("ProcessValue setValue function", function (assert) {
  var processor = new ProcessValue();
  var data = { a: [{}], b: { c: 2 } };
  processor.setValue(data, "name", 1);
  assert.deepEqual(
    data,
    { a: [{}], b: { c: 2 }, name: 1 },
    "set the simple value correctly"
  );
  processor.setValue(data, "a[0].name", 1);
  assert.deepEqual(
    data,
    { a: [{ name: 1 }], b: { c: 2 }, name: 1 },
    "set the array value correctly"
  );
  processor.setValue(data, "b.c", 5);
  assert.deepEqual(
    data,
    { a: [{ name: 1 }], b: { c: 5 }, name: 1 },
    "set the nested object value correctly"
  );
});

QUnit.test("ProcessValue setValue function - create path", function (assert) {
  var processor = new ProcessValue();
  var data: any = { a: {}, b: 1 };
  processor.setValue(data, "a.b", 1);
  assert.deepEqual(data, { a: { b: 1 }, b: 1 }, "set the object inside");
  processor.setValue(data, "c.a.b", 2);
  processor.setValue(data, "a[0].name", 1);
  assert.deepEqual(
    data,
    { a: { b: 1 }, "a[0]": { "name": 1 }, b: 1, c: { a: { b: 2 } } },
    "create new object"
  );
  data = { a: { Item1: { c1: 0 }, Item3: { c1: 1 } } };
  processor.setValue(data, "a.Item1.c1", 1);
  processor.setValue(data, "a.Item2.c1", 2);
  processor.setValue(data, "a.Item3.c1", 3);
  assert.deepEqual(data, {
    a: { Item1: { c1: 1 }, Item2: { c1: 2 }, Item3: { c1: 3 } },
  });
});

QUnit.test("ProcessValue setValue function for arrays", function (assert) {
  var processor = new ProcessValue();
  var data = { panel1: [{ question1: 1 }], panel2: [{}] };
  processor.setValue(data, "panel2[0].question2", 2);
  assert.deepEqual(
    data,
    { panel1: [{ question1: 1 }], panel2: [{ question2: 2 }] },
    "set the value into array correctly"
  );
});

QUnit.test("ProcessValue value name has dot inside", function (assert) {
  var process = new ProcessValue();
  var value = { "a.b": 1, "a.b.c": 2, "a.bc": { d: 3 } };
  assert.equal(process.getValue("a.b", value), 1, "'a.b'=1");
  assert.equal(process.getValue("a.b.c", value), 2, "'a.b.d'=2");
  assert.equal(process.getValue("a.bc.d", value), 3, "'a.bc'.d=3");
});

QUnit.test("ProcessValue insenstive names", function (assert) {
  var process = new ProcessValue();
  var value = { Q11: { R11: { C11: 1 } }, q1: { r1: { c1: 2 } } };
  assert.equal(process.getValue("Q1.R1.C1", value), 2, "q1.r1.c1 == Q1.R1.C1");
  assert.equal(
    process.getValue("Q11.R11.C11", value),
    1,
    "Q11.R11.C11 == Q11.R11.C11"
  );
});
QUnit.test("ProcessValue getValueInfo()", function (assert) {
  var value = { Q11: { R11: { C11: 1 } }, q1: { r1: { c1: 2 } } };
  var process = new ProcessValue();
  process.values = value;
  var valueInfo: any = { name: "Q11.R11.C11" };
  process.getValueInfo(valueInfo);
  assert.equal(valueInfo.value, 1, "value is correct");
  assert.equal(valueInfo.hasValue, true, "value is here");
  assert.deepEqual(valueInfo.path, ["Q11", "R11", "C11"], "path is correct");
  value.Q11.R11.C11 = 3;
  process.getValueInfo(valueInfo);
  assert.equal(valueInfo.value, 3, "value is 3 now");
  assert.equal(valueInfo.hasValue, true, "value is here again");
  value.Q11.R11 = null;
  process.getValueInfo(valueInfo);
  assert.equal(valueInfo.value, null, "value is null");
  assert.equal(valueInfo.hasValue, false, "value is not here");
});
QUnit.test("ProcessValue getValueInfo() with array", function (assert) {
  var value = { Q11: { R11: [{ a: 1 }, { a: 2 }] } };
  var process = new ProcessValue();
  process.values = value;
  var valueInfo: any = { name: "Q11.R11[1].a" };
  process.getValueInfo(valueInfo);
  assert.equal(valueInfo.value, 2, "value is correct");
  assert.equal(valueInfo.hasValue, true, "value is here");
  assert.deepEqual(valueInfo.path, ["Q11", "R11", 1, "a"], "path is correct");
  value.Q11.R11[1].a = 3;
  process.getValueInfo(valueInfo);
  assert.equal(valueInfo.value, 3, "value is 3 now");
  assert.equal(valueInfo.hasValue, true, "value is here again");
  value.Q11.R11 = [{ a: 1 }];
  process.getValueInfo(valueInfo);
  assert.equal(valueInfo.value, null, "value is null");
  assert.equal(valueInfo.hasValue, false, "value is not here");
});
QUnit.test(
  "ProcessValue getValueInfo() numbers in non array object, Bug#2331",
  function (assert) {
    var value = { v: { 1: "a", 2: "b" } };
    var process = new ProcessValue();
    process.values = value;
    var valueInfo: any = { name: "v.2" };
    process.getValueInfo(valueInfo);
    assert.equal(valueInfo.value, "b", "value is b");
    assert.deepEqual(valueInfo.path, ["v", "2"], "path is correct");
    value.v[2] = "c";
    process.getValueInfo(valueInfo);
    assert.equal(valueInfo.value, "c", "get correct value, c");
  }
);
QUnit.test(
  "ProcessValue getValueInfo() with array, change the object to undefined, Bug#2432",
  function (assert) {
    var value = { Q11: { R11: [{ a: 1 }, { a: 2 }] } };
    var process = new ProcessValue();
    process.values = value;
    var valueInfo: any = { name: "Q11.R11.length" };
    process.getValueInfo(valueInfo);
    assert.equal(valueInfo.value, 2, "length is 2");
    assert.equal(valueInfo.hasValue, true, "value is here");
    assert.deepEqual(
      valueInfo.path,
      ["Q11", "R11", "length"],
      "path is correct"
    );
    value.Q11.R11.push({ a: 4 });
    process.getValueInfo(valueInfo);
    assert.equal(valueInfo.value, 3, "length is 3");
    value.Q11.R11 = undefined;
    process.getValueInfo(valueInfo);
    assert.equal(valueInfo.value, 0, "length is 0, R11 is undefined");
    value.Q11 = undefined;
    process.getValueInfo(valueInfo);
    assert.equal(valueInfo.value, 0, "length is 0, Q11 is undefined");
  }
);
