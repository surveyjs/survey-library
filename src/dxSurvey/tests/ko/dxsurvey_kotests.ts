/// <reference path="../../sources/base.ts" />
/// <reference path="../../sources/survey.ts" />
/// <reference path="../../sources/question.ts" />
/// <reference path="../../sources/page.ts" />
/// <reference path="../../sources/question_baseselect.ts" />
/// <reference path="../../sources/question_checkbox.ts" />
/// <reference path="../../sources/question_matrix.ts" />
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
        question.koValue(question.otherItem.value);
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
        question.koValue.push(question.otherItem.value);
        assert.equal(question.koOtherVisible(), true, "Other visible is true after selecting it");
        question.koValue.pop();
        assert.equal(question.koOtherVisible(), false, "Other visible is true after selecting it");
    });
    QUnit.test("Update koValue on changing data in Survey or Question.value ", function (assert) {
        var survey = new Survey();
        survey.setValue("textQuestion", "initialValue");
        var page = survey.addNewPage("my page");
        var question = page.addNewQuestion("text", "textQuestion");
        assert.equal(question.koValue(), "initialValue", "get initial value");
        question.value = "setFromValue";
        assert.equal(question.koValue(), "setFromValue", "set from question value");
        survey.setValue("textQuestion", "setFromSurvey");
        assert.equal(question.koValue(), "setFromSurvey", "set from survey");
    });
    QUnit.test("Update koValue on changing data in Survey or Question.value for Multiple Answer Question ", function (assert) {
        var survey = new Survey();
        survey.setValue("checkboxQuestion", "initialValue");
        var page = survey.addNewPage("my page");
        var question = page.addNewQuestion("checkbox", "checkboxQuestion");
        assert.deepEqual(question.koValue(), ["initialValue"], "get initial value");
        question.value = "setFromValue";
        assert.deepEqual(question.koValue(), ["setFromValue"], "set from question value");
        survey.setValue("checkboxQuestion", "setFromSurvey");
        assert.deepEqual(question.koValue(), ["setFromSurvey"], "set from survey");
    });
    QUnit.test("Question Matrix: koValue in MatrixValue", function (assert) {
        var matrix = new QuestionMatrix("q1");
        matrix.rows = ["row1", "row2"];
        matrix.columns = ["col1", "col2"];
        matrix.value = { row1: "col2" };
        var visibleRows = matrix.visibleRows;
        assert.equal(visibleRows[0].koValue(), "col2", "set the corerect value");
        visibleRows[0].koValue("col1");
        visibleRows[1].koValue("col2");
        assert.deepEqual(matrix.value, { row1: "col1", row2: "col2" }, "the matrix value changed correctly");
    });
    QUnit.test("Set notification on setting survey data", function (assert) {
        var survey = new Survey();
        var page = survey.addNewPage("page1");
        var question = page.addNewQuestion("text", "q1");
        question.koValue("value1");
        survey.data = [{ "q1": "value2" }];
        assert.equal(survey.getValue("q1"), "value2", "survey data for q1");
        assert.equal(question.koValue(), "value2", "knockout value is updated.");
    });
    QUnit.test("koVisible property", function (assert) {
        var survey = new Survey();
        var page = survey.addNewPage("page1");
        var question = page.addNewQuestion("text", "q1");
        assert.equal(question.koVisible(), true, "it is true by default");
        question.visible = false;
        assert.equal(question.koVisible(), false, "it is false now");
    });

}