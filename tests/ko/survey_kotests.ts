/// <reference path="../../src/base.ts" />
/// <reference path="../../src/survey.ts" />
/// <reference path="../../src/knockout/kosurvey.ts" />
/// <reference path="../../src/knockout/standard/kosurveystandard.ts" />
/// <reference path="../../src/knockout/kopage.ts" />
/// <reference path="../../src/question.ts" />
/// <reference path="../../src/page.ts" />
/// <reference path="../../src/question_baseselect.ts" />
/// <reference path="../../src/knockout/koquestion_checkbox.ts" />
/// <reference path="../../src/knockout/koquestion_matrix.ts" />
/// <reference path="../../src/knockout/koquestion_matrixdropdown.ts" />
/// <reference path="../../src/knockout/koquestion_dropdown.ts" />
/// <reference path="../../src/knockout/koquestion_multipletext.ts" />
/// <reference path="../../src/knockout/koquestion_text.ts" />
module SurveykoTests {
    QUnit.module("koTests");

    QUnit.test("Survey.koCurrentPage", function (assert) {
        var survey = new Survey.Survey();
        survey.addPage(createPageWithQuestion("Page 1"));
        survey.addPage(createPageWithQuestion("Page 2"));
        survey.addPage(createPageWithQuestion("Page 3"));
        assert.equal(survey.currentPage, survey.pages[0], "the first page is current");
        assert.equal(survey.koCurrentPage(), survey.currentPage, "ko current page is equal");
        assert.equal(survey.koIsFirstPage(), true, "is first page");
        assert.equal(survey.koIsLastPage(), false, "is first page");
        survey.nextPage();
        assert.equal(survey.koCurrentPage(), survey.pages[1], "ko current page is equal");
        assert.equal(survey.koIsFirstPage(), false, "is second page");
        assert.equal(survey.koIsLastPage(), false, "is second page");
        survey.nextPage();
        assert.equal(survey.koCurrentPage(), survey.pages[2], "ko current page is equal");
        assert.equal(survey.koIsFirstPage(), false, "is last page");
        assert.equal(survey.koIsLastPage(), true, "is last page");
    });
    QUnit.test("Set value through observable value", function (assert) {
        var question = new Survey.QuestionText("q");
        question["koValue"]("test");
        assert.equal(question.value, "test", "value is set correctly.");
    });
    QUnit.test("koOtherVisible for one choice items", function (assert) {
        var question = new Survey.QuestionDropdown("q");
        assert.equal(question["koOtherVisible"](), false, "Initially is not visible");
        question["koValue"](question.otherItem.value);
        assert.equal(question["koOtherVisible"](), true, "Other visible is true after selecting it");
    });
    QUnit.test("Create koValue as observable array for checkbox", function (assert) {
        var question = new Survey.QuestionCheckbox("q");
        question["koValue"].push("test1");
        question["koValue"].push("test2");
        assert.deepEqual(question["koValue"](), ["test1", "test2"], "koValue is observable array");
        assert.deepEqual(question.value, ["test1", "test2"], "value is set correctly.");
    });
    QUnit.test("Default value for checkbox", function (assert) {
        var survey = new Survey.Survey();
        survey.addNewPage("p1");
        var question = new Survey.QuestionCheckbox("q");
        survey.pages[0].addQuestion(question);
        assert.deepEqual(question["koValue"](), [], "the koValue by default should be empty array");
    });
    QUnit.test("koOtherVisible for multi choice items", function (assert) {
        var question = new Survey.QuestionCheckbox("q");
        assert.equal(question["koOtherVisible"](), false, "Initially is not visible");
        question["koValue"].push("test1");
        question["koValue"].push(question.otherItem.value);
        assert.equal(question["koOtherVisible"](), true, "Other visible is true after selecting it");
        question["koValue"].pop();
        assert.equal(question["koOtherVisible"](), false, "Other visible is true after selecting it");
    });
    QUnit.test("Update koValue on changing data in Survey or Question.value ", function (assert) {
        var survey = new Survey.Survey();
        survey.setValue("textQuestion", "initialValue");
        var page = survey.addNewPage("my page");
        var question = <Survey.Question>page.addNewQuestion("text", "textQuestion");
        assert.equal(question["koValue"](), "initialValue", "get initial value");
        question.value = "setFromValue";
        assert.equal(question["koValue"](), "setFromValue", "set from question value");
        survey.setValue("textQuestion", "setFromSurvey");
        assert.equal(question["koValue"](), "setFromSurvey", "set from survey");
    });
    QUnit.test("Update koValue on changing data in Survey or Question.value for Multiple Answer Question ", function (assert) {
        var survey = new Survey.Survey();
        survey.setValue("checkboxQuestion", "initialValue");
        var page = survey.addNewPage("my page");
        var question = <Survey.Question>page.addNewQuestion("checkbox", "checkboxQuestion");
        assert.deepEqual(question["koValue"](), ["initialValue"], "get initial value");
        question.value = "setFromValue";
        assert.deepEqual(question["koValue"](), ["setFromValue"], "set from question value");
        survey.setValue("checkboxQuestion", "setFromSurvey");
        assert.deepEqual(question["koValue"](), ["setFromSurvey"], "set from survey");
    });
    QUnit.test("Question Matrix: koValue in MatrixValue", function (assert) {
        var matrix = new Survey.QuestionMatrix("q1");
        matrix.rows = ["row1", "row2"];
        matrix.columns = ["col1", "col2"];
        matrix.value = { row1: "col2" };
        var visibleRows = matrix.visibleRows;
        assert.equal(visibleRows[0]["koValue"](), "col2", "set the correct value");
        visibleRows[0]["koValue"]("col1");
        visibleRows[1]["koValue"]("col2");
        assert.deepEqual(matrix.value, { row1: "col1", row2: "col2" }, "the matrix value changed correctly");
    });
    QUnit.test("Question Matrix: change matrix value after visibleRows generation", function (assert) {
        var matrix = new Survey.QuestionMatrix("q1");
        matrix.rows = ["row1", "row2"];
        matrix.columns = ["col1", "col2"];
        var visibleRows = matrix.visibleRows;
        matrix.value = { row1: "col2" };
        assert.equal(visibleRows[0]["koValue"](), "col2", "set the correct value");
    });
    QUnit.test("Question MatrixDropdown: change matrix value after visibleRows generation", function (assert) {
        var matrix = new Survey.QuestionMatrixDropdown("q1");
        matrix.rows = ["row1", "row2", "row3"];
        matrix.columns.push(new Survey.MatrixDropdownColumn("column1"));
        matrix.columns.push(new Survey.MatrixDropdownColumn("column2"));
        matrix.choices = [1, 2, 3];
        matrix.columns[1].choices = [4, 5];
        var visibleRows = matrix.visibleRows;
        matrix.value = { 'row2': { 'column1': 2 } };
        assert.equal(visibleRows[1].cells[0].question["koValue"](), 2, "value was set");
    });

    QUnit.test("Question MultipleText: koValue in TextItem", function (assert) {
        var mQuestion = new Survey.QuestionMultipleText("q1");
        mQuestion.items.push(new Survey.MultipleTextItem("i1"));
        mQuestion.items.push(new Survey.MultipleTextItem("i2"));
        mQuestion.value = { i1: 10 };
        assert.equal(mQuestion.items[0]["koValue"](), 10, "set the correct value to item.koValue from question");
        mQuestion.items[0]["koValue"](20);
        assert.equal(mQuestion.items[0]["koValue"](), 20, "set the correct value to item.koValue from question item");
        assert.deepEqual(mQuestion.value, { i1: 20 }, "set the correct value to question.Value from question item");
        mQuestion.value = null;
        assert.equal(mQuestion.items[0]["koValue"](), null, "empty the value");
    });
    QUnit.test("Question MultipleText: koRows", function (assert) {
        var mQuestion = new Survey.QuestionMultipleText("q1");
        mQuestion.items.push(new Survey.MultipleTextItem("i1"));
        mQuestion.items.push(new Survey.MultipleTextItem("i2"));
        mQuestion.colCount = 2;
        assert.equal(mQuestion["koRows"]().length, 1, "just one row");
        assert.equal(mQuestion["koRows"]()[0].length, 2, "two items in one row");
        mQuestion.colCount = 1;
        assert.equal(mQuestion["koRows"]().length, 2, "two rows now");
        assert.equal(mQuestion["koRows"]()[0].length, 1, "just one item in the first row");
    });
    QUnit.test("Set notification on setting survey data", function (assert) {
        var survey = new Survey.Survey();
        var page = survey.addNewPage("page1");
        var question = page.addNewQuestion("text", "q1");
        question["koValue"]("value1");
        survey.data = { "q1": "value2" };
        assert.equal(survey.getValue("q1"), "value2", "survey data for q1");
        assert.equal(question["koValue"](), "value2", "knockout value is updated.");
    });
    QUnit.test("On make survey data empy for Multiple text question", function (assert) {
        var survey = new Survey.Survey();
        var page = survey.addNewPage("page1");
        var question = new Survey.QuestionMultipleText("q1");
        page.addQuestion(question);
        question.items.push(new Survey.MultipleTextItem("i1"));
        question.items.push(new Survey.MultipleTextItem("i2"));
        question.value = { i1: 10 };
        survey.data = null;
        assert.equal(question.items[0]["koValue"](), null, "Make the data empty");
    });
    QUnit.test("koVisible property", function (assert) {
        var survey = new Survey.Survey();
        var page = survey.addNewPage("page1");
        var question = page.addNewQuestion("text", "q1");
        assert.equal(question["koVisible"](), true, "it is true by default");
        question.visible = false;
        assert.equal(question["koVisible"](), false, "it is false now");
    });
    QUnit.test("koComment property", function (assert) {
        var survey = new Survey.Survey();
        survey.data = { q: "other", "q-Comment": "aaaa" };
        var page = survey.addNewPage("page1");
        var question = new Survey.QuestionDropdown("q");
        page.addQuestion(question);
        question.choices = ["A", "B", "C", "D"];
        assert.equal(question["koComment"](), "aaaa", "Set ko Comment");
    });
    function createPageWithQuestion(name: string): Survey.Page {
        var page = new Survey.Page(name);
        page.addNewQuestion("text", "q1");
        return page;
    }
}