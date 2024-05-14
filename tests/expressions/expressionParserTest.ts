import { parse } from "../../src/expressions/expressionParser";
import { ConditionRunner, ExpressionRunner } from "../../src/conditions";
import { ConditionsParser } from "../../src/conditionsParser";
import { ConsoleWarnings } from "../../src/console-warnings";
import {
  Const,
  Variable,
  BinaryOperand,
  UnaryOperand,
  Operand,
} from "../../src/expressions/expressions";

import { ProcessValue } from "../../src/conditionProcessValue";
import { FunctionFactory } from "../../src/functionsfactory";
import { values } from "lodash";
import { settings } from "../../src/settings";
import { Helpers } from "../../src/helpers";

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
    "(((((false or true) or false) or false) or true) or true)"
  );
  assert.equal(expression.evaluate(), true);
});

QUnit.test("Comparable Operand", function(assert) {
  var expression = parse("1 = 1");
  assert.equal(expression.evaluate(), true);

  expression = parse("1 != 1");
  assert.equal(expression.evaluate(), false);

  expression = parse("false || 1 > -101");
  assert.equal(expression.toString(), "(false or (1 > -101))");
  assert.equal(expression.evaluate(), true);

  expression = parse("true && 5 <= 12 || !(5 > 2)");
  assert.equal(expression.toString(), "((true and (5 <= 12)) or ! (5 > 2))");
  assert.equal(expression.evaluate(), true);
});

QUnit.test("Arithmetic Operand", function(assert) {
  var expression = parse("2 + 2 * 2");
  assert.equal(expression.evaluate(), 6);

  expression = parse("!(2 + 2 * 2 notequal 6)");
  assert.equal(expression.evaluate(), true);

  expression = parse("2 + 2 < 3 + 3 && 5 < 10");
  assert.equal(expression.toString(), "(((2 + 2) < (3 + 3)) and (5 < 10))");
  assert.equal(expression.evaluate(), true);
});

QUnit.test("Concat strings", function(assert) {
  var expression = parse("'ab' + 'cd'");
  assert.equal(expression.evaluate(), "abcd");
  expression = parse("'ab' + ' ' + 'cd'");
  assert.equal(expression.evaluate(), "ab cd");
  expression = parse("1 + 'a' + 2");
  assert.equal(expression.evaluate(), "1a2");
  expression = parse("1 + ' ' + 2");
  assert.equal(expression.evaluate(), "1 2");
  expression = parse('"p1. " + "p2"');
  assert.equal(expression.evaluate(), "p1. p2");
});

QUnit.test("Variable Const", function(assert) {
  var varOperand = parse("'Im-Variable'");
  assert.equal(varOperand.toString(), "'Im-Variable'");
  assert.equal(varOperand.evaluate(), "Im-Variable");

  var constOperand = parse("{ImConst}");
  assert.equal(constOperand.toString(), "{ImConst}");

  var processValue = new ProcessValue();
  processValue.values = { ImConst: 7 };
  assert.equal(constOperand.evaluate(processValue), 7);
});

function checkItemCondition(op: string, expectedOp: string): boolean {
  let expr = new ConditionsParser().createCondition("'a'" + op + "2");
  return (<any>expr).operatorName === expectedOp;
}

QUnit.test("Parse item conditions", function(assert) {
  //equal
  assert.ok(checkItemCondition("=", "equal"), "= is equal");
  assert.ok(checkItemCondition("==", "equal"), "== is equal");
  assert.ok(checkItemCondition(" Equal ", "equal"), "equal is equal");
  assert.ok(checkItemCondition(" equals ", "equal"), "equals is equal");
  //not equal
  assert.ok(checkItemCondition("<>", "notequal"), "<> is notequal");
  assert.ok(checkItemCondition("!=", "notequal"), "!= is notequal");
  assert.ok(
    checkItemCondition(" notequals ", "notequal"),
    "notequals is notequal"
  );
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
    "question-apple-variety": "apple-variety-red-delicious",
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
QUnit.test("Run count function with arrays", function(assert) {
  var runner = new ExpressionRunner("count({var1})");
  var values = { var1: [2, 5], var2: 3 };
  assert.equal(runner.run(values), 2, "two rows");
});

QUnit.test("Run sum function", function(assert) {
  var runner = new ExpressionRunner("sum({var1},{var2},{var3},{var4})");
  var values = { var1: 2, var2: 3, var3: 4, var4: 5 };
  assert.equal(runner.run(values), 14, "2 + 3 + 4 + 5 == 14");
  values.var1 = 1;
  assert.equal(runner.run(values), 13, "1 + 3 + 4 + 5 == 13");
});

QUnit.test("Run sum function with arrays, Bug #1808", function(assert) {
  var runner = new ExpressionRunner("sum({var1},{var2})");
  var values = { var1: [2, 5], var2: 3 };
  assert.equal(runner.run(values), 10, "2 + 5 + 3 == 10");
});
QUnit.test(
  "Run sum function with arrays, convert values from string to value",
  function(assert) {
    var runner = new ExpressionRunner("sum({var1},{var2})");
    var values = { var1: ["2", "5"], var2: 3 };
    assert.equal(runner.run(values), 10, "2 + 5 + 3 == 10");
  }
);

QUnit.test("Run min function", function(assert) {
  var runner = new ExpressionRunner("min({var1},{var2})");
  var values = { var1: [4, 2, 5], var2: 3 };
  assert.equal(runner.run(values), 2, "4, 2, 5, 3, min is 2");
});

QUnit.test("Run max function", function(assert) {
  var runner = new ExpressionRunner("max({var1},{var2})");
  var values = { var1: [4, 2, 5, 3], var2: 3 };
  assert.equal(runner.run(values), 5, "4, 2, 5, 3, max is 5");
});

QUnit.test("Run min/max functions with zeros, Bug #2229", function(assert) {
  var runner = new ExpressionRunner("min({var1},{var2})");
  var values = { var1: 0, var2: 3 };
  assert.equal(runner.run(values), 0, "0, 3, min is 0");
  runner = new ExpressionRunner("max({var1},{var2})");
  values = { var1: 0, var2: -3 };
  assert.equal(runner.run(values), 0, "0, -3, max is 0");
});

QUnit.test("Run age function", function(assert) {
  var runner = new ConditionRunner("age({bithday}) >= 21");
  var values = { bithday: new Date(1974, 1, 1) };
  assert.equal(runner.run(values), true, "true, bithday of 1974 >= 21");
  var curDate = new Date(Date.now());
  values.bithday = new Date(curDate.getFullYear() - 10, 1, 1);
  assert.equal(runner.run(values), false, "false, the person is 10 years old");
});
QUnit.test("Run age function, Bug#2562", function(assert) {
  var runner = new ExpressionRunner("age({birthday})");
  var values = { birthday: new Date(1974, 1, 1) };
  var date = new Date(Date.now());
  date.setFullYear(date.getFullYear() - 80);
  values = { birthday: date };
  assert.equal(runner.run(values), 80, "80 years old, bithday is today");
  date = new Date(date.getTime() + 60 * 60 * 24 * 1000);
  values.birthday = date;
  assert.equal(runner.run(values), 79, "one day till 80");
});

QUnit.test("Run getYear() function", function(assert) {
  var runner = new ExpressionRunner("getYear({birthday})");
  var values = { birthday: new Date(1974, 1, 1) };
  assert.equal(runner.run(values), 1974);
});

QUnit.test("Run currentYear() function", function(assert) {
  var runner = new ExpressionRunner("currentYear()");
  assert.equal(runner.run({}), new Date().getFullYear());
});
function getDateStr(date: Date): string {
  return Helpers.convertDateToString(date);
}
QUnit.test("Run today function", function(assert) {
  var runner = new ExpressionRunner("today()");
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  var todayStr = getDateStr(date).slice(0, 10);
  const runVal = runner.run({});
  assert.equal(getDateStr(runVal), todayStr, "check today");
});

QUnit.test("Compare date with today", function(assert) {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const yearsterDay = new Date();
  yearsterDay.setDate(yearsterDay.getDate() - 1);
  yearsterDay.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  var condition = new ConditionRunner("{d} < today()");
  const val = { d: yearsterDay };
  assert.equal(condition.run(val), true, "yesterday < today");
  val.d = todayDate;
  assert.equal(condition.run(val), false, "todayDate < today");
  assert.equal(condition.run(val), false, "tomorrow < today");

  condition = new ConditionRunner("{d} <= today()");
  val.d = yearsterDay;
  assert.equal(condition.run(val), true, "yesterday <= today");
  val.d = todayDate;
  assert.equal(condition.run(val), true, "todayDate <= today");
  val.d = tomorrow;
  assert.equal(condition.run(val), false, "tomorrow <= today");

  condition = new ConditionRunner("{d} >= today()");
  val.d = yearsterDay;
  assert.equal(condition.run(val), false, "yesterday >= today");
  val.d = todayDate;
  assert.equal(condition.run(val), true, "todayDate >= today");
  val.d = tomorrow;
  assert.equal(condition.run(val), true, "tomorrow >= today");

  condition = new ConditionRunner("{d} > today()");
  val.d = yearsterDay;
  assert.equal(condition.run(val), false, "yesterday > today");
  val.d = todayDate;
  assert.equal(condition.run(val), false, "todayDate > today");
  val.d = tomorrow;
  assert.equal(condition.run(val), true, "tomorrow > today");
});

QUnit.test("Compare date with today, settings.useLocalTimeZone = false", function(assert) {
  settings.useLocalTimeZone = false;
  const todayDate = new Date();
  todayDate.setUTCHours(0, 0, 0, 0);
  const yearsterDay = new Date();
  yearsterDay.setDate(yearsterDay.getDate() - 1);
  yearsterDay.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  var condition = new ConditionRunner("{d} < today()");
  const val = { d: yearsterDay };
  assert.equal(condition.run(val), true, "yesterday < today");
  val.d = todayDate;
  assert.equal(condition.run(val), false, "todayDate < today");
  assert.equal(condition.run(val), false, "tomorrow < today");

  condition = new ConditionRunner("{d} <= today()");
  val.d = yearsterDay;
  assert.equal(condition.run(val), true, "yesterday <= today");
  val.d = todayDate;
  assert.equal(condition.run(val), true, "todayDate <= today");
  val.d = tomorrow;
  assert.equal(condition.run(val), false, "tomorrow <= today");

  condition = new ConditionRunner("{d} >= today()");
  val.d = yearsterDay;
  assert.equal(condition.run(val), false, "yesterday >= today");
  val.d = todayDate;
  assert.equal(condition.run(val), true, "todayDate >= today");
  val.d = tomorrow;
  assert.equal(condition.run(val), true, "tomorrow >= today");

  condition = new ConditionRunner("{d} > today()");
  val.d = yearsterDay;
  assert.equal(condition.run(val), false, "yesterday > today");
  val.d = todayDate;
  assert.equal(condition.run(val), false, "todayDate > today");
  val.d = tomorrow;
  assert.equal(condition.run(val), true, "tomorrow > today");
  settings.useLocalTimeZone = true;
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

QUnit.test("Check contains with empty array, Bug #2193", function(assert) {
  var runner = new ConditionRunner("[] contains 'C1'");
  assert.equal(runner.run({}), false, "[] doesn't contain 'C1'");
  var parser = new ConditionsParser();
  var operand = parser.parseExpression("[] contains 'C1'");
  assert.ok(operand, "The expression parse correctly");
});

QUnit.test("contains as equal", function(assert) {
  var runner = new ConditionRunner("{val} contains 'value'");
  var values = { val: "value" };
  assert.equal(runner.run(values), true, "'value' contains 'value'");
});

QUnit.test("contains for complex object", function(assert) {
  var runner = new ConditionRunner("{val} contains {item}");
  var values = { val: [{ id: 1 }, { id: 2 }], item: { id: 1 } };
  assert.equal(runner.run(values), true, "works with compelx object");
});

QUnit.test("0 is not an empty value", function(assert) {
  var runner = new ConditionRunner("{val} = 0");
  var values = { val: 0 };
  assert.equal(runner.run(values), true, "0 = 0");
});
QUnit.test(
  "0 is not an empty value (variable with complex identifier). Bug T2441 (https://surveyjs.answerdesk.io/internal/ticket/details/T2441)",
  function(assert) {
    var runner = new ConditionRunner("{complexIdentifier} = 0");
    var values = { complexIdentifier: 0 };
    assert.equal(runner.run(values), true, "0 = 0");
  }
);
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
  var runner = new ExpressionRunner("(1+2)*3");
  assert.equal(runner.run({}), 9, "(1+2)*3 is 9");
});

QUnit.test("ConditionRunner: (1+2)*(3+2) / 5", function(assert) {
  var runner = new ExpressionRunner("(1+2)*(3+2) / 5");
  assert.equal(runner.run({}), 3, "(1+2)*(3+2) / 5 is 3");
});

QUnit.test("ConditionRunner: 10 % 3", function(assert) {
  var runner = new ExpressionRunner("10 % 3");
  assert.equal(runner.run({}), 1, "10 % 3 is 1");
  var condition = new ConditionRunner("({val1} + {val2}) % 2 = 0");
  assert.equal(condition.run({ val1: 1, val2: 3 }), true, "(1+3)%2=0");
  assert.equal(condition.run({ val1: 2, val2: 3 }), false, "(2+3)%2=0");
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
    a: { row1: { val1: 10 }, row2: { val2: 10 }, row3: { val1: 20 } },
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
QUnit.test("ExpressionRunner: countInArray, value as string", function(assert) {
  var runner = new ExpressionRunner("countInArray({a}, 'val1')");
  var values = { a: [{ val1: "abc" }, { val2: 10 }, { val1: "cde" }] };
  assert.equal(runner.run(values), 2, "two items in array");
});

QUnit.test("ConditionRunner, iif simple", function(assert) {
  var runner = new ExpressionRunner("iif({a}, 'high', 'low')");
  var values = { a: true };
  assert.equal(runner.run(values), "high", "true");
  values.a = false;
  assert.equal(runner.run(values), "low", "false");
});

QUnit.test("ExpressionRunner, iif with expression", function(assert) {
  var runner = new ExpressionRunner("iif({a} + {b} > 20, 'high', 'low')");
  var values = { a: 10, b: 20 };
  assert.equal(runner.run(values), "high", "10 + 20 > 20");
  values.b = 5;
  assert.equal(runner.run(values), "low", "10 + 5 < 20");
});

QUnit.test("ConditionRunner, iif nested using", function(assert) {
  var runner = new ExpressionRunner(
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
  var runner = new ExpressionRunner(
    "iif(({a} + {b}) > 20, ({a} * 5 + {b}), iif({a} + {b} > 10, 5*({a}+ {b}), {a}))"
  );
  var values = { a: 10, b: 20 };
  assert.equal(runner.run(values), 10 * 5 + 20, "10 + 20 > 20");
  values.b = 5;
  assert.equal(runner.run(values), 5 * (10 + 5), "10 + 5 > 10 && 10 + 5 < 20");
  values.a = 1;
  assert.equal(runner.run(values), 1, "1 + 5 < 10");
});

QUnit.test("ConditionRunner, iif with empty parameter, Bug#2732", function(
  assert
) {
  var runner = new ExpressionRunner("iif({a}, 'yes', '')");
  var values = { a: true };
  assert.equal(runner.run(values), "yes", "true");
  values.a = false;
  assert.equal(runner.run(values), "", "false");
});

QUnit.test("parse iif with empty parameter, Bug#2732", function(assert) {
  var expression = parse("iif(1, 'yes', '')");
  assert.ok(expression, "Expression parse correctly");
  expression = parse('iif(1, "yes", "")');
  assert.ok(expression, "Expression parse correctly, #2");
});

QUnit.test(
  "ConditionRunner, iif nested using with function, Bug T1302, (https://surveyjs.answerdesk.io/ticket/details/T1302)",
  function(assert) {
    function incValue(params: any[]): any {
      return params[0] + 1;
    }
    FunctionFactory.Instance.register("incValue", incValue);

    var runner = new ExpressionRunner(
      'incValue(iif(({REVIEW_COVER} contains "REVIEW_SM") and ({REVIEW_COVER} contains "REVIEW_GL"), ({RATES_PROPERTY_SD}+{RATES_LIABILITY_SD}+{RATES_SEXUAL_MOL_END_SD}), iif(({REVIEW_COVER} notcontains "REVIEW_SM") and ({REVIEW_COVER} contains "REVIEW_GL"), ({RATES_PROPERTY_SD}+{RATES_LIABILITY_SD}), ({RATES_PROPERTY_SD}))))'
    );
    var values = {
      REVIEW_COVER: ["REVIEW_SM", "REVIEW_GL"],
      RATES_PROPERTY_SD: 1,
      RATES_LIABILITY_SD: 2,
      RATES_SEXUAL_MOL_END_SD: 3,
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
  var runner = new ExpressionRunner("{a} ^ 3 + {b} ^ 0.5");
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

QUnit.test("notempty with 0 and false, bug#1792", function(assert) {
  var runner = new ConditionRunner("{val} notempty");
  var values: any = { val: 0 };
  assert.equal(runner.run(values), true, "0 is not empty");
  values.val = "0";
  assert.equal(runner.run(values), true, "'0' is not empty");
  values.val = false;
  assert.equal(runner.run(values), true, "false is not empty");
});

QUnit.test("contain and noncontain for null arrays", function(assert) {
  var runner = new ConditionRunner("{val} contain 1");
  var values = {};
  assert.equal(
    runner.run(values),
    false,
    "undefined doesn't contain 1 - false"
  );
  runner = new ConditionRunner("{val} notcontain 1");
  values = {};
  assert.equal(runner.run(values), true, "undefined doesn't contain 1 - true");
});

QUnit.test("length for undefined arrays", function(assert) {
  var runner = new ConditionRunner("{val.length} > 1");
  assert.equal(runner.run({ val: [] }), false, "empty array length returns 0");
  assert.equal(runner.run({ val: [1] }), false, "array length returns 1");
  assert.equal(runner.run({ val: [1, 2] }), true, "array length returns 2");
  assert.equal(runner.run({ val: [1, 2, 3] }), true, "array length returns 3");
});

QUnit.test("length for undefined arrays", function(assert) {
  var runner = new ConditionRunner("{val.length} = 0");
  assert.equal(runner.run({ val: [] }), true, "empty array length returns 0");
  assert.equal(runner.run({}), true, "undefined length returns 0");
  assert.equal(
    runner.run({ val: undefined }),
    true,
    "undefined length returns 0"
  );
  assert.equal(runner.run({ val: null }), true, "null length returns 0");
  runner = new ConditionRunner("{val.length} < 4");
  assert.equal(runner.run({ val: [] }), true, "empty array length < 4");
  assert.equal(runner.run({}), true, "undefined length < 4");
  assert.equal(runner.run({ val: undefined }), true, "undefined length  < 4");
  assert.equal(runner.run({ val: null }), true, "null length  < 4");
});

QUnit.test("length for arrays that becomes undefined, Bug#2432", function(
  assert
) {
  var runner = new ConditionRunner("{val.length} < 3");
  var data = { val: [1, 2] };

  assert.equal(runner.run(data), true, "[1,2].length < 3");
  data.val = undefined;
  assert.equal(runner.run(data), true, "undefined.length < 3");
});

QUnit.test("contain and noncontain for strings", function(assert) {
  var runner = new ConditionRunner("{val} contain 'ab'");
  var values = {};
  assert.equal(
    runner.run(values),
    false,
    "contains: undefined doesn't contain 'ab' - false"
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
    "notcontains: undefined doesn't contain 'ab' - true"
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
    var runner = new ExpressionRunner("7 * ((10 * 0.4) + (20 * 0.6))");
    assert.equal(
      runner.run({}),
      7 * (4 + 12),
      "7 * ((10 * 0.4) + (20 * 0.6)) is 112"
    );
  }
);

QUnit.test("0x digits", function(assert) {
  var runner = new ExpressionRunner("0x1 + 0x2 + {x}");
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
  var runner = new ExpressionRunner(
    "{val1} - {val2} + myFunc({val3}, {val4.prop}) < {val5} and {val6}=1"
  );
  var vars = runner.getVariables();
  assert.equal(vars.length, 6, "There are 6 variables in expression");
  assert.equal(vars[0], "val1", "the first variable");
  assert.equal(vars[5], "val6", "the last variable");
});
QUnit.test("Test binary operator anyof", function(assert) {
  var runner = new ConditionRunner("{value} anyof ['a', 'b']");
  var values = { value: ["a", "c"] };
  assert.equal(runner.run(values), true, "['a', 'c'] anyof ['a', 'b']");
  values = { value: ["a", "b"] };
  assert.equal(runner.run(values), true, "['a', 'b'] anyof ['a', 'b']");
  values = { value: ["c", "d"] };
  assert.equal(runner.run(values), false, "['c', 'd'] anyof ['a', 'b']");
  values = { value: [] };
  assert.equal(runner.run(values), false, "[] anyof ['a', 'b']");
  values = { value: null };
  assert.equal(runner.run(values), false, "null anyof ['a', 'b']");
});
QUnit.test("Test binary operator anyof with 0", function(assert) {
  var runner = new ConditionRunner("{value} anyof [7, 3, 0]");
  var values = { value: 3 };
  assert.equal(runner.run(values), true, "3 anyof [7, 3, 0]");
  values.value = 0;
  assert.equal(runner.run(values), true, "0 anyof [7, 3, 0]");
  values.value = 1;
  assert.equal(runner.run(values), false, "1 anyof [7, 3, 0]");
});
QUnit.test("Test operator anyof for non-array var", function(assert) {
  var runner = new ConditionRunner("{value} anyof ['a', 'b', 'c']");
  var values = { value: "a" };
  assert.equal(runner.run(values), true, "'a' anyof ['a', 'b', 'c']");
  values.value = "e";
  assert.equal(runner.run(values), false, "'e' anyof ['a', 'b', 'c']");
});
QUnit.test("Test binary operator allof", function(assert) {
  var runner = new ConditionRunner("{value} allof ['a', 'b']");
  var values = { value: ["a", "c"] };
  assert.equal(runner.run(values), false, "['a', 'c'] allof ['a', 'b']");
  values = { value: ["a", "b", "c"] };
  assert.equal(runner.run(values), true, "['a', 'b', 'c'] allof ['a', 'b']");
  values = { value: ["c", "d"] };
  assert.equal(runner.run(values), false, "['c', 'd'] allof ['a', 'b']");
});

QUnit.test("Compare object with string", function(assert) {
  var runner = new ConditionRunner("{value} = '1'");
  var values: any = { value: 1 };
  assert.equal(runner.run(values), true, "1 = '1'");
});

QUnit.test("Compare undefined object with string", function(assert) {
  var runner = new ConditionRunner("{value} = 'undefined'");
  var values: any = {};
  assert.equal(runner.run(values), true, "undefined = 'undefined'");
});

QUnit.test("Compare two undefined variables", function(assert) {
  var values: any = { v1: undefined, v2: undefined };
  assert.equal(
    new ConditionRunner("{v1} = {v2}").run(values),
    true,
    "undefined = undefined"
  );
  assert.equal(
    new ConditionRunner("{v1} != {v2}").run(values),
    false,
    "undefined != undefined"
  );
  assert.equal(
    new ConditionRunner("{v1} <= {v2}").run(values),
    true,
    "undefined <= undefined"
  );
  assert.equal(
    new ConditionRunner("{v1} >= {v2}").run(values),
    true,
    "undefined >= undefined"
  );
  assert.equal(
    new ConditionRunner("{v1} < {v2}").run(values),
    false,
    "undefined < undefined"
  );
  assert.equal(
    new ConditionRunner("{v1} > {v2}").run(values),
    false,
    "undefined > undefined"
  );
  values.v1 = 1;
  assert.equal(
    new ConditionRunner("{v1} > {v2}").run(values),
    false,
    "1 > undefined"
  );
  assert.equal(
    new ConditionRunner("{v1} < {v2}").run(values),
    false,
    "1 < undefined"
  );
});

QUnit.test("Support apostrophes in value name", function(assert) {
  var runner = new ConditionRunner("{a'b\"c} = 1");
  var values: any = { "a'b\"c": 1 };
  assert.equal(runner.run(values), true, "1 = 1");
  values = { "a'b\"c": 2 };
  assert.equal(runner.run(values), false, "2 = 1");
});

QUnit.test("String as numbers", function(assert) {
  var runner = new ExpressionRunner("({a} + {b}) * {c}");
  var values: any = { a: "2", b: "3", c: "4" };
  assert.equal(runner.run(values), 20, "convert strings to numbers");
});

QUnit.test(
  "True/False strings do not work, Bug #https://surveyjs.answerdesk.io/ticket/details/T2425",
  function(assert) {
    var runner = new ConditionRunner("{a} = 'True'");
    var values: any = { a: "False" };
    assert.equal(runner.run(values), false, "'True' = 'False'");
    values.a = "True";
    assert.equal(runner.run(values), true, "'True' = 'True'");
    values.a = false;
    assert.equal(runner.run(values), false, "false = 'True'");
    values.a = true;
    assert.equal(runner.run(values), true, "true = 'True'");

    runner = new ConditionRunner("{a} = 'False'");
    values.a = "False";
    assert.equal(runner.run(values), true, "'False' = 'False'");
    values.a = "True";
    assert.equal(runner.run(values), false, "'True' = 'False'");
    values.a = false;
    assert.equal(runner.run(values), true, "'False' = false");
    values.a = true;
    assert.equal(runner.run(values), false, "'False'=true");
  }
);

QUnit.test("Use dot, '.' in names", function(assert) {
  var runner = new ConditionRunner("{a.b.c.d} = 1");
  var values: any = { "a.b.c.d": 1 };
  assert.equal(runner.run(values), true, "1 = 1");
});

QUnit.test("Async function", function(assert) {
  function asyncFunc(params: any): any {
    this.returnResult(params[0] * 3);
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

  var runner = new ConditionRunner("asyncFunc({a}) = 15");
  var runnerResult = null;
  runner.onRunComplete = function(result: any) {
    runnerResult = result;
  };
  assert.equal(runner.isAsync, true, "The condition is async");
  var values = { a: 3 };
  runner.run(values);
  assert.equal(runnerResult, false, "3*3 = 15");
  values.a = 5;
  runner.run(values);
  assert.equal(runnerResult, true, "5*3 = 15");
  FunctionFactory.Instance.unregister("asyncFunc");
});

QUnit.test("Use onRunComplete for sync functions", function(assert) {
  function syncFunc(params: any): any {
    return params[0] * 3;
  }
  FunctionFactory.Instance.register("syncFunc", syncFunc);

  var runner = new ConditionRunner("syncFunc({a}) = 15");
  var runnerResult = null;
  runner.onRunComplete = function(result: any) {
    runnerResult = result;
  };
  assert.equal(runner.isAsync, false, "The condition is sync");
  var values = { a: 3 };
  runner.run(values);
  assert.equal(runnerResult, false, "3*3 = 15");
  values.a = 5;
  runner.run(values);
  assert.equal(runnerResult, true, "5*3 = 15");
  FunctionFactory.Instance.unregister("syncFunc");
});

QUnit.test("Several async functions in expression", function(assert) {
  var returnResult1: (res: any) => void;
  var returnResult2: (res: any) => void;
  var returnResult3: (res: any) => void;
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  function asyncFunc2(params: any): any {
    returnResult2 = this.returnResult;
    return false;
  }
  function asyncFunc3(params: any): any {
    returnResult3 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
  FunctionFactory.Instance.register("asyncFunc3", asyncFunc3, true);

  var runner = new ConditionRunner(
    "asyncFunc1() + asyncFunc2() + asyncFunc3() = 10"
  );
  let idBefore: number = -1;
  let idAfter: number = -1;
  runner.onBeforeAsyncRun = (id: number) => { idBefore = id; };
  runner.onAfterAsyncRun = (id: number) => { idAfter = id; };
  var runnerResult = null;
  runner.onRunComplete = function(result: any) {
    runnerResult = result;
  };
  assert.equal(runner.isAsync, true, "The condition is async");
  var values = { a: 3 };
  assert.equal(idBefore, -1, "idBefore #1");
  assert.equal(idAfter, -1, "idAfter #1");
  runner.run(values);
  assert.equal(idBefore, runner.id, "idBefore #2");
  assert.equal(idAfter, -1, "idAfter #2");
  assert.equal(
    runnerResult,
    null,
    "It is not ready, async functions do not return anything"
  );
  returnResult2(2);
  assert.equal(
    runnerResult,
    null,
    "It is not ready, asyncfunc1 and asyncfunc3 functions do not return anything"
  );
  assert.equal(idBefore, runner.id, "idBefore #3");
  assert.equal(idAfter, -1, "idAfter #3");
  returnResult1(7);
  assert.equal(
    runnerResult,
    null,
    "It is not ready, asyncfunc3 function doesn't return anything"
  );
  assert.equal(idBefore, runner.id, "idBefore #4");
  assert.equal(idAfter, -1, "idAfter #4");
  returnResult3(1);
  assert.equal(runnerResult, true, "evulate successfull");
  assert.equal(idBefore, runner.id, "idBefore #5");
  assert.equal(idAfter, runner.id, "idAfter #5");
  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
  FunctionFactory.Instance.unregister("asyncFunc3");
});

QUnit.test("isString function", function(assert) {
  function isString(params: any[]): any {
    return typeof params[0] == "string";
  }
  FunctionFactory.Instance.register("isString", isString);

  var runner = new ConditionRunner("isString({val}) == true");
  var values: any = { val: "3" };
  var properties = {};
  assert.equal(runner.run(values, properties), false, "3 is Numeric");
  values.val = false;
  assert.equal(runner.run(values, properties), false, "false is boolean");
  values.val = "abc";
  assert.equal(runner.run(values, properties), true, "'abc' is string");
  values.val = "0x2323";
  assert.equal(runner.run(values, properties), false, "'0x2323' is number");
  values.val = "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8";
  assert.equal(
    runner.run(values, properties),
    true,
    "'0xbe0eb53f46cd790cd13851d5eff43d12404d33e8' is string"
  );
  FunctionFactory.Instance.unregister("isString");
});
QUnit.test('express with iif and "[" inside, Bug#1942', function(assert) {
  // prettier-ignore
  var expression = "{val1} + iif({val2} = \"item2\", \"[\" + {val1} + \"]\", \"x\")";
  var runner = new ExpressionRunner(expression);
  var values: any = { val1: "1", val2: "item2" };
  assert.equal(runner.run(values), "1[1]", "val1 + [val1]");
  values.val2 = "item1";
  assert.equal(runner.run(values), "1x", "1 + 'x'");
  values.val1 = undefined;
  assert.equal(runner.run(values), "x", "undefined + 'x'");
  // prettier-ignore
  expression = "{val1} + \"x\"";
  var runner = new ExpressionRunner(expression);
  assert.equal(runner.run(values), "x", "undefined + 'x' without iif");
  expression = '{val1} + "[" + {val1} + "]"';
  var runner = new ExpressionRunner(expression);
  assert.equal(
    runner.run(values),
    "[]",
    "undefined + '[' + undefined + ']' without iif"
  );
});
QUnit.test('expression with "{", Bug#2337', function(assert) {
  // prettier-ignore
  var expression = "{val1} + '\{ text' + '\}'";
  var runner = new ExpressionRunner(expression);
  var values: any = { val1: "1" };
  assert.equal(runner.run(values), "1{ text}", "{");

  expression = "{val1} + '{ text' + '}'";
  runner = new ExpressionRunner(expression);
  var values: any = { val1: "1" };
  assert.equal(runner.run(values), "1{ text}", "{ without escape");
});
QUnit.test("Disable converting string to number, #2376", function(assert) {
  var runner = new ExpressionRunner("{val1} + {val2}");
  var values: any = { val1: "1", val2: "102" };
  assert.equal(runner.run(values), 103, "Convert strings to numbers");

  runner = new ExpressionRunner("{#val1} + {#val2}");
  assert.equal(runner.run(values), "1102", "do not convert the value");
  let expr = new ConditionsParser().createCondition("{#val1} + {#val2}");
  assert.equal(expr.toString(), "({#val1} + {#val2})", "Do not loose '#'");
});

QUnit.test("ExpressionRunner: age", function(assert) {
  var runner = new ExpressionRunner("age({d})");
  var d = new Date();
  d.setDate(d.getDate() - 1);
  d.setFullYear(d.getFullYear() - 10);
  var values = { d: d };
  assert.equal(runner.run(values), 10, "10 year");
  /* TODO case stop worked on December 31. Do we need minus age?
  d = new Date();
  d.setDate(d.getDate() + 1);
  d.setFullYear(d.getFullYear() + 10);
  values.d = d;
  assert.equal(runner.run(values), -10, "Date in the future, 10 years");
  */
});

QUnit.test("ExpressionRunner: diffsDays", function(assert) {
  var runner = new ExpressionRunner("diffDays({d1}, {d2})");
  var d1 = new Date("2021-01-01");
  var d2 = new Date("2021-02-02");
  var values = { d1: d1, d2: d2 };
  assert.equal(runner.run(values), 32, "32 days");
  values.d1 = undefined;
  assert.equal(runner.run(values), 0, "a value is undefined");
});

QUnit.test("parse({val} == '000')", function(assert) {
  var op = <BinaryOperand>(
    new ConditionsParser().parseExpression("{val} == '000'")
  );
  assert.equal(op.rightOperand.getType(), "const", "variable type");
  assert.equal(
    (<Const>op.rightOperand).toString(),
    "'000'",
    "value is string with quotes"
  );
  assert.strictEqual(
    (<Const>op.rightOperand).correctValue,
    "000",
    "correct value is string"
  );
});

QUnit.test("000 == '000', '00' != '000', '0' != '000', 0 != '000'", function(
  assert
) {
  var runner = new ConditionRunner("{val} == '000'");
  var values: any = { val: "000" };
  assert.equal(runner.run(values), true, "000 == '000'");
  values.val = "00";
  assert.equal(runner.run(values), false, "'00' != '000'");
  values.val = "0";
  assert.equal(
    runner.run(values),
    true,
    "'0' != '000', '0' and '000' converted to number"
  );
  values.val = 0;
  assert.equal(runner.run(values), true, "0 != '000', convert '000' to number");
});
QUnit.test("True and False as strings'", function(assert) {
  var runner = new ConditionRunner("{val} = 'TRUE'");
  var values: any = { val: "TRUE" };
  assert.equal(runner.run(values), true, "TRUE == 'TRUE'");
  runner = new ConditionRunner("{val} contains 'TRU'");
  assert.equal(runner.run(values), true, "TRUE contains TRU");
  runner = new ConditionRunner("{val} contains 'FALSE'");
  assert.equal(runner.run(values), false, "TRUE contains FALSE");
  values.val = "FALSE";
  assert.equal(runner.run(values), true, "FALSE contains FALSE");
});
QUnit.test("ExpressionRunner: fix incorrect JavaScript multiplication", function(assert) {
  var runner = new ExpressionRunner("3 * 0.6");
  assert.equal(runner.run({}), 1.8, "It works correctly");
});
QUnit.test("ExpressionRunner: fix incorrect JavaScript summary", function(assert) {
  var runner = new ExpressionRunner("0.3 + 0.6");
  assert.equal(runner.run({}), 0.9, "It works correctly");
});
QUnit.test("ExpressionRunner: fix incorrect JavaScript summary", function(assert) {
  var runner = new ExpressionRunner("0.9 - 0.6");
  assert.equal(runner.run({}), 0.3, "It works correctly");
});
QUnit.test("ExpressionRunner: fix incorrect JavaScript summary in sum function", function(assert) {
  var runner = new ExpressionRunner("sum([0.3, 0.6]");
  assert.equal(runner.run({}), 0.9, "It works correctly, sum function");
});
QUnit.test("ExpressionRunner: fix incorrect JavaScript summary in avg function", function(assert) {
  var runner = new ExpressionRunner("avg([0.3, 0.6]");
  assert.equal(runner.run({}), 0.45, "It works correctly, avg function");
});
QUnit.test("ExpressionRunner: fix incorrect JavaScript summary in sumInArray function", function(assert) {
  var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
  var values = { a: [{ val1: 0.3 }, { val2: 10 }, { val1: 0.6 }] };
  assert.equal(runner.run(values), 0.9, "It works correctly, sumInArray func");
});
QUnit.test("ExpressionRunner: fix incorrect JavaScript summary in avgInArray function", function(assert) {
  var runner = new ExpressionRunner("avgInArray({a}, 'val1')");
  var values = { a: [{ val1: 0.3 }, { val2: 10 }, { val1: 0.6 }] };
  assert.equal(runner.run(values), 0.45, "It works correctly, avgInArray func");
});
QUnit.test("ExpressionRunner: sumInArray function, float and string", function(assert) {
  var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
  var values = { a: [{ val1: 0.3 }, { val1: "10" }, { val1: "0.6" }, { val1: "abc" }] };
  assert.equal(runner.run(values), 10.9, "It works correctly, sumInArray func");
});
QUnit.test("ExpressionRunner: minInArray function, float and string", function(assert) {
  var runner = new ExpressionRunner("minInArray({a}, 'val1')");
  var values = { a: [{ val1: 3 }, { val1: "1" }, { val1: "abc" }] };
  assert.equal(runner.run(values), 1, "It works correctly, minInArray func");
});
QUnit.test("ExpressionRunner: maxInArray function, float and string", function(assert) {
  var runner = new ExpressionRunner("maxInArray({a}, 'val1')");
  var values = { a: [{ val1: -3 }, { val1: "-1" }, { val1: "abc" }] };
  assert.equal(runner.run(values), -1, "It works correctly, maxInArray func");
});

QUnit.test("Operand.isEqual()", function(assert) {
  const getOperand = (expression: string): Operand => {
    return new ConditionsParser().parseExpression(expression);
  };
  const compareOperands = (exp1: string, exp2: string): boolean => {
    return getOperand(exp1).isEqual(getOperand(exp2));
  };
  assert.equal(compareOperands("{val} = 1", "{val} = 2"), false, "#1");
  assert.equal(compareOperands("{val} = 1", "{val} = 1"), true), "#2";
  assert.equal(compareOperands("{val} = 1 and func({a}) < 3", "{val} = 1 and func({a}) < 3"), true, "#3");
  assert.equal(compareOperands("{val} = 1 and func({a}) < 3", "{val} = 1 and func({b}) < 3"), false, "#4");
  assert.equal(compareOperands("func({a}) < 3", "func({b}) < 3"), false, "#4.1");
  assert.equal(compareOperands("func({a, b, 5}) < 3", "func({a, b, 5}) < 3"), true, "#4.2");
  assert.equal(compareOperands("{a} < 3", "{b} < 3"), false, "#4.3");
  assert.equal(compareOperands("{val} = 1 and func({a}) < 3", "{val} = 1 or func({a}) < 3"), false, "#5");
  assert.equal(compareOperands("{val} = 1", "{val} != 1"), false, "#6");
});

QUnit.test("Expression decimal + string", function(assert) {
  const expression = new ExpressionRunner("0.1 + 'abc'");
  assert.equal(expression.run({}), "0.1abc");
});
QUnit.test("string contancts without brackets", function(assert) {
  let expression = new ExpressionRunner("{a} = abc");
  assert.equal(expression.run({ a: "abcd" }), false, "#1");
  assert.equal(expression.run({ a: "abc" }), true, "#2");
  expression = new ExpressionRunner("{a} = ab_cd");
  assert.equal(expression.run({ a: "abcd" }), false, "#3");
  assert.equal(expression.run({ a: "ab_cd" }), true, "#4");
});
QUnit.test("Expression string as ==", function(assert) {
  const node = <Const>new ConditionsParser().parseExpression("'=='");
  assert.equal(node.getType(), "const");
  assert.equal(node.correctValue, "==");
  assert.equal(new ExpressionRunner("'=='").run({}), "==");
  assert.equal(new ExpressionRunner("'aa' + '=='").run({}), "aa==");
});
QUnit.test("Arrays and plus operations", function(assert) {
  const runner1 = new ExpressionRunner("{a} + {b}");
  const values1 = { a: [1, 2, 3], b: [4, 5] };
  assert.deepEqual(runner1.run(values1), [1, 2, 3, 4, 5], "Contact arrays");
  const runner2 = new ExpressionRunner("{a} + ' '");
  const values2 = { a: ["a", "b", "c"] };
  assert.equal(runner2.run(values2), "a, b, c ", "Contact strings");
  const runner3 = new ExpressionRunner("{a} + 4");
  const values3 = { a: [1, 2, 3] };
  assert.equal(runner3.run(values3), 10, "summary of numbers");
  const runner4 = new ExpressionRunner("{a} + ''");
  const values4 = { a: [1, 2, 3] };
  assert.equal(runner4.run(values4), "1, 2, 3", "summary of numbers");
});
QUnit.test("today(1) <= today(10)", function(assert) {
  const runner = new ExpressionRunner("today(1) <= today(10)");
  assert.deepEqual(runner.run({}), true, "today(1) <= today(10)");
});

QUnit.test("year, month, day, weekday", function(assert) {
  let runner = new ExpressionRunner("year('2023-07-28')");
  assert.deepEqual(runner.run({}), 2023, "year");
  runner = new ExpressionRunner("month('2023-07-28')");
  assert.deepEqual(runner.run({}), 7, "month");
  runner = new ExpressionRunner("day('2023-07-28')");
  assert.deepEqual(runner.run({}), 28, "day");
  runner = new ExpressionRunner("weekday('2023-07-28')");
  assert.deepEqual(runner.run({}), 5, "weekday");
  runner = new ExpressionRunner("year()");
  assert.deepEqual(runner.run({}), new Date().getFullYear(), "current year");
  runner = new ExpressionRunner("month()");
  assert.deepEqual(runner.run({}), new Date().getMonth() + 1, "current month");
  runner = new ExpressionRunner("day()");
  assert.deepEqual(runner.run({}), new Date().getDate(), "current day");
  runner = new ExpressionRunner("weekday()");
  assert.deepEqual(runner.run({}), new Date().getDay(), "current weekday");
});
QUnit.test("Sum two float numbers as string", function(assert) {
  let runner = new ExpressionRunner("{a} + {b}");
  assert.equal(runner.run({ a: "1.1", b: "2.2" }), 3.3, "#1");
  assert.equal(runner.run({ a: "0.1", b: "0.2" }), 0.3, "#2");
});
QUnit.test("Warn in console if the expression is invalid", function(assert) {
  const prev = ConsoleWarnings.warn;
  let reportText: string = "";
  ConsoleWarnings.warn = (text: string) => {
    reportText = text;
  };
  const runner = new ExpressionRunner("{a} ++");
  assert.notOk(reportText);
  runner.run({ a: 1 });
  assert.equal(reportText, "Invalid expression: {a} ++");

  reportText = "";
  runner.expression = "{a} + 1";
  runner.run({ a: 1 });
  assert.notOk(reportText);

  runner.expression = "tooday()";
  assert.notOk(reportText);
  runner.run({});
  assert.equal(reportText, "Unknown function name: tooday");

  reportText = "";
  runner.expression = "today";
  runner.run({});
  assert.notOk(reportText);
  ConsoleWarnings.warn = prev;
});
QUnit.test("Custom function returns object&array, #7050", function(assert) {
  function func1(params: any[]): any {
    return { a: 1, b: 2 };
  }
  function func2(params: any[]): any {
    return [{ a: 1 }, { b: 2 }];
  }
  FunctionFactory.Instance.register("func1", func1);
  FunctionFactory.Instance.register("func2", func2);

  let runner = new ExpressionRunner("func1()");
  assert.deepEqual(runner.run({}, {}), { a: 1, b: 2 }, "function returns object");
  runner.expression = "func2()";
  assert.deepEqual(runner.run({}, {}), [{ a: 1 }, { b: 2 }], "function returns array");

  FunctionFactory.Instance.unregister("func1");
  FunctionFactory.Instance.unregister("func2");
});
QUnit.test("ExpressionRunner: substring", function(assert) {
  var runner = new ExpressionRunner("substring({s}, 1, 3)");
  const values: any = { s: "abcdef" };
  assert.equal(runner.run(values), "bc", "abcdef");
  values.s = undefined;
  assert.equal(runner.run(values), "", "undefined");
  values.s = 10;
  assert.equal(runner.run(values), "", "10");
});
