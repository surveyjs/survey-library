import TextPreProcessor from "../src/textPreProcessor";

QUnit.module("TextPreprocessorTests");

QUnit.test("Replace simple names", function (assert) {
    var processor = new TextPreProcessor();
    processor.onProcess = function (name) { return "aaa" + name; };
    var result = processor.process("test1 {111} test2");
    assert.equal(result, "test1 aaa111 test2", "in the middle");
    result = processor.process("{111} test2");
    assert.equal(result, "aaa111 test2", "at the start");
    result = processor.process("test1{111}");
    assert.equal(result, "test1aaa111", "at the end");
    result = processor.process("test1{aaa bbb}");
    assert.equal(result, "test1{aaa bbb}", "do not process several words");
    result = processor.process("test1{aaa-bbb}");
    assert.equal(result, "test1{aaa-bbb}", "do not process several words separed by any symbols");
    result = processor.process("test1{   bbb   }");
    assert.equal(result, "test1aaabbb", "removespaces");
    result = processor.process("test1{ }");
    assert.equal(result, "test1{ }", "do not process empty");
});

QUnit.test("onHasValue event", function (assert) {
    var processor = new TextPreProcessor();
    processor.onProcess = function (name) { return "Andrew"; };
    processor.onHasValue = function (name) { return name == "myname" };
    var result = processor.process("test1 {name} test2");
    assert.equal(result, "test1 {name} test2", "do not process - name is unknown");
    var result = processor.process("test1 {myname} test2");
    assert.equal(result, "test1 Andrew test2", "process successfull");
});