/// <reference path="../sources/jsonobject.ts" />
/// <reference path="../sources/survey.ts" />
/// <reference path="../sources/page.ts" />
/// <reference path="../sources/question.ts" />
/// <reference path="../sources/question_baseselect.ts" />
/// <reference path="../sources/question_text.ts" />
/// <reference path="../sources/question_checkbox.ts" />
/// <reference path="../sources/questionfactory.ts" />
module dxSurvey.SerializationTests {
    QUnit.module("dxSurveySerialization");

    QUnit.test("Serialize two pages", function (assert) {
        var survey = new Survey();
        survey.addNewPage("Page 1");
        survey.addNewPage("Page 2");
        var jsObj = new dxSurvey.JsonObject().toJsonObject(survey);
        assert.equal(JSON.stringify(jsObj), "{\"pages\":[{\"name\":\"Page 1\"},{\"name\":\"Page 2\"}]}", "serialize two pages");
    });
    QUnit.test("Deserialize two pages", function (assert) {
        var survey = new Survey();
        new dxSurvey.JsonObject().toObject({ "pages": [{ "name": "Page1" }, { "name": "Page2" }] }, survey);
        assert.equal(survey.pages.length, 2, "Two pages from json");
        assert.equal(survey.pages[0].name, "Page1", "property name is set");
        assert.equal(survey.pages[0].data, survey, "data interface is set");
        assert.equal(survey.pages[1].getType(), "page", "it is a live object");
    });
    QUnit.test("Serialize two questions", function (assert) {
        var page = new Page("Page1");
        var textQuestion = new QuestionText("textQuestion");
        textQuestion.isRequired = true;
        var checkBoxQuestion = new QuestionCheckbox("checkboxQuestion");
        checkBoxQuestion.choices = ["red", "white"];
        checkBoxQuestion.isRequired = true;
        checkBoxQuestion.hasComment = true;
        page.addQuestion(textQuestion);
        page.addQuestion(checkBoxQuestion);
        var jsObj = new dxSurvey.JsonObject().toJsonObject(page);
        assert.equal(JSON.stringify(jsObj), "{\"name\":\"Page1\",\"questions\":[{\"type\":\"text\",\"name\":\"textQuestion\",\"isRequired\":true},{\"type\":\"checkbox\",\"name\":\"checkboxQuestion\",\"isRequired\":true,\"hasComment\":true,\"choices\":[\"red\",\"white\"]}]}", "serialize two questions");
    });
    QUnit.test("Deserialize two questions", function (assert) {
        var survey = new Survey();
        var page = new Page("Page1");
        survey.addPage(page);
        new dxSurvey.JsonObject().toObject({
            "questions": [{ "type": "text", "name": "textQuestion", "isRequired": "true" }, { "type": "checkbox", "name": "checkboxQuestion", "isRequired": "true", "choices": ["red", "white"] }]
        }, page);
        var checkbox: any = page.questions[1];
        assert.equal(page.questions.length, 2, "Two questions from json");
        assert.equal(page.questions[0].name, "textQuestion", "property name is set");
        assert.equal(page.questions[1].getType(), "checkbox", "it is a live object");
        assert.deepEqual(checkbox.choices, ["red", "white"], "property choices is set");
        survey.setValue("textQuestion", "newValue");
        assert.equal(page.questions[0].value, "newValue", "data interface is working");
    });
    QUnit.test("Full survey deserialize with one question", function (assert) {
        var survey = new Survey();
        new dxSurvey.JsonObject().toObject(
            {pages: [{ "name" : "page1",
                "questions": [{ "type": "text", "name": "textQuestion", "isRequired": "true" }, { "type": "checkbox", "name": "checkboxQuestion", "isRequired": "true", "choices": ["red", "white"] }]
            }]}, survey);
        survey.setValue("textQuestion", "newValue");
        assert.equal(survey.pages[0].questions[0].value, "newValue", "data interface is working");
    });
    QUnit.test("Serialize survey data", function (assert) {
        var survey = new Survey();
        survey.setValue("question1", "value1");
        survey.setValue("question2", true);
        survey.setValue("question3", ["red", "white"]);
        var data = survey.data;
        var expectedData = [{ "question1": "value1" }, { "question2": true }, { "question3": ["red", "white"] }];
        assert.deepEqual(data, expectedData, "check if get data works correctly");
    });
    QUnit.test("Deserialize survey data", function (assert) {
        var survey = new Survey();
        var data = [{ "question1": "value1" }, { "question2": true }, { "question3": ["red", "white"] }];
        survey.data = data;
        assert.equal(survey.getValue("question1"), "value1", "survey data for question 1");
        assert.equal(survey.getValue("question2"), true, "survey data for question 2");
        assert.deepEqual(survey.getValue("question3"), ["red", "white"], "survey data for question 3");
    });
}
