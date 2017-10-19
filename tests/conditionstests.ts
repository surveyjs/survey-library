import {ConditionsParser} from "../src/conditionsParser";
import {Operand, Condition, ConditionNode, ConditionRunner} from "../src/conditions";

export default QUnit.module("Conditions");

QUnit.test("Condition", function (assert) {
    var op = new Condition();
    op.right = new Operand(5);
    op.left = new Operand(5); assert.equal(op.perform(), true, "equal: 5 == 5");
    op.left = new Operand(3); assert.equal(op.perform(), false, "equal: 3 != 5");
    op.operator = "notequal";
    op.left = new Operand(5); assert.equal(op.perform(), false, "notequal: 5 == 5");
    op.left = new Operand(3); assert.equal(op.perform(), true, "notequal: 3 != 5");
    op.operator = "empty";
    op.left = null; assert.equal(op.perform(), true, "empty: null");
    op.left = new Operand(1); assert.equal(op.perform(), false, "empty: 1");
    op.operator = "notempty";
    op.left = null; assert.equal(op.perform(), false, "notempty: null");
    op.left = new Operand(1); assert.equal(op.perform(), true, "notempty: 1");
    op.operator = "contains";
    op.right = new Operand(3);
    op.left = new Operand([1, 2, 3, 4, 5]); assert.equal(op.perform(), true, "contains: 3 from [1, 2, 3, 4, 5]");
    op.left = new Operand([1, 2, 4, 5]); assert.equal(op.perform(), false, "contains: 3 from [1, 2, 4, 5]");
    op.operator = "*=";
    op.left = new Operand([1, 2, 3, 4, 5]); assert.equal(op.perform(), true, "contains: 3 from [1, 2, 3, 4, 5]");
    op.left = new Operand([1, 2, 4, 5]); assert.equal(op.perform(), false, "contains: 3 from [1, 2, 4, 5]");
    op.operator = "notcontains";
    op.left = new Operand([1, 2, 3, 4, 5]); assert.equal(op.perform(), false, "notcontains: 3 from [1, 2, 3, 4, 5]");
    op.left = new Operand([1, 2, 4, 5]); assert.equal(op.perform(), true, "notcontains: 3 from [1, 2,  4, 5]");
    op.operator = "greater";
    op.right = new Operand(4);
    op.left = new Operand(5); assert.equal(op.perform(), true, "greater: 5 > 4");
    op.left = new Operand(3); assert.equal(op.perform(), false, "greater: 3 > 4");
    op.operator = "less";
    op.left = new Operand(5); assert.equal(op.perform(), false, "less: 5 < 4");
    op.left = new Operand(3); assert.equal(op.perform(), true, "less: 3 < 4");
    op.operator = "greaterorequal";
    op.left = new Operand(4); assert.equal(op.perform(), true, "orequal: 4 >= 4");
    op.left = new Operand(3); assert.equal(op.perform(), false, "orequal: 3 >= 4");
    op.operator = "lessorequal";
    op.left = new Operand(5); assert.equal(op.perform(), false, "lessorequal: 4 <= 5");
    op.left = new Operand(4); assert.equal(op.perform(), true, "less: 4 <= 4");
});

QUnit.test("Condition with quotes", function (assert) {
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

QUnit.test("Parse item conditions", function (assert) {
    //equal
    assert.ok(checkItemCondition("=", "equal"), "= is equal");
    assert.ok(checkItemCondition("==", "equal"), "== is equal");
    assert.ok(checkItemCondition(" Equal ", "equal"), "equal is equal");
    //not equal
    assert.ok(checkItemCondition("<>", "notequal"), "<> is notequal");
    assert.ok(checkItemCondition("!=", "notequal"), "!= is notequal");
    assert.ok(checkItemCondition(" NotEqual ", "notequal"), "NotEqual is notequal");
    //greater
    assert.ok(checkItemCondition(">", "greater"), "> is greater");
    assert.ok(checkItemCondition(" Greater ", "greater"), "Greater is greater");
    //less
    assert.ok(checkItemCondition("<", "less"), "< is less");
    assert.ok(checkItemCondition(" Less ", "less"), "Less is less");
    //greaterorequal
    assert.ok(checkItemCondition(">=", "greaterorequal"), ">= is greaterorequal");
    assert.ok(checkItemCondition("=>", "greaterorequal"), "=> is greaterorequal");
    assert.ok(checkItemCondition(" GreaterOrEqual ", "greaterorequal"), "GreaterorEqual is greaterorequal");
    //lessorequal
    assert.ok(checkItemCondition("<=", "lessorequal"), "<= is lessorequal");
    assert.ok(checkItemCondition("=<", "lessorequal"), "=< is lessorequal");
    assert.ok(checkItemCondition(" LessOrEqual ", "lessorequal"), "LessOrEqual is lessorequal");
    //contains
    assert.ok(checkItemCondition(" Contains ", "contains"), "Contains is contains");
    assert.ok(checkItemCondition(" contain ", "contains"), "contain is contains");
    //notcontains
    assert.ok(checkItemCondition(" NotContains ", "notcontains"), "NotContains is notcontains");
    assert.ok(checkItemCondition(" NotContain ", "notcontains"), "NotContain is notcontains");
});

QUnit.test("Condition: on item", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    parser.parse("'a' > 2", node);
    assert.equal(node.children.length, 1);
    assert.equal(node.children[0].left.origionalValue, "a");
    assert.equal(node.children[0].operator, "greater");
    assert.equal(node.children[0].right.origionalValue, 2);
    assert.equal(node.connective, "and");
});

QUnit.test("Condition: without right condition", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    assert.ok(parser.parse("'a' empty", node), "empty");
    assert.ok(parser.parse("'a' notempty", node), "notempty");
});

QUnit.test("Condition: on item - no spaces", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    parser.parse("5>2", node);
    assert.equal(node.children.length, 1);
    assert.equal(node.children[0].left.origionalValue, "5");
    assert.equal(node.children[0].operator, "greater");
    assert.equal(node.children[0].right.origionalValue, 2);
    assert.equal(node.connective, "and");
});

QUnit.test("Condition: on item - string value and name has spaces", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    parser.parse("'my question'<>'this first value'", node);
    assert.equal(node.children.length, 1);
    assert.equal(node.children[0].left.origionalValue, "my question");
    assert.equal(node.children[0].operator, "notequal");
    assert.equal(node.children[0].right.origionalValue, "this first value");
    assert.equal(node.connective, "and");
});

QUnit.test("Condition: two items or", function (assert) {
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

QUnit.test("Condition: a and b or c", function (assert) {
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

QUnit.test("Condition: a and (b or c)", function (assert) {
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

QUnit.test("Condition: function without parameters", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    parser.parse("currentYear() = 2000", node);
    assert.equal(node.children.length, 1);
    assert.equal(node.children[0].left.origionalValue, "currentYear");
    assert.equal(node.children[0].left.parameters.length, 0, "function without parameters");
    assert.equal(node.children[0].operator, "equal");
    assert.equal(node.children[0].right.origionalValue, 2000);
    assert.equal(node.connective, "and");
});
QUnit.test("Condition: function with parameters", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    parser.parse("concat('a', {b},3) = 'ac'", node);
    assert.equal(node.children.length, 1);
    var left = node.children[0].left;
    assert.equal(left.origionalValue, "concat");
    assert.equal(left.parameters.length, 3, "function with 3 parameters");
    assert.equal(left.parameters[0].origionalValue, "a", "the first parameter");
    assert.equal(left.parameters[1].origionalValue, "{b}", "the second parameter");
    assert.equal(left.parameters[2].origionalValue, 3, "the third parameter");
    assert.equal(node.children[0].operator, "equal");
    assert.equal(node.children[0].right.origionalValue, "ac");
    assert.equal(node.connective, "and");
});
QUnit.test("Condition: nested functions", function (assert) {
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

QUnit.test("Condition: (a and b) or (c and d)", function (assert) {
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

QUnit.test("Parse condition from #303", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    parser.parse("({question-fruit} = 'fruit-apple' and {question-apple-variety} = 'apple-variety-red-delicious') or ({question-fruit} = 'fruit-orange' and {question-orange-variety} = 'orange-variety-blood')", node);
    assert.equal(node.children.length, 2);
    assert.equal(node.connective, "or");
    var left = node.children[0];
    var right = node.children[1];
});

QUnit.test("Run one condition", function (assert) {
    var runner = new ConditionRunner("{a} > 5");
    var values = { a: 6 };
    assert.equal(runner.run(values), true, "6 > 5");
    values = { a: 5 };
    assert.equal(runner.run(values), false, "5 > 5");
    var values2 = { b: 5 };
    assert.equal(runner.run(values2), false, "undefined > 5");

});

QUnit.test("Run complex condition", function (assert) {
    var runner = new ConditionRunner("{age} >= 21 and ({sex} = 'male' or {kids} > 1)");
    var values = { age: 21, sex: 'male', kids: 1 };
    assert.equal(runner.run(values), true, "21 >= 21 and (male = male or 1 > 1");
    var values = { age: 21, sex: 'female', kids: 1 };
    assert.equal(runner.run(values), false, "21 >= 21 and (male = female or 1 > 1)");
    var values = { age: 21, sex: 'female', kids: 2 };
    assert.equal(runner.run(values), true, "21 >= 21 and (male = female or 2 > 1)");
    var values = { age: 20, sex: 'male', kids: 2 };
    assert.equal(runner.run(values), false, "20 >= 21 and (male = male or 2 > 1)");
});

QUnit.test("Run condition with nested properties", function (assert) {
    var runner = new ConditionRunner("{age.min} >= 35 and ({age.max} <= 80");
    var values = { age: { min: 36, max: 40 } };
    assert.equal(runner.run(values), true, "min > 35 max < 80");
    values.age.min = 21;
    assert.equal(runner.run(values), false, "min < 35 max < 80");
});

QUnit.test("Condition check #303", function (assert) {
    var runner = new ConditionRunner("({question-fruit} = 'fruit-apple' and {question-apple-variety} = 'apple-variety-red-delicious') or ({question-fruit} = 'fruit-orange' and {question-orange-variety} = 'orange-variety-blood')");
    var values = {  };
    assert.equal(runner.run(values), false, "nothing was set");
    values = {"question-fruit": "fruit-apple", "question-apple-variety":"apple-variety-red-delicious"};
    assert.equal(runner.run(values), true, "The first part is correct");
    values["question-fruit"] = "fruit-orange";
    assert.equal(runner.run(values), false, "the value is incorrect");
    values["question-orange-variety"] = "orange-variety-blood";
    assert.equal(runner.run(values), true, "The second part is correct");
});

QUnit.test("Condition check empty for undefined variables #323", function (assert) {
    var runner = new ConditionRunner("{var1} empty");
    var values = {  };
    assert.equal(runner.run(values), true, "it is empty");
    values = {var1 : 1};
    assert.equal(runner.run(values), false, "it is not empty");
});

QUnit.test("Condition check for undefined variables #323", function (assert) {
    var runner = new ConditionRunner("{var1} < 3 or {var1} empty");
    var values = {  };
    assert.equal(runner.run(values), true, "empty should work");
    values = {var1 : 1};
    assert.equal(runner.run(values), true, "1 < 3");
    values = {var1 : 5};
    assert.equal(runner.run(values), false, "5 > 3");
});

QUnit.test("Expression Tree to Text", function (assert) {
    var parser = new ConditionsParser();
    var node = new ConditionNode();
    parser.parse("'age' >= 21 and ('sex' = 'male' or 'kids' > 1)", node);
    assert.equal(parser.toString(node), "'age' >= 21 and ('sex' = 'male' or 'kids' > 1)");
});

QUnit.test("Check non equal, #377", function (assert) {
    var runner = new ConditionRunner("{var1} != 3");
    var values = {  };
    assert.equal(runner.run(values), true, "empty should give true");
    values = {var1 : 1};
    assert.equal(runner.run(values), true, "1 != 3");
    values = {var1 : 3};
    assert.equal(runner.run(values), false, "3 == 3");
});

QUnit.test("Condition check for undefined #518", function (assert) {
    var runner = new ConditionRunner("{var1} == undefined");
    var values = {  };
    assert.equal(runner.run(values), true, "undefined should work");
    values = { var1: undefined };
    assert.equal(runner.run(values), true, "undefined should work");
    values = { var1: 'a' };
    assert.equal(runner.run(values), false, "string is not undefined");

    runner = new ConditionRunner("{var1} != undefined");
    values = {  };
    assert.equal(runner.run(values), false, "undefined should work");
    values = { var1: undefined };
    assert.equal(runner.run(values), false, "undefined should work");
    values = { var1: 'a' };
    assert.equal(runner.run(values), true, "string is not undefined");
});

QUnit.test("Run sum function", function (assert) {
    var runner = new ConditionRunner("sum({var1},{var2}) == 5");
    var values = { var1: 2, var2: 3};
    assert.equal(runner.run(values), true, "true, 2 + 3 == 5");
    values.var1 = 1;
    assert.equal(runner.run(values), false, "false, 1 + 3 == 5");
});

QUnit.test("Run age function", function (assert) {
    var runner = new ConditionRunner("age({bithday}) >= 21");
    var values = { bithday: new Date(1974, 1, 1)};
    assert.equal(runner.run(values), true, "true, bithday of 1974 >= 21");
    var curDate = new Date(Date.now());
    values.bithday = new Date(curDate.getFullYear() - 10, 1, 1);
    assert.equal(runner.run(values), false, "false, the person is 10 years old");
});

QUnit.test("Support true/false constants, #643", function (assert) {
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
