/// <reference path="../../src/base.ts" />
/// <reference path="../../src/survey.ts" />
/// <reference path="../../src/knockout/kosurvey.ts" />
/// <reference path="../../src/knockout/standard/kosurveystandard.ts" />
/// <reference path="../../src/knockout/kopage.ts" />
/// <reference path="../../src/question.ts" />
/// <reference path="../../src/page.ts" />
/// <reference path="../../src/question_baseselect.ts" />
/// <reference path="../../src/question_checkbox.ts" />
/// <reference path="../../src/question_matrix.ts" />
/// <reference path="../../src/question_multipletext.ts" />
module SurveykoTests {
    QUnit.module("koTests");

    QUnit.test("Serialize two pages", function (assert) {
        var survey = new Survey.Survey();
        survey.addNewPage("Page 1");
        survey.addNewPage("Page 2");
        assert.ok(survey.pages[0]["koNo"], "creates the koPage class");
        var jsObj = new Survey.JsonObject().toJsonObject(survey);
        assert.equal(JSON.stringify(jsObj), "{\"pages\":[{\"name\":\"Page 1\"},{\"name\":\"Page 2\"}]}", "serialize two pages");
    });
    QUnit.test("Deserialize two pages", function (assert) {
        var survey = new Survey.Survey();
        new Survey.JsonObject().toObject({ "pages": [{ "name": "Page1" }, { "name": "Page2" }] }, survey);
        assert.equal(survey.pages.length, 2, "Two pages from json");
        assert.ok(survey.pages[0]["koNo"], "creates the koPage class");
    });
}