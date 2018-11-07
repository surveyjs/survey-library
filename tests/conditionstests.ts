import { ConditionsParser } from "../src/conditionsParser";
import {
  Operand,
  Condition,
  ConditionNode,
  ConditionRunner,
  ExpressionOperand,
  ExpressionRunner
} from "../src/conditions";
import { parse } from "querystring";
import { FunctionFactory } from "../src/functionsfactory";

export default QUnit.module("Conditions");

QUnit.test("Condition", function(assert) {
  var op = new Condition();
  op.right = new Operand(5);
  op.left = new Operand(5);
  assert.equal(op.perform(), true, "equal: 5 == 5");
  op.left = new Operand(3);
  assert.equal(op.perform(), false, "equal: 3 != 5");
  op.operator = "notequal";
  op.left = new Operand(5);
  assert.equal(op.perform(), false, "notequal: 5 == 5");
  op.left = new Operand(3);
  assert.equal(op.perform(), true, "notequal: 3 != 5");
  op.operator = "empty";
  op.left = null;
  assert.equal(op.perform(), true, "empty: null");
  op.left = new Operand(1);
  assert.equal(op.perform(), false, "empty: 1");
  op.operator = "notempty";
  op.left = null;
  assert.equal(op.perform(), false, "notempty: null");
  op.left = new Operand(1);
  assert.equal(op.perform(), true, "notempty: 1");
  op.operator = "contains";
  op.right = new Operand(3);
  op.left = new Operand([1, 2, 3, 4, 5]);
  assert.equal(op.perform(), true, "contains: 3 from [1, 2, 3, 4, 5]");
  op.left = new Operand([1, 2, 4, 5]);
  assert.equal(op.perform(), false, "contains: 3 from [1, 2, 4, 5]");
  op.operator = "*=";
  op.left = new Operand([1, 2, 3, 4, 5]);
  assert.equal(op.perform(), true, "contains: 3 from [1, 2, 3, 4, 5]");
  op.left = new Operand([1, 2, 4, 5]);
  assert.equal(op.perform(), false, "contains: 3 from [1, 2, 4, 5]");
  op.operator = "notcontains";
  op.left = new Operand([1, 2, 3, 4, 5]);
  assert.equal(op.perform(), false, "notcontains: 3 from [1, 2, 3, 4, 5]");
  op.left = new Operand([1, 2, 4, 5]);
  assert.equal(op.perform(), true, "notcontains: 3 from [1, 2,  4, 5]");
  op.operator = "greater";
  op.right = new Operand(4);
  op.left = new Operand(5);
  assert.equal(op.perform(), true, "greater: 5 > 4");
  op.left = new Operand(3);
  assert.equal(op.perform(), false, "greater: 3 > 4");
  op.operator = "less";
  op.left = new Operand(5);
  assert.equal(op.perform(), false, "less: 5 < 4");
  op.left = new Operand(3);
  assert.equal(op.perform(), true, "less: 3 < 4");
  op.operator = "greaterorequal";
  op.left = new Operand(4);
  assert.equal(op.perform(), true, "orequal: 4 >= 4");
  op.left = new Operand(3);
  assert.equal(op.perform(), false, "orequal: 3 >= 4");
  op.operator = "lessorequal";
  op.left = new Operand(5);
  assert.equal(op.perform(), false, "lessorequal: 4 <= 5");
  op.left = new Operand(4);
  assert.equal(op.perform(), true, "less: 4 <= 4");
});

QUnit.test("Condition with quotes", function(assert) {
  var op = new Condition();
  op.left = new Operand("yes");
  op.right = new Operand("'yes'");
  assert.equal(op.perform(), true, "equal: yes == 'yes'");
});

function checkItemCondition(op: string, expectedOp: string): boolean {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("'a'" + op + "2", node);
  return node.children[0].operator == expectedOp;
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

QUnit.test("Condition: on item", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("'a' > 2", node);
  assert.equal(node.children.length, 1);
  assert.equal(node.children[0].left.origionalValue, "a");
  assert.equal(node.children[0].operator, "greater");
  assert.equal(node.children[0].right.origionalValue, 2);
  assert.equal(node.connective, "and");
});

QUnit.test("Condition: without right condition", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  assert.ok(parser.parse("'a' empty", node), "empty");
  assert.ok(parser.parse("'a' notempty", node), "notempty");
});

QUnit.test("Condition: on item - no spaces", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("5>2", node);
  assert.equal(node.children.length, 1);
  assert.equal(node.children[0].left.origionalValue, "5");
  assert.equal(node.children[0].operator, "greater");
  assert.equal(node.children[0].right.origionalValue, 2);
  assert.equal(node.connective, "and");
});

QUnit.test("Condition: on item - string value and name has spaces", function(
  assert
) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("'my question'<>'this first value'", node);
  assert.equal(node.children.length, 1);
  assert.equal(node.children[0].left.origionalValue, "my question");
  assert.equal(node.children[0].operator, "notequal");
  assert.equal(node.children[0].right.origionalValue, "this first value");
  assert.equal(node.connective, "and");
});

QUnit.test("Condition: two items or", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("'a' = 1 or 'b' = 2", node);
  assert.equal(node.children.length, 2);
  assert.equal(node.connective, "or");
  assert.equal(node.children[0].left.origionalValue, "a");
  assert.equal(node.children[0].operator, "equal");
  assert.equal(node.children[0].right.origionalValue, 1);
  assert.equal(node.children[1].left.origionalValue, "b");
  assert.equal(node.children[1].operator, "equal");
  assert.equal(node.children[1].right.origionalValue, 2);
});

QUnit.test("Condition: a and b or c", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("'a' = 1 and 'b' = 2 or 'c' = 3", node);
  assert.equal(node.children.length, 2);
  assert.equal(node.connective, "or");
  var left = node.children[0];
  assert.equal(left.children.length, 2);
  assert.equal(left.connective, "and");
  assert.equal(left.children[0].left.origionalValue, "a");
  assert.equal(left.children[0].operator, "equal");
  assert.equal(left.children[0].right.origionalValue, 1);
  assert.equal(left.children[1].left.origionalValue, "b");
  assert.equal(left.children[1].operator, "equal");
  assert.equal(left.children[1].right.origionalValue, 2);
  var right = node.children[1];
  assert.equal(right.children.length, 1);
  assert.equal(right.connective, "and");
  assert.equal(right.children[0].left.origionalValue, "c");
  assert.equal(right.children[0].operator, "equal");
  assert.equal(right.children[0].right.origionalValue, 3);
});

QUnit.test("Condition: a and (b or c)", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("'a' = 1 and('b' = 2 or 'c' = 3)", node);
  assert.equal(node.children.length, 2);
  assert.equal(node.connective, "and");
  var left = node.children[0];
  assert.equal(left.left.origionalValue, "a");
  assert.equal(left.operator, "equal");
  assert.equal(left.right.origionalValue, 1);
  var right = node.children[1];
  assert.equal(right.children.length, 2);
  assert.equal(right.connective, "or");
  assert.equal(right.children[0].left.origionalValue, "b");
  assert.equal(right.children[0].operator, "equal");
  assert.equal(right.children[0].right.origionalValue, 2);
  assert.equal(right.children[1].left.origionalValue, "c");
  assert.equal(right.children[1].operator, "equal");
  assert.equal(right.children[1].right.origionalValue, 3);
});

QUnit.test("Condition: function without parameters", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("currentYear() = 2000", node);
  assert.equal(node.children.length, 1);
  assert.equal(node.children[0].left.origionalValue, "currentYear");
  assert.equal(
    node.children[0].left.parameters.length,
    0,
    "function without parameters"
  );
  assert.equal(node.children[0].operator, "equal");
  assert.equal(node.children[0].right.origionalValue, 2000);
  assert.equal(node.connective, "and");
});
QUnit.test("Condition: function with parameters", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("concat('a', {b},3) = 'ac'", node);
  assert.equal(node.children.length, 1);
  var left = node.children[0].left;
  assert.equal(left.origionalValue, "concat");
  assert.equal(left.parameters.length, 3, "function with 3 parameters");
  assert.equal(left.parameters[0].origionalValue, "a", "the first parameter");
  assert.equal(
    left.parameters[1].origionalValue,
    "{b}",
    "the second parameter"
  );
  assert.equal(left.parameters[2].origionalValue, 3, "the third parameter");
  assert.equal(node.children[0].operator, "equal");
  assert.equal(node.children[0].right.origionalValue, "ac");
  assert.equal(node.connective, "and");
});
QUnit.test("Condition: nested functions", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("sum(2, mult(2,3), 4) = 'ac'", node);
  assert.equal(node.children.length, 1);
  var left = node.children[0].left;
  assert.equal(left.origionalValue, "sum");
  assert.equal(left.parameters.length, 3, "function with 3 parameters");
  assert.equal(left.parameters[0].origionalValue, 2, "the first parameter");

  var param = left.parameters[1];
  assert.equal(param.origionalValue, "mult");
  assert.equal(param.parameters.length, 2, "function with 2 parameters");
  assert.equal(param.parameters[0].origionalValue, 2, "the first parameter");
  assert.equal(param.parameters[1].origionalValue, 3, "the second parameter");

  assert.equal(left.parameters[2].origionalValue, 4, "the third parameter");
  assert.equal(node.children[0].operator, "equal");
  assert.equal(node.children[0].right.origionalValue, "ac");
  assert.equal(node.connective, "and");
});

QUnit.test("Condition: (a and b) or (c and d)", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("('a' = 1 and b = 2) or ('c' = 3 or 'd' = 4)", node);
  assert.equal(node.children.length, 2);
  assert.equal(node.connective, "or");
  var left = node.children[0];

  assert.equal(left.children.length, 2);
  assert.equal(left.connective, "and");
  assert.equal(left.children[0].left.origionalValue, "a");
  assert.equal(left.children[0].operator, "equal");
  assert.equal(left.children[0].right.origionalValue, 1);
  assert.equal(left.children[1].left.origionalValue, "b");
  assert.equal(left.children[1].operator, "equal");
  assert.equal(left.children[1].right.origionalValue, 2);

  var right = node.children[1];
  assert.equal(right.children.length, 2);
  assert.equal(right.connective, "or");
  assert.equal(right.children[0].left.origionalValue, "c");
  assert.equal(right.children[0].operator, "equal");
  assert.equal(right.children[0].right.origionalValue, 3);
  assert.equal(right.children[1].left.origionalValue, "d");
  assert.equal(right.children[1].operator, "equal");
  assert.equal(right.children[1].right.origionalValue, 4);
});

QUnit.test("Parse condition from #303", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse(
    "({question-fruit} = 'fruit-apple' and {question-apple-variety} = 'apple-variety-red-delicious') or ({question-fruit} = 'fruit-orange' and {question-orange-variety} = 'orange-variety-blood')",
    node
  );
  assert.equal(node.children.length, 2);
  assert.equal(node.connective, "or");
  var left = node.children[0];
  var right = node.children[1];
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
  assert.equal(runner.run(values), true, "21 >= 21 and (male = male or 1 > 1");
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

QUnit.test("Expression Tree to Text", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("'age' >= 21 and ('sex' = 'male' or 'kids' > 1)", node);
  assert.equal(
    parser.toString(node),
    "'age' >= 21 and ('sex' = 'male' or 'kids' > 1)"
  );
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
  var runner = new ConditionRunner("sum({var1},{var2}) == 5");
  var values = { var1: 2, var2: 3 };
  assert.equal(runner.run(values), true, "true, 2 + 3 == 5");
  values.var1 = 1;
  assert.equal(runner.run(values), false, "false, 1 + 3 == 5");
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

QUnit.test("Condition array: {a} equals [1, 2]", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("{a} equals [1, 2]", node);
  assert.equal(node.children.length, 1);
  var child = node.children[0];
  assert.equal(child.left.origionalValue, "{a}", "left is parsed correctly");
  assert.equal(child.operator, "equal", "operator is parsed correctly");
  assert.deepEqual(
    child.right.getValue(null),
    [1, 2],
    "right is parsed correctly"
  );
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

QUnit.test("Override functions: make equal works as contains", function(
  assert
) {
  var eqFunc = Condition.getOperator("equal");
  var containsFunc = Condition.getOperator("contains");
  var newFunc = function(left: any, right: any) {
    if (Array.isArray(left) && !Array.isArray(right)) {
      return containsFunc(left, right);
    }
    return eqFunc(left, right);
  };
  Condition.setOperator("equal", newFunc);
  var runner = new ConditionRunner("{checkquestion} = 3");
  var values = { checkquestion: [1, 2] };
  assert.equal(runner.run(values), false, "There is no 3 value");
  values = { checkquestion: [1, 2, 3] };
  assert.equal(runner.run(values), true, "There is 3 value");
  Condition.setOperator("equal", eqFunc);
});
QUnit.test("ExpressionOperand: Simple Parser", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("4+1>2", node);
  assert.equal(node.children.length, 1);
  var left = <ExpressionOperand>node.children[0].left;
  assert.equal(left.left.origionalValue, "4");
  assert.equal(left.right.origionalValue, "1");
  assert.equal(left.operator, "+");
  assert.equal(node.children[0].operator, "greater");
  assert.equal(node.children[0].right.origionalValue, 2);
  assert.equal(node.connective, "and");
});
QUnit.test("ExpressionOperand: Simple expression", function(assert) {
  var runner = new ConditionRunner("{a} - 1 > 5");
  var values = { a: 7 };
  assert.equal(runner.run(values), true, "6 > 5");
  values = { a: 6 };
  assert.equal(runner.run(values), false, "5 > 5");
});
QUnit.test("ExpressionOperand: parser, 1 + 2 + 3", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("1 + 2 - 3 >= 10", node);
  assert.equal(node.children.length, 1);
  var left = <ExpressionOperand>node.children[0].left;
  var leftright = <ExpressionOperand>left.right;
  assert.equal(left.left.origionalValue, 1);
  assert.equal(left.operator, "+");
  assert.equal(leftright.left.origionalValue, 2);
  assert.equal(leftright.operator, "-");
  assert.equal(leftright.right.origionalValue, 3);
  assert.equal(node.children[0].operator, "greaterorequal");
  assert.equal(node.children[0].right.origionalValue, 10);
  assert.equal(node.connective, "and");
});
QUnit.test("ExpressionOperand: parser, 1 + 2 * 3", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("1 + 2 * 3 >= 10", node);
  assert.equal(node.children.length, 1);
  var left = <ExpressionOperand>node.children[0].left;
  var leftRight = <ExpressionOperand>left.right;
  assert.equal(left.left.origionalValue, 1);
  assert.equal(left.operator, "+");
  assert.equal(leftRight.left.origionalValue, 2);
  assert.equal(leftRight.right.origionalValue, 3);
  assert.equal(leftRight.operator, "*");
  assert.equal(node.children[0].operator, "greaterorequal");
  assert.equal(node.children[0].right.origionalValue, 10);
  assert.equal(node.connective, "and");
});
QUnit.test("ExpressionOperand: parser, 3 *(1 + 2)", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("3 *(1 + 2) >= 10", node);
  assert.equal(node.children.length, 1);
  var left = <ExpressionOperand>node.children[0].left;
  var leftRight = <ExpressionOperand>left.right;
  assert.equal(left.left.origionalValue, 3);
  assert.equal(left.operator, "*");
  assert.equal(leftRight.left.origionalValue, 1);
  assert.equal(leftRight.right.origionalValue, 2);
  assert.equal(leftRight.operator, "+");
  assert.equal(node.children[0].operator, "greaterorequal");
  assert.equal(node.children[0].right.origionalValue, 10);
  assert.equal(node.connective, "and");
});
QUnit.test("ExpressionOperand: brackets parser", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("({a} + {b}) * 2 >= 10", node);
  assert.equal(node.children.length, 1);
  var left = <ExpressionOperand>node.children[0].left;
  var leftLeft = <ExpressionOperand>left.left;
  assert.equal(leftLeft.left.origionalValue, "{a}");
  assert.equal(leftLeft.right.origionalValue, "{b}");
  assert.equal(leftLeft.operator, "+");
  assert.equal(left.right.origionalValue, 2);
  assert.equal(left.operator, "*");
  assert.equal(node.children[0].operator, "greaterorequal");
  assert.equal(node.children[0].right.origionalValue, 10);
  assert.equal(node.connective, "and");
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

QUnit.test("ExpressionOperand: not operator", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("({a} + {b}) * 2 >= 10", node);
  assert.equal(node.isNot, false, "there is no not");
  parser.parse("not(({a} + {b}) * 2 >= 10)", node);
  assert.equal(node.isNot, true, "not is 'not'");
  parser.parse("!(({a} + {b}) * 2 >= 10)", node);
  assert.equal(node.isNot, true, "not is '!'");
});
QUnit.test("ExpressionOperand: not operator 2", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  parser.parse("({a} + {b} >= 10) and !({a} - {b} < 0)", node);
  assert.equal(node.children.length, 2, "there two children");
  assert.equal(node.isNot, false, "there is no not in the root");
  assert.equal(
    node.children[0].isNot,
    false,
    "there is no not in first children"
  );
  assert.equal(node.children[1].isNot, true, "there is not in second children");
});

QUnit.test("ConditionRunner, not operator simple", function(assert) {
  var parser = new ConditionsParser();
  var node = new ConditionNode();
  var runner = new ConditionRunner("not({a} + {b} > 20)");

  var values = { a: 10, b: 20 };
  assert.equal(runner.run(values), false, "10 + 20 > 20");
  values.b = 5;
  assert.equal(runner.run(values), true, "10 + 5 > 20");
});

QUnit.test("ExpressionRunner: (1+2)*3", function(assert) {
  var runner = new ExpressionRunner("(1+2)*3");
  assert.equal(runner.run({}), 9, "(1+2)*3 is 9");
});
QUnit.test("ExpressionRunner: (1+2)*(3+2) / 5", function(assert) {
  var runner = new ExpressionRunner("(1+2)*(3+2) / 5");
  assert.equal(runner.run({}), 3, "(1+2)*(3+2) / 5 is 3");
});
QUnit.test("ExpressionRunner: 10 % 3", function(assert) {
  var runner = new ExpressionRunner("10 % 3");
  assert.equal(runner.run({}), 1, "10 % 3 is 1");
});
QUnit.test("ExpressionRunner: sumInArray", function(assert) {
  var runner = new ExpressionRunner("sumInArray({a}, 'val1')");
  var values = { a: [{ val1: 10 }, { val2: 10 }, { val1: 20 }] };
  assert.equal(runner.run(values), 30, "10 + 20");
});
QUnit.test("ExpressionRunner, iif simple", function(assert) {
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

QUnit.test("ExpressionRunner, iif nested using", function(assert) {
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

QUnit.test("ExpressionRunner, ^ operator", function(assert) {
  var runner = new ExpressionRunner("{a} ^ 3 + {b} ^ 0.5");
  var values = { a: 10, b: 400 };
  assert.equal(runner.run(values), 1020, "10^3 + 400^0.5 = 1000 + 20");
});

QUnit.test("ConditionsParser, report error: Operator expected", function(
  assert
) {
  var parser = new ConditionsParser();
  assert.ok(parser.createCondition("{a} > 5"));
  assert.notOk(parser.error);

  assert.notOk(parser.createCondition("{a} 5"));
  assert.ok(parser.error);
  assert.equal(
    parser.error.code,
    parser.ERROR_OperatorExpected,
    "Error operator is expected"
  );
  assert.equal(parser.error.at, 4, "Error at");
});

QUnit.test("ConditionsParser, report error: Right part is expected", function(
  assert
) {
  var parser = new ConditionsParser();
  assert.notOk(parser.createCondition("{a} >"));
  assert.ok(parser.error);
  assert.equal(
    parser.error.code,
    parser.ERROR_RightPartExpected,
    "Right expression is expected"
  );
  assert.equal(parser.error.at, 5, "Error at");
});

QUnit.test("ConditionsParser, report error: Expression is expected", function(
  assert
) {
  var parser = new ConditionsParser();
  assert.notOk(parser.createCondition("{a} > 1 and"));
  assert.ok(parser.error);
  assert.equal(
    parser.error.code,
    parser.ERROR_ExpressionExpected,
    "Expression is expected"
  );
  assert.equal(parser.error.at, 11, "Error at");
});

QUnit.test("ConditionsParser, report error: End is  expected", function(
  assert
) {
  var parser = new ConditionsParser();
  assert.notOk(parser.createCondition("({a} > 1))"));
  assert.ok(parser.error);
  assert.equal(parser.error.code, parser.ERROR_EndExpected, "Endd is expected");
  assert.equal(parser.error.at, 9, "Error at");
});

QUnit.test("ConditionsParser, parse array successfully", function(assert) {
  var parser = new ConditionsParser();
  assert.ok(parser.createCondition("{a} = ['item1', 'item2']"));
  assert.notOk(parser.error, "There is no errors");
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

QUnit.test("Get variables in expression", function(assert) {
  var parser = new ConditionsParser();
  var node = parser.createCondition(
    "{val1} - {val2} + myFunc({val3}, {val4.prop}) < {val5} and {val6}=1"
  );
  var vars = node.getVariables();
  assert.equal(vars.length, 6, "There are 6 variables in expression");
  assert.equal(vars[0], "val1", "the first variable");
  assert.equal(vars[5], "val6", "the last variable");
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
  "ExpressionRunner: 7 * (({q1} * 0.4) + ({q2} * 0.6)), bug# 1423",
  function(assert) {
    var runner = new ExpressionRunner("7 * ((10 * 0.4) + (20 * 0.6))");
    assert.equal(
      runner.run({}),
      7 * (4 + 12),
      "7 * ((10 * 0.4) + (20 * 0.6)) is 112"
    );
  }
);
