/// <reference path="../src/jsonobject.ts" />
/// <reference path="../src/survey.ts" />
/// <reference path="../src/page.ts" />
/// <reference path="../src/question.ts" />
/// <reference path="../src/question_baseselect.ts" />
/// <reference path="../src/question_text.ts" />
/// <reference path="../src/question_checkbox.ts" />
/// <reference path="../src/questionfactory.ts" />
var dxSurvey;
(function (dxSurvey) {
    var SerializationTests;
    (function (SerializationTests) {
        QUnit.module("dxSurveySerialization");
        QUnit.test("Serialize two pages", function (assert) {
            var survey = new dxSurvey.Survey();
            survey.addNewPage("Page 1");
            survey.addNewPage("Page 2");
            var jsObj = new dxSurvey.JsonObject().toJsonObject(survey);
            assert.equal(JSON.stringify(jsObj), "{\"pages\":[{\"name\":\"Page 1\"},{\"name\":\"Page 2\"}]}", "serialize two pages");
        });
        QUnit.test("Deserialize two pages", function (assert) {
            var survey = new dxSurvey.Survey();
            new dxSurvey.JsonObject().toObject({ "pages": [{ "name": "Page1" }, { "name": "Page2" }] }, survey);
            assert.equal(survey.pages.length, 2, "Two pages from json");
            assert.equal(survey.pages[0].name, "Page1", "property name is set");
            assert.equal(survey.pages[0].data, survey, "data interface is set");
            assert.equal(survey.pages[1].getType(), "page", "it is a live object");
        });
        QUnit.test("Serialize two questions", function (assert) {
            var page = new dxSurvey.Page("Page1");
            var textQuestion = new dxSurvey.QuestionText("textQuestion");
            textQuestion.isRequired = true;
            var checkBoxQuestion = new dxSurvey.QuestionCheckbox("checkboxQuestion");
            checkBoxQuestion.choices = ["red", "white"];
            checkBoxQuestion.isRequired = true;
            checkBoxQuestion.hasComment = true;
            page.addQuestion(textQuestion);
            page.addQuestion(checkBoxQuestion);
            var jsObj = new dxSurvey.JsonObject().toJsonObject(page);
            assert.equal(JSON.stringify(jsObj), "{\"name\":\"Page1\",\"questions\":[{\"type\":\"text\",\"name\":\"textQuestion\",\"isRequired\":true},{\"type\":\"checkbox\",\"name\":\"checkboxQuestion\",\"isRequired\":true,\"hasComment\":true,\"choices\":[\"red\",\"white\"]}]}", "serialize two questions");
        });
        QUnit.test("Deserialize two questions", function (assert) {
            var survey = new dxSurvey.Survey();
            var page = new dxSurvey.Page("Page1");
            survey.addPage(page);
            new dxSurvey.JsonObject().toObject({
                "questions": [{ "type": "text", "name": "textQuestion", "isRequired": "true" }, { "type": "checkbox", "name": "checkboxQuestion", "isRequired": "true", "choices": ["red", "white"] }]
            }, page);
            var checkbox = page.questions[1];
            assert.equal(page.questions.length, 2, "Two questions from json");
            assert.equal(page.questions[0].name, "textQuestion", "property name is set");
            assert.equal(page.questions[1].getType(), "checkbox", "it is a live object");
            assert.equal(checkbox.choices.length, 2, "property choices is set correctly: length");
            assert.equal(checkbox.choices[0].value, "red", "property choices is set correctly: value");
            assert.equal(checkbox.choices[0].text, "red", "property choices is set correctly: text");
            assert.equal(checkbox.choices[1].value, "white", "property choices is set correctly: value");
            assert.equal(checkbox.choices[1].text, "white", "property choices is set correctly: text");
            survey.setValue("textQuestion", "newValue");
            assert.equal(page.questions[0].value, "newValue", "data interface is working");
        });
        QUnit.test("Full survey deserialize with one question", function (assert) {
            var survey = new dxSurvey.Survey();
            new dxSurvey.JsonObject().toObject({ pages: [{ "name": "page1",
                        "questions": [{ "type": "text", "name": "textQuestion", "isRequired": "true" }, { "type": "checkbox", "name": "checkboxQuestion", "isRequired": "true", "choices": ["red", "white"] }]
                    }] }, survey);
            survey.setValue("textQuestion", "newValue");
            assert.equal(survey.pages[0].questions[0].value, "newValue", "data interface is working");
        });
        QUnit.test("Serialize survey data", function (assert) {
            var survey = new dxSurvey.Survey();
            survey.setValue("question1", "value1");
            survey.setValue("question2", true);
            survey.setValue("question3", ["red", "white"]);
            var data = survey.data;
            var expectedData = [{ "question1": "value1" }, { "question2": true }, { "question3": ["red", "white"] }];
            assert.deepEqual(data, expectedData, "check if get data works correctly");
        });
        QUnit.test("Deserialize survey data", function (assert) {
            var survey = new dxSurvey.Survey();
            var data = [{ "question1": "value1" }, { "question2": true }, { "question3": ["red", "white"] }];
            survey.data = data;
            assert.equal(survey.getValue("question1"), "value1", "survey data for question 1");
            assert.equal(survey.getValue("question2"), true, "survey data for question 2");
            assert.deepEqual(survey.getValue("question3"), ["red", "white"], "survey data for question 3");
        });
    })(SerializationTests = dxSurvey.SerializationTests || (dxSurvey.SerializationTests = {}));
})(dxSurvey || (dxSurvey = {}));
