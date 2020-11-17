import { SurveyModel } from "../src/survey";
import { Base, Event, ArrayChanges } from "../src/base";
import {QuestionTextModel} from "../src/question_text"

export default QUnit.module("Survey.editingObj Tests");

QUnit.test("Edit object property using the survey", function (assert) {
    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel();
    survey.editingObj = question;
    assert.equal(survey.getValue("name"), "q1", "Get survey value from the object directly");
    survey.setValue("name", "q2");
    assert.equal(question.name, "q2", "The question name was changed via survey");
    question.isRequired = true;
    survey.clearValue("isRequired");
    assert.equal(question.isRequired, false, "isRequired property is default again");
});
QUnit.test("Expression based on object properties", function (assert) {
    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel({
        elements: [
            {type: "text", name: "name"},
            {type: "text", name: "inputType"},
            {type: "text", name: "min", visibleIf: "{inputType} = 'text'"}
            
        ]
    });
    survey.editingObj = question;
    assert.equal(survey.getValue("inputType"), "text", "Get the default value")
    var minQuestion = survey.getQuestionByName("min");
    assert.equal(minQuestion.isVisible, true, "min property should be visible by default");
});
QUnit.test("React on property change", function (assert) {
    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel({
        elements: [
            {type: "text", name: "name"},
            {type: "text", name: "inputType"},
            {type: "text", name: "min", visibleIf: "{inputType} = 'text'"}
            
        ]
    });
    survey.editingObj = question;
    var minQuestion = survey.getQuestionByName("min");
    assert.equal(minQuestion.isVisible, true, "min property should be visible by default");
    question.inputType = "color";
    assert.equal(minQuestion.isVisible, false, "min property is invisible now");
    question.inputType = "text";
    assert.equal(minQuestion.isVisible, true, "min property is visible again");
});
QUnit.test("Edit question title property", function (assert) {
    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel({
        elements: [
            {type: "text", name: "name"},
            {type: "comment", name: "title"},
        ]
    });
    survey.editingObj = question;
    assert.equal(question.title, "q1", "the default title value");
    assert.equal(survey.getValue("title"), undefined, "The value is empty");
    survey.setValue("title", "q1 title");
    assert.equal(question.title, "q1 title", "set title property correctly");
    survey.setValue("title", "");
    assert.equal(question.title, "q1", "get title property from name");
});
