/// <reference path="../src/base.ts" />
/// <reference path="../src/conditions.ts" />
/// <reference path="../src/conditionsParser.ts" />
module Survey.Tests {
    QUnit.module("Conditions");

    class ConditionData implements ISurveyData {
        private values: HashTable<any> = {};
        constructor() {
        }    
        public getValue(name: string): any { return this.values[name]; }
        public setValue(name: string, newValue: any) {
            this.values[name] = newValue;
        }
        public getComment(name: string): string { return null;  }
        public setComment(name: string, newValue: string) {
            //do nothing
        }
    }

    QUnit.test("Condition", function (assert) {
        var op = new Condition();
        op.right = 5;
        op.left = 5; assert.equal(op.perform(), true, "equal: 5 == 5");
        op.left = 3; assert.equal(op.perform(), false, "equal: 3 != 5");
        op.operator = "notequal";
        op.left = 5; assert.equal(op.perform(), false, "notequal: 5 == 5");
        op.left = 3; assert.equal(op.perform(), true, "notequal: 3 != 5");
        op.operator = "empty";
        op.left = null; assert.equal(op.perform(), true, "empty: null");
        op.left = 1; assert.equal(op.perform(), false, "empty: 1");
        op.operator = "notempty";
        op.left = null; assert.equal(op.perform(), false, "notempty: null");
        op.left = 1; assert.equal(op.perform(), true, "notempty: 1");
        op.operator = "contains";
        op.right = 3;
        op.left = [1, 2, 3, 4, 5]; assert.equal(op.perform(), true, "contains: 3 from [1, 2, 3, 4, 5]");
        op.left = [1, 2, 4, 5]; assert.equal(op.perform(), false, "contains: 3 from [1, 2, 4, 5]");
        op.operator = "notcontains";
        op.left = [1, 2, 3, 4, 5]; assert.equal(op.perform(), false, "notcontains: 3 from [1, 2, 3, 4, 5]");
        op.left = [1, 2, 4, 5]; assert.equal(op.perform(), true, "notcontains: 3 from [1, 2,  4, 5]");
        op.operator = "greater";
        op.right = 4;
        op.left = 5; assert.equal(op.perform(), true, "greater: 5 > 4");
        op.left = 3; assert.equal(op.perform(), false, "greater: 3 > 4");
        op.operator = "less";
        op.left = 5; assert.equal(op.perform(), false, "less: 5 < 4");
        op.left = 3; assert.equal(op.perform(), true, "less: 3 < 4");
        op.operator = "greaterorequal";
        op.left = 4; assert.equal(op.perform(), true, "orequal: 4 >= 4");
        op.left = 3; assert.equal(op.perform(), false, "orequal: 3 >= 4");
        op.operator = "lessorequal";
        op.left = 5; assert.equal(op.perform(), false, "lessorequal: 4 <= 5");
        op.left = 4; assert.equal(op.perform(), true, "less: 4 <= 4");
    });
    QUnit.test("Condition with quotes", function (assert) {
        var op = new Condition();
        op.left = "yes";
        op.right = "'yes'";
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
        assert.equal(node.children[0].left, "a");
        assert.equal(node.children[0].operator, "greater");
        assert.equal(node.children[0].right, 2);
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
        assert.equal(node.children[0].left, "5");
        assert.equal(node.children[0].operator, "greater");
        assert.equal(node.children[0].right, 2);
        assert.equal(node.connective, "and");
    });
    QUnit.test("Condition: two items or", function (assert) {
        var parser = new ConditionsParser();
        var node = new ConditionNode();
        parser.parse("'a' = 1 or 'b' = 2", node);
        assert.equal(node.children.length, 2);
        assert.equal(node.connective, "or");
        assert.equal(node.children[0].left, "a");
        assert.equal(node.children[0].operator, "equal");
        assert.equal(node.children[0].right, 1);
        assert.equal(node.children[1].left, "b");
        assert.equal(node.children[1].operator, "equal");
        assert.equal(node.children[1].right, 2);
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
        assert.equal(left.children[0].left, "a");
        assert.equal(left.children[0].operator, "equal");
        assert.equal(left.children[0].right, 1);
        assert.equal(left.children[1].left, "b");
        assert.equal(left.children[1].operator, "equal");
        assert.equal(left.children[1].right, 2);
        var right = node.children[1];
        assert.equal(right.children.length, 1);
        assert.equal(right.connective, "and");
        assert.equal(right.children[0].left, "c");
        assert.equal(right.children[0].operator, "equal");
        assert.equal(right.children[0].right, 3);
    });
    QUnit.test("Condition: a and (b or c)", function (assert) {
        var parser = new ConditionsParser();
        var node = new ConditionNode();
        parser.parse("'a' = 1 and('b' = 2 or 'c' = 3)", node);
        assert.equal(node.children.length, 2);
        assert.equal(node.connective, "and");
        var left = node.children[0];
        assert.equal(left.left, "a");
        assert.equal(left.operator, "equal");
        assert.equal(left.right, 1);
        var right = node.children[1];
        assert.equal(right.children.length, 2);
        assert.equal(right.connective, "or");
        assert.equal(right.children[0].left, "b");
        assert.equal(right.children[0].operator, "equal");
        assert.equal(right.children[0].right, 2);
        assert.equal(right.children[1].left, "c");
        assert.equal(right.children[1].operator, "equal");
        assert.equal(right.children[1].right, 3);
    });
    QUnit.test("Run one condition", function (assert) {
        var runner = new ConditionRunner("'a' > 5");
        var values = { a: 6 };
        assert.equal(runner.run(values), true, "6 > 5");
        values = { a: 5 };
        assert.equal(runner.run(values), false, "5 > 5");
    });
    QUnit.test("Run complex condition", function (assert) {
        var runner = new ConditionRunner("'age' >= 21 and ('sex' = 'male' or 'kids' > 1)");
        var values = { age: 21, sex: 'male', kids: 1 };
        assert.equal(runner.run(values), true, "21 >= 21 and (male = male or 1 > 1");
        var values = { age: 21, sex: 'female', kids: 1 };
        assert.equal(runner.run(values), false, "21 >= 21 and (male = female or 1 > 1");
        var values = { age: 21, sex: 'female', kids: 2 };
        assert.equal(runner.run(values), true, "21 >= 21 and (male = female or 2 > 1");
        var values = { age: 20, sex: 'male', kids: 2 };
        assert.equal(runner.run(values), false, "20 >= 21 and (male = male or 2 > 1");
    });
    QUnit.test("Expression Tree to Text", function (assert) {
        var parser = new ConditionsParser();
        var node = new ConditionNode();
        parser.parse("'age' >= 21 and ('sex' = 'male' or 'kids' > 1)", node);
        assert.equal(parser.toString(node), "'age' >= 21 and ('sex' = 'male' or 'kids' > 1)");
    });
}