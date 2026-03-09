import { ConditionRunner } from "../src/conditions/conditionRunner";
import { ExpressionRunner } from "../src/expressions/expressionRunner";
import { ConditionsParser } from "../src/conditions/conditionsParser";
import { ProcessValue, VariableGetterContext } from "../src/conditions/conditionProcessValue";
import {
  TextPreProcessor,
  TextPreProcessorValue,
} from "../src/textPreProcessor";
import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";

export default QUnit.module("DoubleBracesTests");

function setDoubleBraces() {
  settings.expressionVariableDelimiters = { start: "{{", end: "}}" };
}
function resetBraces() {
  settings.expressionVariableDelimiters = { start: "{", end: "}" };
}

// =====================================================
// Expression parser tests with double braces
// =====================================================

QUnit.test("Expression: parse variable with double braces", function (assert) {
  setDoubleBraces();
  try {
    var parser = new ConditionsParser();
    var operand = parser.parseExpression("{{ImConst}} > 5");
    assert.ok(!!operand, "expression is parsed");
    var processValue = new ProcessValue(new VariableGetterContext({ ImConst: 7 }));
    assert.equal(operand.evaluate(processValue), true, "7 > 5 is true");

    processValue = new ProcessValue(new VariableGetterContext({ ImConst: 3 }));
    assert.equal(operand.evaluate(processValue), false, "3 > 5 is false");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: Variable.toString() uses double braces", function (assert) {
  setDoubleBraces();
  try {
    var parser = new ConditionsParser();
    var operand = parser.parseExpression("{{q1}} = 1");
    assert.ok(!!operand, "expression is parsed");
    var str = operand.toString();
    assert.ok(str.indexOf("{{q1}}") > -1, "toString contains {{q1}}: " + str);
    assert.equal(str.indexOf("{q1}") < 0 || str.indexOf("{{q1}}") > -1, true, "no single braces");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: ConditionRunner with double braces", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ConditionRunner("{{a}} > 5");
    assert.equal(runner.runValues({ a: 6 }), true, "6 > 5 is true");
    assert.equal(runner.runValues({ a: 5 }), false, "5 > 5 is false");
    assert.equal(runner.runValues({ a: 4 }), false, "4 > 5 is false");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: ExpressionRunner with double braces", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ExpressionRunner("{{var1}} + {{var2}}");
    assert.equal(runner.runValues({ var1: 3, var2: 4 }), 7, "3 + 4 = 7");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: complex condition with double braces", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ConditionRunner(
      "{{age}} >= 21 and ({{sex}} = 'male' or {{kids}} > 1)"
    );
    var values = { age: 21, sex: "male", kids: 1 };
    assert.equal(runner.runValues(values), true, "21, male, 1 kid");

    values = { age: 21, sex: "female", kids: 1 };
    assert.equal(runner.runValues(values), false, "21, female, 1 kid");

    values = { age: 21, sex: "female", kids: 2 };
    assert.equal(runner.runValues(values), true, "21, female, 2 kids");

    values = { age: 20, sex: "male", kids: 2 };
    assert.equal(runner.runValues(values), false, "20, male, 2 kids");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: double braces with function", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ExpressionRunner("iif({{q1}} == 1, 'Yes', 'No')");
    assert.equal(runner.runValues({ q1: 1 }), "Yes", "q1=1 => Yes");
    assert.equal(runner.runValues({ q1: 2 }), "No", "q1=2 => No");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: double braces with empty/notempty", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ConditionRunner("{{var1}} empty");
    assert.equal(runner.runValues({}), true, "undefined is empty");
    assert.equal(runner.runValues({ var1: 1 }), false, "1 is not empty");

    runner = new ConditionRunner("{{var1}} notempty");
    assert.equal(runner.runValues({ var1: "abc" }), true, "'abc' is not empty");
    assert.equal(runner.runValues({}), false, "undefined is empty");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: double braces with contains", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ConditionRunner("{{a}} contains 1");
    assert.equal(runner.runValues({ a: [1, 2, 3] }), true, "[1,2,3] contains 1");
    assert.equal(runner.runValues({ a: [2, 3] }), false, "[2,3] does not contain 1");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: double braces getVariables", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ConditionRunner("{{q1}} + {{q2}} > 5");
    var vars = runner.getVariables();
    assert.equal(vars.length, 2, "two variables");
    assert.equal(vars[0], "q1", "first variable is q1");
    assert.equal(vars[1], "q2", "second variable is q2");
  } finally {
    resetBraces();
  }
});

QUnit.test("Expression: reset to single braces still works", function (assert) {
  setDoubleBraces();
  var runner1 = new ConditionRunner("{{a}} > 5");
  assert.equal(runner1.runValues({ a: 6 }), true, "double braces: 6 > 5");
  resetBraces();

  var runner2 = new ConditionRunner("{a} > 5");
  assert.equal(runner2.runValues({ a: 6 }), true, "single braces: 6 > 5");
});

QUnit.test("Expression: nested property with double braces", function (assert) {
  setDoubleBraces();
  try {
    var runner = new ConditionRunner("{{row.user_id}} notempty");
    assert.ok(runner.canRun(), "expression is valid");
  } finally {
    resetBraces();
  }
});

// =====================================================
// Text pre-processor tests with double braces
// =====================================================

QUnit.test("TextPreProcessor: replace simple names with double braces", function (assert) {
  setDoubleBraces();
  try {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = true;
      textValue.value = "aaa" + textValue.name;
    };
    var result = processor.process("test1 {{111}} test2");
    assert.equal(result, "test1 aaa111 test2", "in the middle");
    result = processor.process("{{111}} test2");
    assert.equal(result, "aaa111 test2", "at the start");
    result = processor.process("test1{{111}}");
    assert.equal(result, "test1aaa111", "at the end");
    result = processor.process("test1{{aaa bbb}}");
    assert.equal(result, "test1aaaaaa bbb", "several words");
    result = processor.process("test1{{aaa-bbb}}");
    assert.equal(result, "test1aaaaaa-bbb", "complex name");
    result = processor.process("test1{{   bbb   }}");
    assert.equal(result, "test1aaabbb", "remove spaces");
  } finally {
    resetBraces();
  }
});

QUnit.test("TextPreProcessor: onHasValue with double braces", function (assert) {
  setDoubleBraces();
  try {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = textValue.name == "myname";
      if (textValue.isExists) {
        textValue.value = "Andrew";
      }
    };
    var result = processor.process("test1 {{name}} test2");
    assert.equal(result, "test1 {{name}} test2", "do not process - name is unknown");
    result = processor.process("test1 {{myname}} test2");
    assert.equal(result, "test1 Andrew test2", "process successful");
  } finally {
    resetBraces();
  }
});

QUnit.test("TextPreProcessor: multiple variables with double braces", function (assert) {
  setDoubleBraces();
  try {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = true;
      if (textValue.name === "first") textValue.value = "John";
      if (textValue.name === "last") textValue.value = "Doe";
    };
    var result = processor.process("Hello {{first}} {{last}}!");
    assert.equal(result, "Hello John Doe!", "two variables replaced");
  } finally {
    resetBraces();
  }
});

QUnit.test("TextPreProcessor: double braces should not match single braces", function (assert) {
  setDoubleBraces();
  try {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = true;
      textValue.value = "replaced";
    };
    // Single braces should NOT be processed when double braces are configured
    var result = processor.process("test {name} test");
    assert.equal(result, "test {name} test", "single braces not processed");
    // Double braces SHOULD be processed
    result = processor.process("test {{name}} test");
    assert.equal(result, "test replaced test", "double braces processed");
  } finally {
    resetBraces();
  }
});

QUnit.test("TextPreProcessor: empty double braces", function (assert) {
  setDoubleBraces();
  try {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = true;
      textValue.value = "replaced";
    };
    var result = processor.process("test {{}} test");
    assert.equal(result, "test {{}} test", "empty double braces not processed");
    result = processor.process("test {{ }} test");
    assert.equal(result, "test {{ }} test", "space-only double braces not processed");
  } finally {
    resetBraces();
  }
});

QUnit.test("TextPreProcessor: reset to single braces still works", function (assert) {
  setDoubleBraces();
  var processor = new TextPreProcessor();
  processor.onProcess = function (textValue: TextPreProcessorValue) {
    textValue.isExists = true;
    textValue.value = "val";
  };
  var result = processor.process("{{name}}");
  assert.equal(result, "val", "double braces work");
  resetBraces();
  result = processor.process("{name}");
  assert.equal(result, "val", "single braces work after reset");
});

QUnit.test("TextPreProcessor: hasAllValuesOnLastRun with double braces", function (assert) {
  setDoubleBraces();
  try {
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = textValue.name === "known";
      if (textValue.isExists) textValue.value = "yes";
    };
    processor.process("{{known}}");
    assert.equal(processor.hasAllValuesOnLastRun, true, "all values found");
    processor.process("{{unknown}}");
    assert.equal(processor.hasAllValuesOnLastRun, false, "not all values found");
  } finally {
    resetBraces();
  }
});

// =====================================================
// Survey integration tests with double braces
// =====================================================

QUnit.test("Survey: text processing with double braces", function (assert) {
  setDoubleBraces();
  try {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", title: "Result: {{q1}}" }
      ]
    });
    survey.setValue("q1", "hello");
    var q2 = survey.getQuestionByName("q2");
    assert.ok(q2.locTitle.textOrHtml.indexOf("hello") > -1, "title processed with double braces");
  } finally {
    resetBraces();
  }
});

QUnit.test("Survey: visibleIf with double braces", function (assert) {
  setDoubleBraces();
  try {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{{q1}} = 'show'" }
      ]
    });
    var q2 = survey.getQuestionByName("q2");
    assert.equal(q2.isVisible, false, "initially hidden");
    survey.setValue("q1", "show");
    assert.equal(q2.isVisible, true, "visible after setting value");
    survey.setValue("q1", "hide");
    assert.equal(q2.isVisible, false, "hidden again");
  } finally {
    resetBraces();
  }
});

QUnit.test("Survey: calculatedValues with double braces", function (assert) {
  setDoubleBraces();
  try {
    var survey = new SurveyModel({
      calculatedValues: [
        { name: "sum", expression: "{{q1}} + {{q2}}" }
      ],
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2", inputType: "number" },
        { type: "expression", name: "q3", expression: "{{sum}}" }
      ]
    });
    survey.setValue("q1", 3);
    survey.setValue("q2", 4);
    assert.equal(survey.getQuestionByName("q3").value, 7, "calculated value with double braces");
  } finally {
    resetBraces();
  }
});
