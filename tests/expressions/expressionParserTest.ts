import {
  parse,
  SyntaxError,
  ParseFunction
} from "../../src/expressions/expressionParser";

import { ConditionRunner, ExpressionRunner } from "../../src/conditions";

import {
  Const,
  Variable,
  BinaryOperand,
  UnaryOperand
} from "../../src/expressions/expressions";

import { ProcessValue } from "../../src/conditionProcessValue";
import { FunctionFactory } from "../../src/functionsfactory";

export default QUnit.module("Expressions");

QUnit.test("Logic Operand", function(assert) {
  var expression = parse("true");
  assert.equal(expression.toString(), "true");
  assert.equal(expression.evaluate(), true);

  expression = parse("true || true && false");
  assert.equal(expression.evaluate(), true);

  expression = parse("false && true && false");
  assert.equal(expression.evaluate(), false);

  expression = parse("false || true || false || false || true || true");
  assert.equal(
    expression.toString(),
    "(((((false || true) || false) || false) || true) || true)"
  );
  assert.equal(expression.evaluate(), true);
});

QUnit.test("Comparable Operand", function(assert) {
  var expression = parse("1 = 1");
  assert.equal(expression.evaluate(), true);

  expression = parse("1 != 1");
  assert.equal(expression.evaluate(), false);

  expression = parse("false || 1 > -101");
  assert.equal(expression.toString(), "(false || (1 > -101))");
  assert.equal(expression.evaluate(), true);

  expression = parse("true && 5 <= 12 || !(5 > 2)");
  assert.equal(expression.toString(), "((true && (5 <= 12)) || !(5 > 2))");
  assert.equal(expression.evaluate(), true);
});

QUnit.test("Arithmetic Operand", function(assert) {
  var expression = parse("2 + 2 * 2");
  assert.equal(expression.evaluate(), 6);

  expression = parse("!(2 + 2 * 2 notequal 6)");
  assert.equal(expression.evaluate(), true);

  expression = parse("2 + 2 < 3 + 3 && 5 < 10");
  assert.equal(expression.toString(), "(((2 + 2) < (3 + 3)) && (5 < 10))");
  assert.equal(expression.evaluate(), true);
});

QUnit.test("Variable Const", function(assert) {
  var varOperand = parse("'Im-Variable'");
  assert.equal(varOperand.toString(), "Im-Variable");
  assert.equal(varOperand.evaluate(), "Im-Variable");

  var constOperand = parse("{ImConst}");
  assert.equal(constOperand.toString(), "{ImConst}");

  var processValue = new ProcessValue();
  processValue.values = { ImConst: 7 };
  assert.equal(constOperand.evaluate(processValue), 7);
});

function checkItemCondition(op: string, expectedOp: string): boolean {
  let expr = parse("'a'" + op + "2");
  return expr.operatorName === expectedOp;
}

QUnit.test("Parse item conditions", function(assert) {
  //equal
  assert.ok(checkItemCondition("=", "equal"), "= is equal");
  assert.ok(checkItemCondition("==", "equal"), "== is equal");
  assert.ok(checkItemCondition(" Equal ", "equal"), "equal is equal");
  //not equal
  assert.ok(checkItemCondition("<>", "notequal"), "<> is notequal");
  assert.ok(checkItemCondition("!=", "notequal"), "!= is notequal");
  assert.ok(
    checkItemCondition(" NotEqual ", "notequal"),
    "NotEqual is notequal"
  );
  //greater
  assert.ok(checkItemCondition(">", "greater"), "> is greater");
  assert.ok(checkItemCondition(" Greater ", "greater"), "Greater is greater");
  //less
  assert.ok(checkItemCondition("<", "less"), "< is less");
  assert.ok(checkItemCondition(" Less ", "less"), "Less is less");
  //greaterorequal
  assert.ok(checkItemCondition(">=", "greaterorequal"), ">= is greaterorequal");
  assert.ok(checkItemCondition("=>", "greaterorequal"), "=> is greaterorequal");
  assert.ok(
    checkItemCondition(" GreaterOrEqual ", "greaterorequal"),
    "GreaterorEqual is greaterorequal"
  );
  //lessorequal
  assert.ok(checkItemCondition("<=", "lessorequal"), "<= is lessorequal");
  assert.ok(checkItemCondition("=<", "lessorequal"), "=< is lessorequal");
  assert.ok(
    checkItemCondition(" LessOrEqual ", "lessorequal"),
    "LessOrEqual is lessorequal"
  );
  //contains
  assert.ok(
    checkItemCondition(" Contains ", "contains"),
    "Contains is contains"
  );
  assert.ok(checkItemCondition(" contain ", "contains"), "contain is contains");
  assert.ok(checkItemCondition("*=", "contains"), "*= is contains");
  //notcontains
  assert.ok(
    checkItemCondition(" NotContains ", "notcontains"),
    "NotContains is notcontains"
  );
  assert.ok(
    checkItemCondition(" NotContain ", "notcontains"),
    "NotContain is notcontains"
  );
});

QUnit.test("Condition: without right condition", function(assert) {
  assert.ok(parse("'a' empty"), "empty");
  assert.ok(parse("'a' notempty"), "notempty");

  assert.ok(parse("{row.user_id} notempty and {roles} notempty"));
});

QUnit.test("Condition: on item - no spaces", function(assert) {
  var expr = parse("5>2");
  assert.equal(expr.evaluate(), true);
});

QUnit.test("Run one condition", function(assert) {
  var runner = new ConditionRunner("{a} > 5");
  var values = { a: 6 };
  assert.equal(runner.run(values), true, "6 > 5");
  values = { a: 5 };
  assert.equal(runner.run(values), false, "5 > 5");
  var values2 = { b: 5 };
  assert.equal(runner.run(values2), false, "undefined > 5");
});

QUnit.test("Run complex condition", function(assert) {
  var runner = new ConditionRunner(
    "{age} >= 21 and ({sex} = 'male' or {kids} > 1)"
  );
  var values = { age: 21, sex: "male", kids: 1 };
  assert.equal(runner.run(values), true, "21 >= 21 and (male = male or 1 > 1)");
  var values = { age: 21, sex: "female", kids: 1 };
  assert.equal(
    runner.run(values),
    false,
    "21 >= 21 and (male = female or 1 > 1)"
  );
  var values = { age: 21, sex: "female", kids: 2 };
  assert.equal(
    runner.run(values),
    true,
    "21 >= 21 and (male = female or 2 > 1)"
  );
  var values = { age: 20, sex: "male", kids: 2 };
  assert.equal(
    runner.run(values),
    false,
    "20 >= 21 and (male = male or 2 > 1)"
  );
});

QUnit.test("Run condition with nested properties", function(assert) {
  var runner = new ConditionRunner("{age.min} >= 35 and ({age.max} <= 80");
  var values = { age: { min: 36, max: 40 } };
  assert.equal(runner.run(values), true, "min > 35 max < 80");
  values.age.min = 21;
  assert.equal(runner.run(values), false, "min < 35 max < 80");
});

QUnit.test("Condition check #303", function(assert) {
  var runner = new ConditionRunner(
    "({question-fruit} = 'fruit-apple' and {question-apple-variety} = 'apple-variety-red-delicious') or ({question-fruit} = 'fruit-orange' and {question-orange-variety} = 'orange-variety-blood')"
  );
  var values = {};
  assert.equal(runner.run(values), false, "nothing was set");
  values = {
    "question-fruit": "fruit-apple",
    "question-apple-variety": "apple-variety-red-delicious"
  };
  assert.equal(runner.run(values), true, "The first part is correct");
  values["question-fruit"] = "fruit-orange";
  assert.equal(runner.run(values), false, "the value is incorrect");
  values["question-orange-variety"] = "orange-variety-blood";
  assert.equal(runner.run(values), true, "The second part is correct");
});

QUnit.test("Condition check empty for undefined variables #323", function(
  assert
) {
  var runner = new ConditionRunner("{var1} empty");
  var values = {};
  assert.equal(runner.run(values), true, "it is empty");
  values = { var1: 1 };
  assert.equal(runner.run(values), false, "it is not empty");
});

QUnit.test("Condition check for undefined variables #323", function(assert) {
  var runner = new ConditionRunner("{var1} < 3 or {var1} empty");
  var values = {};
  assert.equal(runner.run(values), true, "empty should work");
  values = { var1: 1 };
  assert.equal(runner.run(values), true, "1 < 3");
  values = { var1: 5 };
  assert.equal(runner.run(values), false, "5 > 3");
});

QUnit.test("Check non equal, #377", function(assert) {
  var runner = new ConditionRunner("{var1} != 3");
  var values = {};
  assert.equal(runner.run(values), true, "empty should give true");
  values = { var1: 1 };
  assert.equal(runner.run(values), true, "1 != 3");
  values = { var1: 3 };
  assert.equal(runner.run(values), false, "3 == 3");
});

QUnit.test("Condition check for undefined #518", function(assert) {
  var runner = new ConditionRunner("{var1} == undefined");
  var values = {};
  assert.equal(runner.run(values), true, "undefined should work");
  values = { var1: undefined };
  assert.equal(runner.run(values), true, "undefined should work");
  values = { var1: "a" };
  assert.equal(runner.run(values), false, "string is not undefined");

  runner = new ConditionRunner("{var1} != undefined");
  values = {};
  assert.equal(runner.run(values), false, "undefined should work");
  values = { var1: undefined };
  assert.equal(runner.run(values), false, "undefined should work");
  values = { var1: "a" };
  assert.equal(runner.run(values), true, "string is not undefined");
});

QUnit.test("Run sum function", function(assert) {
  var runner = new ConditionRunner("sum({var1},{var2},{var3},{var4})");
  var values = { var1: 2, var2: 3, var3: 4, var4: 5 };
  assert.equal(runner.run(values), 14, "2 + 3 + 4 + 5 == 14");
  values.var1 = 1;
  assert.equal(runner.run(values), 13, "1 + 3 + 4 + 5 == 13");
});

QUnit.test("Run age function", function(assert) {
  var runner = new ConditionRunner("age({bithday}) >= 21");
  var values = { bithday: new Date(1974, 1, 1) };
  assert.equal(runner.run(values), true, "true, bithday of 1974 >= 21");
  var curDate = new Date(Date.now());
  values.bithday = new Date(curDate.getFullYear() - 10, 1, 1);
  assert.equal(runner.run(values), false, "false, the person is 10 years old");
});

QUnit.test("Run age function with empty value", function(assert) {
  var runner = new ConditionRunner("age({bithday}) >= 21");
  var runner2 = new ConditionRunner("age({bithday}) < 21");
  var values = {};
  assert.equal(runner.run(values), false, "1. false, bithday is empty");
  assert.equal(runner2.run(values), false, "2. false, bithday is empty");
});

QUnit.test("Run function with properties", function(assert) {
  function isEqual(params: any[]): any {
    return this.propValue == params[0];
  }
  FunctionFactory.Instance.register("isEqual", isEqual);

  var runner = new ConditionRunner("isEqual({val}) == true");
  var values = { val: 3 };
  var properties = { propValue: 3 };
  assert.equal(runner.run(values, properties), true, "3 = 3");
  properties.propValue = 5;
  assert.equal(runner.run(values, properties), false, "3 != 5");
  FunctionFactory.Instance.unregister("isEqual");
});

QUnit.test("Support true/false constants, #643", function(assert) {
  var runner = new ConditionRunner("true && {year} >= 21");
  var values = { year: 22 };
  assert.equal(runner.run(values), true, "true, true && 22 >= 21");
  values = { year: 20 };
  assert.equal(runner.run(values), false, "false, true && 20 >= 21");

  runner = new ConditionRunner("true or {year} >= 21");
  values = { year: 22 };
  assert.equal(runner.run(values), true, "true, true or 22 >= 21");
  values = { year: 20 };
  assert.equal(runner.run(values), true, "true, true or 20 >= 21");

  runner = new ConditionRunner("false && {year} >= 21");
  values = { year: 22 };
  assert.equal(runner.run(values), false, "false, false && 22 >= 21");
  values = { year: 20 };
  assert.equal(runner.run(values), false, "false, false && 20 >= 21");

  runner = new ConditionRunner("false or {year} >= 21");
  values = { year: 22 };
  assert.equal(runner.run(values), true, "true, false or 22 >= 21");
  values = { year: 20 };
  assert.equal(runner.run(values), false, "false, false or 20 >= 21");
});

QUnit.test("true/false as string, bug#729", function(assert) {
  var runner = new ConditionRunner("{isTrue} = 'true'");
  var values = { isTrue: "true" };
  assert.equal(runner.run(values), true, "true, 'true' = 'true'");
});

QUnit.test("true/false as constant in the left", function(assert) {
  var runner = new ConditionRunner("true = {isTrue}");
  var values = { isTrue: "false" };
  assert.equal(runner.run(values), false, "false, true = false");
});

QUnit.test("Constant string with dash (-) doens't work correctly", function(
  assert
) {
  var runner = new ConditionRunner("{a} = '01-01-2018'");
  var values = { a: "01-01" };
  assert.equal(runner.run(values), false, "'01-01' = '01-01-2018'");
  values.a = "01-01-2018";
  assert.equal(runner.run(values), true, "'01-01-2018' = '01-01-2018'");
});

QUnit.test("Bug with contains, bug#781", function(assert) {
  var runner = new ConditionRunner("{ResultaatSelectie} contains '1'");
  var values = { ResultaatSelectie: ["1"] };
  assert.equal(runner.run(values), true, "['1'] contains '1'");
  values = { ResultaatSelectie: ["2"] };
  assert.equal(runner.run(values), false, "['2'] contains '1'");
});

QUnit.test("0 is not an empty value", function(assert) {
  var runner = new ConditionRunner("{val} = 0");
  var values = { val: 0 };
  assert.equal(runner.run(values), true, "0 = 0");
});

QUnit.test("Bug with contains, support string.indexof, bug#831", function(
  assert
) {
  var runner = new ConditionRunner("{str} contains '1'");
  var values = { str: "12345" };
  assert.equal(runner.run(values), true, "'12345' contains '1'");
  values = { str: "2345" };
  assert.equal(runner.run(values), false, "'2345' contains '1'");
  runner = new ConditionRunner("{str} notcontains '1'");
  assert.equal(runner.run(values), true, "'2345' notcontains '1'");
  values = { str: "12345" };
  assert.equal(runner.run(values), false, "'12345' notcontains '1'");
});

QUnit.test("Bug with contains, bug#1039", function(assert) {
  var runner = new ConditionRunner("{ValueType} contains '3b'");
  var values = { ValueType: ["3b"] };
  assert.equal(runner.run(values), true, "['3b'] contains '3b'");
  values = { ValueType: ["1"] };
  assert.equal(runner.run(values), false, "['1'] contains '3b'");
});

QUnit.test("Add support for array for cotains operator, issue#1366", function(
  assert
) {
  var runner = new ConditionRunner("{value} contains ['a', 'b']");
  var values = { value: ["a", "b"] };
  assert.equal(runner.run(values), true, "['a', 'b'] contains ['a', 'b']");
  values = { value: ["a", "c"] };
  assert.equal(runner.run(values), false, "['a', 'c'] contains ['a', 'b']");
  values = { value: ["a", "b", "c"] };
  assert.equal(runner.run(values), true, "['a', 'b', 'c'] contains ['a', 'b']");
});

QUnit.test("Escape quotes, bug#786", function(assert) {
  var runner = new ConditionRunner("{text} = 'I\\'m here'");
  var values = { text: "I'm here" };
  assert.equal(runner.run(values), true, "text equals I'm here");

  var runner = new ConditionRunner(
    "'I said: \\\"I\\'m here\\\"' contains {text}"
  );
  var values = { text: "I'm here" };
  assert.equal(runner.run(values), true, "I said contains text");
});

QUnit.test("Support equals and notequals, #781", function(assert) {
  var runner = new ConditionRunner("{a} equals 1");
  var values = { a: 1 };
  assert.equal(runner.run(values), true, "1 equals 1");
  values = { a: 2 };
  assert.equal(runner.run(values), false, "2 equals 1");
});
QUnit.test("Allow differnt symbols in variable name, bug#803", function(
  assert
) {
  var runner = new ConditionRunner("{complex name #$%?dd} = 1");
  var values = { "complex name #$%?dd": 1 };
  assert.equal(runner.run(values), true, "1= 1");
  values = { "complex name #$%?dd": 2 };
  assert.equal(runner.run(values), false, "2 <> 1");
});

QUnit.test("Support array", function(assert) {
  var runner = new ConditionRunner("{a} equals [1, 2]");
  var values = { a: [1, 2] };
  assert.equal(runner.run(values), true, "[1, 2] equals [1, 2]");
  values = { a: [2] };
  assert.equal(runner.run(values), false, "[2] equals [1, 2]");
  values = { a: [2, 1] };
  assert.equal(runner.run(values), true, "[2, 1] equals [1, 2]");
});

QUnit.test("ExpressionOperand: Simple expression", function(assert) {
  var runner = new ConditionRunner("{a} - 1 > 5");
  var values = { a: 7 };
  assert.equal(runner.run(values), true, "6 > 5");
  values = { a: 6 };
  assert.equal(runner.run(values), false, "5 > 5");
});

QUnit.test("ExpressionOperand: brackets", function(assert) {
  var runner = new ConditionRunner("({a} + {b}) * 2 >= 10");
  var values = { a: 1, b: 3 };
  assert.equal(runner.run(values), false, "(1 + 3) * 2 >= 10");
});

QUnit.test("ExpressionOperand: brackets 2", function(assert) {
  var runner = new ConditionRunner("({a} + {b} + {c}) / 3 >= 3");
  var values = { a: 1, b: 3, c: 2 };
  assert.equal(runner.run(values), false, "(1 + 3 + 2) / 3 >= 3");
  values.c = 5;
  assert.equal(runner.run(values), true, "(1 + 3 + 4) / 3 >= 3");
});

QUnit.test("ConditionRunner: (1+2)*3", function(assert) {
  var runner = new ConditionRunner("(1+2)*3");
  assert.equal(runner.run({}), 9, "(1+2)*3 is 9");
});

QUnit.test("ConditionRunner: (1+2)*(3+2) / 5", function(assert) {
  var runner = new ConditionRunner("(1+2)*(3+2) / 5");
  assert.equal(runner.run({}), 3, "(1+2)*(3+2) / 5 is 3");
});

QUnit.test("ConditionRunner: 10 % 3", function(assert) {
  var runner = new ConditionRunner("10 % 3");
  assert.equal(runner.run({}), 1, "10 % 3 is 1");
});

QUnit.test("ExpressionRunner: sumInArray", function(assert) {
  var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
  var values = { a: [{ val1: 10 }, { val2: 10 }, { val1: 20 }] };
  assert.equal(runner.run(values), 30, "10 + 20");
  values = { a: [{ val2: 1 }] };
  assert.equal(runner.run(values), 0, "There is no values");
});

QUnit.test("ExpressionRunner: sumInArray, for objects", function(assert) {
  var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
  var values = {
    a: { row1: { val1: 10 }, row2: { val2: 10 }, row3: { val1: 20 } }
  };
  assert.equal(runner.run(values), 30, "10 + 20");
});

QUnit.test("ExpressionRunner: countInArray", function(assert) {
  var runner = new ExpressionRunner("countInArray({a}, 'val1')");
  var values = { a: [{ val1: 10 }, { val2: 10 }, { val1: 20 }] };
  assert.equal(runner.run(values), 2, "10 + 20");
  values = { a: [{ val2: 1 }] };
  assert.equal(runner.run(values), 0, "There is no values");
  var emptyValue = { a: {} };
  assert.equal(runner.run(emptyValue), 0, "object is empty");
});

QUnit.test("ConditionRunner, iif simple", function(assert) {
  var runner = new ConditionRunner("iif({a}, 'high', 'low')");
  var values = { a: true };
  assert.equal(runner.run(values), "high", "true");
  values.a = false;
  assert.equal(runner.run(values), "low", "false");
});

QUnit.test("ConditionRunner, iif with expression", function(assert) {
  var runner = new ConditionRunner("iif({a} + {b} > 20, 'high', 'low')");
  var values = { a: 10, b: 20 };
  assert.equal(runner.run(values), "high", "10 + 20 > 20");
  values.b = 5;
  assert.equal(runner.run(values), "low", "10 + 5 < 20");
});

QUnit.test("ConditionRunner, iif nested using", function(assert) {
  var runner = new ConditionRunner(
    "iif({a} + {b} > 20, 'high', iif({a} + {b} > 10, 'medium', 'low'))"
  );
  var values = { a: 10, b: 20 };
  assert.equal(runner.run(values), "high", "10 + 20 > 20");
  values.b = 5;
  assert.equal(runner.run(values), "medium", "10 + 5 > 10 && 10 + 5 < 20");
  values.a = 1;
  assert.equal(runner.run(values), "low", "1 + 5 < 10");
});

QUnit.test("ConditionRunner, iif nested using 2", function(assert) {
  var runner = new ConditionRunner(
    "iif(({a} + {b}) > 20, ({a} * 5 + {b}), iif({a} + {b} > 10, 5*({a}+ {b}), {a}))"
  );
  var values = { a: 10, b: 20 };
  assert.equal(runner.run(values), 10 * 5 + 20, "10 + 20 > 20");
  values.b = 5;
  assert.equal(runner.run(values), 5 * (10 + 5), "10 + 5 > 10 && 10 + 5 < 20");
  values.a = 1;
  assert.equal(runner.run(values), 1, "1 + 5 < 10");
});

function avg(params: any[]): any {
  var res = 0;
  for (var i = 0; i < params.length; i++) {
    res += params[i];
  }
  return params.length > 0 ? res / params.length : 0;
}

QUnit.test(
  "ConditionRunner, iif nested using with function, Bug T1302, (https://surveyjs.answerdesk.io/ticket/details/T1302)",
  function(assert) {
    function incValue(params: any[]): any {
      return params[0] + 1;
    }
    FunctionFactory.Instance.register("incValue", incValue);

    var runner = new ConditionRunner(
      'incValue(iif(({REVIEW_COVER} contains "REVIEW_SM") and ({REVIEW_COVER} contains "REVIEW_GL"), ({RATES_PROPERTY_SD}+{RATES_LIABILITY_SD}+{RATES_SEXUAL_MOL_END_SD}), iif(({REVIEW_COVER} notcontains "REVIEW_SM") and ({REVIEW_COVER} contains "REVIEW_GL"), ({RATES_PROPERTY_SD}+{RATES_LIABILITY_SD}), ({RATES_PROPERTY_SD}))))'
    );
    var values = {
      REVIEW_COVER: ["REVIEW_SM", "REVIEW_GL"],
      RATES_PROPERTY_SD: 1,
      RATES_LIABILITY_SD: 2,
      RATES_SEXUAL_MOL_END_SD: 3
    };
    assert.equal(
      runner.run(values),
      1 + 2 + 3 + 1,
      "the first condition is calling"
    );
    FunctionFactory.Instance.unregister("incValue");
  }
);

QUnit.test("ConditionRunner, ^ operator", function(assert) {
  var runner = new ConditionRunner("{a} ^ 3 + {b} ^ 0.5");
  var values = { a: 10, b: 400 };
  assert.equal(runner.run(values), 1020, "10^3 + 400^0.5 = 1000 + 20");
});

QUnit.test("Variable may have '-' and '+' in their names", function(assert) {
  var runner = new ConditionRunner("{2-3+4} = 1");
  var values = { "2-3+4": 1 };
  assert.equal(runner.run(values), true, "1 = 1");
  values = { "2-3+4": 2 };
  assert.equal(runner.run(values), false, "2 != 1");
});

QUnit.test("Variable equals 0x1 works incorrectly, Bug#1180", function(assert) {
  var runner = new ConditionRunner("{val} notempty");
  var values = { val: "0x1" };
  assert.equal(runner.run(values), true, "0x1 is not empty");

  runner = new ConditionRunner("{val} = 2");
  values = { val: "0x1" };
  assert.equal(runner.run(values), false, "0x1 is not 2");
  values = { val: "0x2" };
  assert.equal(runner.run(values), true, "0x2 is not 2");
});

QUnit.test("contain and noncontain for null arrays", function(assert) {
  var runner = new ConditionRunner("{val} contain 1");
  var values = {};
  assert.equal(
    runner.run(values),
    false,
    "underfined doesn't contain 1 - false"
  );
  runner = new ConditionRunner("{val} notcontain 1");
  values = {};
  assert.equal(runner.run(values), true, "underfined doesn't contain 1 - true");
});

QUnit.test("length for undefined arrays", function(assert) {
  var runner = new ConditionRunner("{val.length} = 0");
  assert.equal(runner.run({ val: [] }), true, "empty array length returns 0");
  assert.equal(runner.run({}), true, "underfined length returns 0");
});

QUnit.test("contain and noncontain for strings", function(assert) {
  var runner = new ConditionRunner("{val} contain 'ab'");
  var values = {};
  assert.equal(
    runner.run(values),
    false,
    "contains: underfined doesn't contain 'ab' - false"
  );
  values = { val: "ba" };
  assert.equal(
    runner.run(values),
    false,
    "contains: 'ba' doesn't contain 'ab' - false"
  );
  values = { val: "babc" };
  assert.equal(
    runner.run(values),
    true,
    "contains: 'babc' contains 'ab' - true"
  );

  runner = new ConditionRunner("{val} notcontain 'ab'");
  values = {};
  assert.equal(
    runner.run(values),
    true,
    "notcontains: underfined doesn't contain 'ab' - true"
  );
  values = { val: "ba" };
  assert.equal(
    runner.run(values),
    true,
    "notcontains: 'ba' doesn't contain 'ab' - true"
  );
  values = { val: "babc" };
  assert.equal(
    runner.run(values),
    false,
    "notcontains: 'babc' contains 'ab' - false"
  );
});

QUnit.test(
  "ConditionRunner: 7 * (({q1} * 0.4) + ({q2} * 0.6)), bug# 1423",
  function(assert) {
    var runner = new ConditionRunner("7 * ((10 * 0.4) + (20 * 0.6))");
    assert.equal(
      runner.run({}),
      7 * (4 + 12),
      "7 * ((10 * 0.4) + (20 * 0.6)) is 112"
    );
  }
);

QUnit.test("0x digits", function(assert) {
  var runner = new ConditionRunner("0x1 + 0x2 + {x}");
  var values = { x: 0x3 };
  assert.equal(runner.run(values), 6, "0x: 1 + 2 + 3 equal 6");
});

QUnit.test("dont fault in invalid input", function(assert) {
  var condRunner = new ConditionRunner("2 @ 2");
  assert.notOk(condRunner.canRun());

  var exprRunner = new ExpressionRunner("00101 @@ 0101");
  assert.notOk(exprRunner.canRun());
});

QUnit.test("Get variables in expression", function(assert) {
  var runner = new ConditionRunner(
    "{val1} - {val2} + myFunc({val3}, {val4.prop}) < {val5} and {val6}=1"
  );
  var vars = runner.getVariables();
  assert.equal(vars.length, 6, "There are 6 variables in expression");
  assert.equal(vars[0], "val1", "the first variable");
  assert.equal(vars[5], "val6", "the last variable");
});
