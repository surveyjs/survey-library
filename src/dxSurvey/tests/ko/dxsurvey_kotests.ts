/// <reference path="../../sources/base.ts" />
/// <reference path="../../sources/question.ts" />
/// <reference path="../../sources/question_baseselect.ts" />
/// <reference path="../../sources/question_checkbox.ts" />
module dxSurvey.koTests {
    QUnit.module("koTests");

    QUnit.test("Super stable test", function (assert) {
        assert.equal(1 + 1, 2, "This should usually pass");
    });
    QUnit.test("Set value through observable value", function (assert) {
        var question = new Question("q");
        question.koValue("test");
        assert.equal(question.value, "test", "value is set correctly.");
    });
    QUnit.test("koOtherVisible for one choice items", function (assert) {
        var question = new QuestionSelectBase("q");
        assert.equal(question.koOtherVisible(), false, "Initially is not visible");
        question.koValue(question.otherString);
        assert.equal(question.koOtherVisible(), true, "Other visible is true after selecting it");
    });
    QUnit.test("Create koValue as observable array for checkbox", function (assert) {
        var question = new QuestionCheckbox("q");
        question.koValue.push("test1");
        question.koValue.push("test2");
        assert.deepEqual(question.koValue(), ["test1", "test2"], "koValue is observable array");
        assert.deepEqual(question.value, ["test1", "test2"], "value is set correctly.");
    });
    QUnit.test("koOtherVisible for multi choice items", function (assert) {
        var question = new QuestionCheckbox("q");
        assert.equal(question.koOtherVisible(), false, "Initially is not visible");
        question.koValue.push("test1");
        question.koValue.push(question.otherString);
        assert.equal(question.koOtherVisible(), true, "Other visible is true after selecting it");
        question.koValue.pop();
        assert.equal(question.koOtherVisible(), false, "Other visible is true after selecting it");
    });


}