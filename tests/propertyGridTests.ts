
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
QUnit.test("Change editingObj of the property grid", function(assert) {
    var question = new QuestionTextModel("q1");
    var question2 = new QuestionTextModel("q2");
    var propertyGrid = new PropertyGridModel(question);
    assert.equal(propertyGrid.survey.getValue("name"), "q1", "name property value is set for the first editingObj");
    propertyGrid.obj = question2;
    assert.equal(propertyGrid.survey.getValue("name"), "q2", "name property value is set for the second editingObj");
})
QUnit.test("Check objValueChangedCallback", function(assert) {
    var count = 0;
    var objValueChangedCallback = () => {
        count++;
    }
    var question = new QuestionTextModel("q1");
    var question2 = new QuestionTextModel("q2");
    var propertyGrid = new PropertyGridModel(question);
    propertyGrid.objValueChangedCallback = objValueChangedCallback;
    assert.equal(count, 0, "objValueChangedCallback isn't called");
    propertyGrid.obj = question2;
    assert.equal(count, 1, "objValueChangedCallback is called after changing obj value");
    propertyGrid.obj = question2;
    assert.equal(count, 1, "objValueChangedCallback isn't called after setting same obj value");
    propertyGrid.obj = question;
    assert.equal(count, 2, "objValueChangedCallback is called after changing obj value");
})