
import {SurveyModel} from "../src/survey";
import {QuestionDropdownModel} from "../src/question_dropdown";
import {QuestionTextModel} from "../src/question_text";
import {PropertyGridModel} from "../src/propertyGrid";
import {QuestionMatrixDynamicModel} from "../src/question_matrixdynamic";

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

QUnit.test("itemvalue[] property editor", function (assert) {
    var question = new QuestionDropdownModel("q1");
    question.choices = [1, 2, 3];
    var propertyGrid = new PropertyGridModel(question);
    var choicesQuestion = <QuestionMatrixDynamicModel>propertyGrid.survey.getQuestionByName("choices");
    assert.ok(choicesQuestion, "choices property editor created");
    assert.equal(choicesQuestion.getType(), "matrixdynamic", "It is a matrix");
    assert.equal(choicesQuestion.columns.length, 2, "There are two columns");
    assert.equal(choicesQuestion.visibleRows.length, 3, "There are three elements");
    assert.equal(choicesQuestion.visibleRows[0].cells[0].value, 1, "the first cell value is 3");
    choicesQuestion.addRow();
    choicesQuestion.visibleRows[3].cells[0].value = 4
    assert.equal(question.choices.length, 4, "There are 4 items now");
    assert.equal(question.choices[3].value, 4, "The last item value is 4");
/*    
    question.choices[1].text  = "Item 2";
    assert.equal(choicesQuestion.visibleRows[1].cells[1].value, "Item 2", "the second cell in second row is correct");
    question.choices[2].value  = 333;
    assert.equal(choicesQuestion.visibleRows[2].cells[0].value, 333, "the first cell in third row is correct");
*/
});
/*
QUnit.test("column[] property editor", function (assert) {
    var question = new QuestionMatrixDynamicModel("q1");
    question.addColumn("col1");
    question.addColumn("col2");
    question.addColumn("col3");
    var propertyGrid = new PropertyGridModel(question);
    var choicesQuestion = <QuestionMatrixDynamicModel>propertyGrid.survey.getQuestionByName("columns");
    assert.ok(choicesQuestion, "choices property editor created");
    assert.equal(choicesQuestion.getType(), "matrixdynamic", "It is a matrix");
    assert.equal(choicesQuestion.columns.length, 3, "There are two columns");
    assert.equal(choicesQuestion.visibleRows.length, 3, "There are three elements");
    //assert.equal(choicesQuestion.visibleRows[0].cells[0].value, "default", "the first cell value is 'default'");
    assert.equal(choicesQuestion.visibleRows[0].cells[1].value, "col1", "the second cell value is 'col1'");
    //choicesQuestion.visibleRows[0].cells[1].value = "col11";
    //assert.equal(question.columns[0].name, "col11", "column name has been changed");

    
    choicesQuestion.addRow();
    choicesQuestion.visibleRows[3].cells[0].value = 4
    assert.equal(question.choices.length, 4, "There are 4 items now");
    assert.equal(question.choices[3].value, 4, "The last item value is 4");
// TODO it doesn't work - fix
    question.choices[1].text  = "Item 2";
    assert.equal(choicesQuestion.visibleRows[1].cells[1].value, "Item 2", "the second cell in second row is correct");
    question.choices[2].value  = 333;
    assert.equal(choicesQuestion.visibleRows[2].cells[0].value, 333, "the first cell in third row is correct"); 
   
});
*/