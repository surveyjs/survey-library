
import {SurveyModel} from "../src/survey";
import {QuestionDropdownModel} from "../src/question_dropdown";
import {QuestionTextModel} from "../src/question_text";
import {PropertyGridModel} from "../src/propertyGrid";

export default QUnit.module("Property Grid");

QUnit.test("Create survey with editingObj", function (assert) {
    var question = new QuestionTextModel("q1");
    var propertyGrid = new PropertyGridModel(question);
    assert.equal(propertyGrid.survey.getValue("name"), "q1", "name property value is set");
    var nameQuestion = propertyGrid.survey.getQuestionByName("name");
    assert.ok(nameQuestion, "property for name is created");
    nameQuestion.value = "q2";
    assert.equal(question.name, "q2", "Value has been changed correctly");
});
QUnit.test("boolean property editor (boolean/switch)", function (assert) {
    var question = new QuestionTextModel("q1");
    var propertyGrid = new PropertyGridModel(question);
    var startWithNewLineQuestion = propertyGrid.survey.getQuestionByName("startWithNewLine");
    var isRequiredQuestion = propertyGrid.survey.getQuestionByName("isRequired");
    assert.ok(startWithNewLineQuestion, "property for startWithNewLine is created");
    assert.ok(isRequiredQuestion, "property for isRequired is created");
    assert.equal(startWithNewLineQuestion.getType(), "boolean", "property for startWithNewLine is created");
    assert.equal(isRequiredQuestion.getType(), "boolean", "property for isRequired is created");
    assert.equal(startWithNewLineQuestion.value, true, "startWithNewLine default value is true");
    assert.equal(isRequiredQuestion.value, false, "isRequired default value is false");
    question.isRequired = true;
    assert.equal(isRequiredQuestion.value, true, "isRequired is true now");
    isRequiredQuestion.value = false;
    assert.equal(question.isRequired, false, "isRequired is false again - two way bindings");
});