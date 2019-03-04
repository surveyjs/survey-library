import {
  TextPreProcessor,
  TextPreProcessorValue
} from "../src/textPreProcessor";
import { Question } from "../src/question";
import { ProcessValue } from "../src/conditionProcessValue";

export default QUnit.module("TextPreprocessorTests");

QUnit.test("Replace simple names", function(assert) {
  var processor = new TextPreProcessor();
  processor.onProcess = function(textValue: TextPreProcessorValue) {
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

QUnit.test("onHasValue event", function(assert) {
  var processor = new TextPreProcessor();
  processor.onProcess = function(textValue: TextPreProcessorValue) {
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

QUnit.test("ProcessValue getFirst Name", function(assert) {
  var process = new ProcessValue();
  assert.equal(process.getFirstName("name1"), "name1", "name is the same");
  assert.equal(process.getFirstName("name-1"), "name-1", "name is the same 2");
  assert.equal(process.getFirstName("name-1.name2"), "name-1", "till .");
  assert.equal(process.getFirstName("name-1[0].value"), "name-1", "till [");
});
QUnit.test("ProcessValue getFirst Name", function(assert) {
  var process = new ProcessValue();
  assert.equal(process.getFirstName("name1"), "name1", "name is the same");
  assert.equal(process.getFirstName("name-1"), "name-1", "name is the same 2");
  assert.equal(process.getFirstName("name-1.name2"), "name-1", "till .");
  assert.equal(process.getFirstName("name-1[0].value"), "name-1", "till [");
});
QUnit.test("ProcessValue getValue/hasValue, nested values", function(assert) {
  var process = new ProcessValue();
  var value = { a: 1, b: { d: 2 }, c: { e: { f: 3 } } };
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
});

QUnit.test("ProcessValue getValue/hasValue, arrays and nested values", function(
  assert
) {
  var process = new ProcessValue();
  var value = { a: [1, 2], b: [{ d: 2 }, { c: [3, { d: 4 }] }] };
  assert.equal(process.getValue("a[0]", value), 1, "a[0]=1");
  assert.equal(process.getValue("a[1]", value), 2, "a[1]=2");
  assert.equal(process.getValue("a[3]", value), null, "a[3] - out of bounds");
  assert.equal(process.getValue("b[0].d", value), 2, "b[0].d=2");
  assert.equal(process.getValue("b[1].c[0]", value), 3, "c[0]=3");
  assert.equal(process.getValue("b[1].c[1].d", value), 4, "c[0].d=4");
});

QUnit.test("Question process any property", function(assert) {
  var question = new Question("q1");
  var processor = new TextPreProcessor();
  processor.onProcess = val => question["getProcessedTextValue"](val);
  assert.equal(
    processor.process("test1 {name} test2"),
    "test1 q1 test2",
    "name is the same"
  );
});

QUnit.test("ProcessValue setValue function", function(assert) {
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
