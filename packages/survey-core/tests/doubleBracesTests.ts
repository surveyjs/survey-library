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

import { describe, test, expect } from "vitest";
describe("DoubleBracesTests", () => {
  function setDoubleBraces() {
    settings.expressionVariableDelimiters = { start: "{{", end: "}}" };
  }
  function resetBraces() {
    settings.expressionVariableDelimiters = { start: "{", end: "}" };
  }

  // =====================================================
  // Expression parser tests with double braces
  // =====================================================

  test("Expression: parse variable with double braces", () => {
    setDoubleBraces();
    try {
      var parser = new ConditionsParser();
      var operand = parser.parseExpression("{{ImConst}} > 5");
      expect(!!operand, "expression is parsed").toBeTruthy();
      var processValue = new ProcessValue(new VariableGetterContext({ ImConst: 7 }));
      expect(operand.evaluate(processValue), "7 > 5 is true").toBe(true);

      processValue = new ProcessValue(new VariableGetterContext({ ImConst: 3 }));
      expect(operand.evaluate(processValue), "3 > 5 is false").toBe(false);
    } finally {
      resetBraces();
    }
  });

  test("Expression: Variable.toString() uses double braces", () => {
    setDoubleBraces();
    try {
      var parser = new ConditionsParser();
      var operand = parser.parseExpression("{{q1}} = 1");
      expect(!!operand, "expression is parsed").toBeTruthy();
      var str = operand.toString();
      expect(str.indexOf("{{q1}}") > -1, "toString contains {{q1}}: " + str).toBeTruthy();
      expect(str.indexOf("{q1}") < 0 || str.indexOf("{{q1}}") > -1, "no single braces").toBe(true);
    } finally {
      resetBraces();
    }
  });

  test("Expression: ConditionRunner with double braces", () => {
    setDoubleBraces();
    try {
      var runner = new ConditionRunner("{{a}} > 5");
      expect(runner.runValues({ a: 6 }), "6 > 5 is true").toBe(true);
      expect(runner.runValues({ a: 5 }), "5 > 5 is false").toBe(false);
      expect(runner.runValues({ a: 4 }), "4 > 5 is false").toBe(false);
    } finally {
      resetBraces();
    }
  });

  test("Expression: ExpressionRunner with double braces", () => {
    setDoubleBraces();
    try {
      var runner = new ExpressionRunner("{{var1}} + {{var2}}");
      expect(runner.runValues({ var1: 3, var2: 4 }), "3 + 4 = 7").toBe(7);
    } finally {
      resetBraces();
    }
  });

  test("Expression: complex condition with double braces", () => {
    setDoubleBraces();
    try {
      var runner = new ConditionRunner(
        "{{age}} >= 21 and ({{sex}} = 'male' or {{kids}} > 1)"
      );
      var values = { age: 21, sex: "male", kids: 1 };
      expect(runner.runValues(values), "21, male, 1 kid").toBe(true);

      values = { age: 21, sex: "female", kids: 1 };
      expect(runner.runValues(values), "21, female, 1 kid").toBe(false);

      values = { age: 21, sex: "female", kids: 2 };
      expect(runner.runValues(values), "21, female, 2 kids").toBe(true);

      values = { age: 20, sex: "male", kids: 2 };
      expect(runner.runValues(values), "20, male, 2 kids").toBe(false);
    } finally {
      resetBraces();
    }
  });

  test("Expression: double braces with function", () => {
    setDoubleBraces();
    try {
      var runner = new ExpressionRunner("iif({{q1}} == 1, 'Yes', 'No')");
      expect(runner.runValues({ q1: 1 }), "q1=1 => Yes").toBe("Yes");
      expect(runner.runValues({ q1: 2 }), "q1=2 => No").toBe("No");
    } finally {
      resetBraces();
    }
  });

  test("Expression: double braces with empty/notempty", () => {
    setDoubleBraces();
    try {
      var runner = new ConditionRunner("{{var1}} empty");
      expect(runner.runValues({}), "undefined is empty").toBe(true);
      expect(runner.runValues({ var1: 1 }), "1 is not empty").toBe(false);

      runner = new ConditionRunner("{{var1}} notempty");
      expect(runner.runValues({ var1: "abc" }), "'abc' is not empty").toBe(true);
      expect(runner.runValues({}), "undefined is empty").toBe(false);
    } finally {
      resetBraces();
    }
  });

  test("Expression: double braces with contains", () => {
    setDoubleBraces();
    try {
      var runner = new ConditionRunner("{{a}} contains 1");
      expect(runner.runValues({ a: [1, 2, 3] }), "[1,2,3] contains 1").toBe(true);
      expect(runner.runValues({ a: [2, 3] }), "[2,3] does not contain 1").toBe(false);
    } finally {
      resetBraces();
    }
  });

  test("Expression: double braces getVariables", () => {
    setDoubleBraces();
    try {
      var runner = new ConditionRunner("{{q1}} + {{q2}} > 5");
      var vars = runner.getVariables();
      expect(vars.length, "two variables").toBe(2);
      expect(vars[0], "first variable is q1").toBe("q1");
      expect(vars[1], "second variable is q2").toBe("q2");
    } finally {
      resetBraces();
    }
  });

  test("Expression: reset to single braces still works", () => {
    setDoubleBraces();
    var runner1 = new ConditionRunner("{{a}} > 5");
    expect(runner1.runValues({ a: 6 }), "double braces: 6 > 5").toBe(true);
    resetBraces();

    var runner2 = new ConditionRunner("{a} > 5");
    expect(runner2.runValues({ a: 6 }), "single braces: 6 > 5").toBe(true);
  });

  test("Expression: nested property with double braces", () => {
    setDoubleBraces();
    try {
      var runner = new ConditionRunner("{{row.user_id}} notempty");
      expect(runner.canRun(), "expression is valid").toBeTruthy();
    } finally {
      resetBraces();
    }
  });

  // =====================================================
  // Text pre-processor tests with double braces
  // =====================================================

  test("TextPreProcessor: replace simple names with double braces", () => {
    setDoubleBraces();
    try {
      var processor = new TextPreProcessor();
      processor.onProcess = function (textValue: TextPreProcessorValue) {
        textValue.isExists = true;
        textValue.value = "aaa" + textValue.name;
      };
      var result = processor.process("test1 {{111}} test2");
      expect(result, "in the middle").toBe("test1 aaa111 test2");
      result = processor.process("{{111}} test2");
      expect(result, "at the start").toBe("aaa111 test2");
      result = processor.process("test1{{111}}");
      expect(result, "at the end").toBe("test1aaa111");
      result = processor.process("test1{{aaa bbb}}");
      expect(result, "several words").toBe("test1aaaaaa bbb");
      result = processor.process("test1{{aaa-bbb}}");
      expect(result, "complex name").toBe("test1aaaaaa-bbb");
      result = processor.process("test1{{   bbb   }}");
      expect(result, "remove spaces").toBe("test1aaabbb");
    } finally {
      resetBraces();
    }
  });

  test("TextPreProcessor: onHasValue with double braces", () => {
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
      expect(result, "do not process - name is unknown").toBe("test1 {{name}} test2");
      result = processor.process("test1 {{myname}} test2");
      expect(result, "process successful").toBe("test1 Andrew test2");
    } finally {
      resetBraces();
    }
  });

  test("TextPreProcessor: multiple variables with double braces", () => {
    setDoubleBraces();
    try {
      var processor = new TextPreProcessor();
      processor.onProcess = function (textValue: TextPreProcessorValue) {
        textValue.isExists = true;
        if (textValue.name === "first") textValue.value = "John";
        if (textValue.name === "last") textValue.value = "Doe";
      };
      var result = processor.process("Hello {{first}} {{last}}!");
      expect(result, "two variables replaced").toBe("Hello John Doe!");
    } finally {
      resetBraces();
    }
  });

  test("TextPreProcessor: double braces should not match single braces", () => {
    setDoubleBraces();
    try {
      var processor = new TextPreProcessor();
      processor.onProcess = function (textValue: TextPreProcessorValue) {
        textValue.isExists = true;
        textValue.value = "replaced";
      };
      // Single braces should NOT be processed when double braces are configured
      var result = processor.process("test {name} test");
      expect(result, "single braces not processed").toBe("test {name} test");
      // Double braces SHOULD be processed
      result = processor.process("test {{name}} test");
      expect(result, "double braces processed").toBe("test replaced test");
    } finally {
      resetBraces();
    }
  });

  test("TextPreProcessor: empty double braces", () => {
    setDoubleBraces();
    try {
      var processor = new TextPreProcessor();
      processor.onProcess = function (textValue: TextPreProcessorValue) {
        textValue.isExists = true;
        textValue.value = "replaced";
      };
      var result = processor.process("test {{}} test");
      expect(result, "empty double braces not processed").toBe("test {{}} test");
      result = processor.process("test {{ }} test");
      expect(result, "space-only double braces not processed").toBe("test {{ }} test");
    } finally {
      resetBraces();
    }
  });

  test("TextPreProcessor: reset to single braces still works", () => {
    setDoubleBraces();
    var processor = new TextPreProcessor();
    processor.onProcess = function (textValue: TextPreProcessorValue) {
      textValue.isExists = true;
      textValue.value = "val";
    };
    var result = processor.process("{{name}}");
    expect(result, "double braces work").toBe("val");
    resetBraces();
    result = processor.process("{name}");
    expect(result, "single braces work after reset").toBe("val");
  });

  test("TextPreProcessor: hasAllValuesOnLastRun with double braces", () => {
    setDoubleBraces();
    try {
      var processor = new TextPreProcessor();
      processor.onProcess = function (textValue: TextPreProcessorValue) {
        textValue.isExists = textValue.name === "known";
        if (textValue.isExists) textValue.value = "yes";
      };
      processor.process("{{known}}");
      expect(processor.hasAllValuesOnLastRun, "all values found").toBe(true);
      processor.process("{{unknown}}");
      expect(processor.hasAllValuesOnLastRun, "not all values found").toBe(false);
    } finally {
      resetBraces();
    }
  });

  // =====================================================
  // Survey integration tests with double braces
  // =====================================================

  test("Survey: text processing with double braces", () => {
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
      expect(q2.locTitle.textOrHtml.indexOf("hello") > -1, "title processed with double braces").toBeTruthy();
    } finally {
      resetBraces();
    }
  });

  test("Survey: visibleIf with double braces", () => {
    setDoubleBraces();
    try {
      var survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2", visibleIf: "{{q1}} = 'show'" }
        ]
      });
      var q2 = survey.getQuestionByName("q2");
      expect(q2.isVisible, "initially hidden").toBe(false);
      survey.setValue("q1", "show");
      expect(q2.isVisible, "visible after setting value").toBe(true);
      survey.setValue("q1", "hide");
      expect(q2.isVisible, "hidden again").toBe(false);
    } finally {
      resetBraces();
    }
  });

  test("Survey: calculatedValues with double braces", () => {
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
      expect(survey.getQuestionByName("q3").value, "calculated value with double braces").toBe(7);
    } finally {
      resetBraces();
    }
  });

  test("Survey: calculatedValues with same braces", () => {
    settings.expressionVariableDelimiters = { start: "%", end: "%" };
    try {
      var survey = new SurveyModel({
        calculatedValues: [
          { name: "sum", expression: "%q1% + %q2%" }
        ],
        elements: [
          { type: "text", name: "q1", inputType: "number" },
          { type: "text", name: "q2", inputType: "number" },
          { type: "expression", name: "q3", expression: "%sum%" }
        ]
      });
      survey.setValue("q1", 3);
      survey.setValue("q2", 4);
      expect(survey.getQuestionByName("q3").value, "calculated value with same braces").toBe(7);
    } finally {
      settings.expressionVariableDelimiters = { start: "{", end: "}" };
    }
  });
});
