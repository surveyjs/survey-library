import {Question} from "../src/question";
import {PanelModel} from "../src/panel";
import {QuestionPanelDynamicModel, QuestionPanelDynamicItem} from "../src/question_paneldynamic";
import {JsonObject} from "../src/jsonobject";
import {SurveyModel} from "../src/survey";

export default QUnit.module("Survey_QuestionPanelDynamic");

QUnit.test("Create panels based on template on setting value", function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.value = [{}, {}];

    assert.equal(question.panels.length, 2, "There are two panels now");
    var p1 = question.panels[0];
    assert.equal(p1.elements.length, 2, "There are two elements in the first panel");
});

QUnit.test("Synhronize panelCount and value array length", function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 3;
    assert.equal(question.value.length, 3, "There should be 3 items in the array");
    question.value = [{}, {q1: "val1"}, {}, {}];
    assert.equal(question.panelCount, 4, "panelCount is 4 now");
    question.panelCount = 2;
    assert.equal(question.value.length, 2, "There should be 2 items in the array");
    assert.equal(question.value[1]["q1"], "val1", "Do not delete the value in non deleted panels");
});

QUnit.test("By pass values from question.value into panel values and vice versa", function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.value = [{q1: "item1_1", q2: "item1_2"}, {q1: "item2_1", q2: "item2_2"}];

    assert.equal(question.panels.length, 2, "There are two panels now");
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    assert.equal((<Question>p1.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.questions[0]).value, "item2_1", "value set correct q1 panel2");
    (<Question>p1.questions[0]).value = "newValue";
    assert.equal(question.value[0].q1, "newValue", "The value from question has been assign successful");
});

QUnit.test("Change values in panels on changing in question.value", function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    assert.equal(question.panels.length, 2, "There are two panels now");
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    question.value = [{q1: "item1_1", q2: "item1_2"}, {q1: "item2_1", q2: "item2_2"}];

    assert.equal((<Question>p1.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.questions[0]).value, "item2_1", "value set correct q1 panel2");
});


QUnit.test("Load from Json", function (assert) {
    var json = { questions: [
            {type: "paneldynamic", name: "q", panelCount: 3, templateElements: [{type: "text", name: "q1"}, {type: "text", name: "q2"}]
        }]};
    var survey = new SurveyModel(json);
    var question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    assert.equal(question.template.elements.length, 2, "template elements are loaded correctly");
    assert.equal(question.template.elements[1].name, "q2", "the name of the second question is 'q2'");
    assert.equal(question.panelCount, 3, "panelCount loaded correctly")
    assert.equal(question.panels.length, 3, "There are 3 panels now");
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    assert.ok(p1, "the panel has been created");
    assert.equal(p1.elements.length, 2, "There are two elements in the copied panel");
    assert.equal(p1.questions[1].name, "q2", "the name of the second question in the copied panel is 'q2'");
    assert.equal(p1.isVisible, true, "the panel is visible");

    question.value = [{q1: "item1_1", q2: "item1_2"}, {q1: "item2_1", q2: "item2_2"}];
    
    assert.equal((<Question>p1.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.questions[0]).value, "item2_1", "value set correct q1 panel2");
    (<Question>p1.questions[0]).value = "newValue";
    assert.equal(question.value[0].q1, "newValue", "The value changed correctly");
});

QUnit.test("Load from Json with nested panel", function (assert) {
    var json = { questions: [
            {type: "paneldynamic", name: "q", panelCount: 3, templateElements: [{type: "text", name: "q1"}, { type: "panel", name: "np1", elements: [ {type: "text", name: "q2"}]}]
        }]};
    var survey = new SurveyModel(json);
    var question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    assert.equal(question.template.elements.length, 2, "template elements are loaded correctly");
    assert.equal(question.template.elements[1].name, "np1", "the name of the second element is 'np1'");
    assert.equal((<PanelModel>question.template.elements[1]).elements.length, 1, "there is one element in nested panel 'np1'");
    assert.equal((<PanelModel>question.template.elements[1]).elements[0].name, "q2", "q2 is an element in the 'np1'");
    assert.equal(question.panelCount, 3, "panelCount loaded correctly")
    assert.equal(question.panels.length, 3, "There are 3 panels now");
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    assert.ok(p1, "the panel has been created");

    assert.equal(p1.elements.length, 2, "template elements are loaded correctly");
    assert.equal(p1.elements[1].name, "np1", "the name of the second element is 'np1'");
    assert.equal((<PanelModel>p1.elements[1]).elements.length, 1, "there is one element in nested panel 'np1'");
    assert.equal((<PanelModel>p1.elements[1]).elements[0].name, "q2", "q2 is an element in the 'np1'");

    question.value = [{q1: "item1_1", q2: "item1_2"}, {q1: "item2_1", q2: "item2_2"}];
    
    assert.equal((<Question>p1.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.questions[0]).value, "item2_1", "value set correct q1 panel2");
    (<Question>p1.questions[1]).value = "newValue";
    assert.equal(question.value[0].q2, "newValue", "The value changed correctly");
});

QUnit.test("Has errors", function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    (<Question>question.template.questions[0]).isRequired = true;
    question.isRequired = true;
    question.value = [];
    assert.equal(question.hasErrors(), true, "main question requires a value");
    question.value = [{q1: "item1_1"}, {}];
    assert.equal(question.hasErrors(), true, "q1 on the second row is not set");
    question.value = [{q1: "item1_1"}, {q1: "item2_1"}];
    assert.equal(question.hasErrors(), false, "There is no errors now");
});

QUnit.test("Update panels elements on changing template panel", function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.panelCount = 2;
    assert.equal(question.panels[0].elements.length, 0, "Initially there is no elements in the copied panel");
    question.template.addNewQuestion("text", "q1");
    assert.equal(question.panels[0].elements.length, 1, "Add question into template - add question into copied panels");
    question.template.removeQuestion(question.template.questions[0]);
    assert.equal(question.panels[0].elements.length, 0, "Remove question from template - from question from copied panels");
});

QUnit.test("Support visibleIf and panel variable", function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.template.questions[1].visibleIf = "{panel.q1} = 'val'";
    question.panelCount = 2;
    assert.equal(question.panels[0].questions[1].visible, false, "q1 is not 'val'");
    question.value = [{q1: "val"}];
    assert.equal(question.panels[0].questions[1].visible, true, "q1 is 'val'");
});
QUnit.test("Support panelIndex variable", function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.templateTitle = "{panelIndex}. test";
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    assert.equal(question.panels[0].processedTitle, "1. test", "panelIndex = 1 for the first panel");
    assert.equal(question.panels[1].processedTitle, "2. test", "panelIndex = 2 for the second panel");
});
QUnit.test("remove Panel", function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 3;
    question.value = [{}, {q1: "val1"}, {}];
    question.removePanel(2);
    question.removePanel(0);
    assert.equal(question.value.length, 1, "There should be 1 item in the array");
    assert.equal(question.panelCount, 1, "panelCount is 1 now");
    assert.equal(question.value[0]["q1"], "val1", "Do not delete the value in non deleted panels");
});
QUnit.test("Process text in titles", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var survey_q1 = <Question>page.addNewQuestion("text", "q1");
    var survey_q2 = <Question>page.addNewQuestion("text", "q2");
    survey_q2.title = "q1:{q1}";
    var question = new QuestionPanelDynamicModel("q");
    page.addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.templateTitle = "q1:{q1}, panel.q1:{panel.q1}";
    (<Question>question.template.questions[1]).title = "q1:{q1}, panel.q1:{panel.q1}";
    question.panelCount = 3;
    survey_q1.value = "val_q1";
    question.value = [{}, {q1: "val1"}, {}];
    var panel = question.panels[1];
    var panel_q2 = <Question>panel.questions[1];
    assert.equal(survey_q2.locTitle.renderedHtml, "2. q1:val_q1", "process root question title correclty");
    assert.equal(panel.locTitle.renderedHtml, "q1:val_q1, panel.q1:val1", "process panel title correctly");
    assert.equal(panel_q2.locTitle.renderedHtml, "q1:val_q1, panel.q1:val1", "process question title correctly");
});
QUnit.test("PanelDynamic in design time", function (assert) {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    assert.equal(question.panels.length, 1, "Only one panel at design time");
    assert.equal(question.panels[0].id, question.template.id, "The template panel should be shown");
});
QUnit.test("PanelDynamic, question no", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question1 = <Question>page.addNewQuestion("text", "q1");
    var panel = <QuestionPanelDynamicModel>page.addNewQuestion("paneldynamic", "panel");
    panel.template.addNewQuestion("text", "panelq1");
    panel.template.addNewQuestion("text", "panelq2");
    panel.panelCount = 2;
    var panelQuestion1 = <Question>panel.panels[0].questions[0];
    var panelQuestion2 = <Question>panel.panels[1].questions[1];
    var question2 = <Question>page.addNewQuestion("text", "q2");
    assert.equal(panel.showQuestionNumbers, "off", "off is the default value");
    assert.equal(question1.visibleIndex, 0, "off - question1.visibleIndex");
    assert.equal(panel.visibleIndex, 1, "off - panel.visibleIndex");
    assert.equal(panelQuestion1.visibleIndex, -1, "off - panelQuestion1.visibleIndex");
    assert.equal(panelQuestion2.visibleIndex, -1, "off - panelQuestion2.visibleIndex");
    assert.equal(question2.visibleIndex, 2, "off - question2.visibleIndex");

    panel.showQuestionNumbers = "onPanel";
    assert.equal(question1.visibleIndex, 0, "onPanel - question1.visibleIndex");
    assert.equal(panel.visibleIndex, 1, "onPanel - panel.visibleIndex");
    assert.equal(panelQuestion1.visibleIndex, 0, "onPanel - panelQuestion1.visibleIndex");
    assert.equal(panelQuestion2.visibleIndex, 1, "onPanel - panelQuestion2.visibleIndex");
    assert.equal(question2.visibleIndex, 2, "onPanel - question2.visibleIndex");

    panel.showQuestionNumbers = "onSurvey";
    assert.equal(question1.visibleIndex, 0, "onSurvey - question1.visibleIndex");
    assert.equal(panel.visibleIndex, -1, "onSurvey - panel.visibleIndex");
    assert.equal(panelQuestion1.visibleIndex, 1, "onSurvey - panelQuestion1.visibleIndex");
    assert.equal(panelQuestion2.visibleIndex, 4, "onSurvey - panelQuestion2.visibleIndex");
    assert.equal(question2.visibleIndex, 5, "onSurvey - question2.visibleIndex");

    panelQuestion1.visible = false;
    assert.equal(panelQuestion2.visibleIndex, 3, "onSurvey, panelQuestion1 is invisible - panelQuestion2.visibleIndex");
    assert.equal(question2.visibleIndex, 4, "onSurvey, panelQuestion1 is invisible - question2.visibleIndex");
});

QUnit.test("PanelDynamic, renderMode", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>page.addNewQuestion("paneldynamic", "panel");
    panel.template.addNewQuestion("text", "panelq1");
    panel.template.addNewQuestion("text", "panelq2");
    assert.equal(panel.renderMode, "list", "list is a default mode");
    panel.panelCount = 2;
    assert.equal(panel.currentIndex, -1, "list mode doesn't support currentIndex");
    assert.equal(panel.currentPanel, null, "list mode doesn't support currentPanel");
    panel.renderMode = "progressTop";
    assert.equal(panel.currentIndex, 0, "list mode doesn't support currentIndex");
    assert.equal(panel.currentPanel.id, panel.panels[0].id, "list mode doesn't support currentPanel");
    assert.equal(panel.isPrevButtonShowing, false, "currentIndex = 0, prevButton is hidden");
    assert.equal(panel.isNextButtonShowing, true, "currentIndex = 0, nextButton is visible");
    panel.currentIndex ++;
    assert.equal(panel.isPrevButtonShowing, true, "currentIndex = 1, prevButton is visible");
    assert.equal(panel.isNextButtonShowing, false, "currentIndex = 1, nextButton is hidden");
    panel.addPanel();
    assert.equal(panel.currentIndex, 2, "The last added panel is current");
    panel.removePanel(2);
    assert.equal(panel.currentIndex, 1, "The last  panel is removed");
});
QUnit.test("PanelDynamic, renderMode is not list + hasError", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>page.addNewQuestion("paneldynamic", "panel");
    (<Question>panel.template.addNewQuestion("text", "panelq1")).isRequired = true;
    panel.template.addNewQuestion("text", "panelq2");
    panel.panelCount = 2;
    panel.renderMode = "progressTop";
    panel.currentIndex = 1;
    assert.equal(panel.currentIndex, 1, "go to the second panel");
    panel.hasErrors(true);
    assert.equal(panel.currentIndex, 0, "it should show the first panel where the error happened");
});
QUnit.test("PanelDynamic, keyName + hasError", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>page.addNewQuestion("paneldynamic", "panel");
    panel.template.addNewQuestion("text", "panelq1");
    panel.template.addNewQuestion("text", "panelq2");
    panel.panelCount = 2;
    panel.keyName = "panelq1";
    assert.equal(panel.hasErrors(true), false, "There is not errors");
    (<Question>panel.panels[0].questions[0]).value = "val1";
    assert.equal(panel.hasErrors(true), false, "There is not errors panel[0].q1 = val1");
    (<Question>panel.panels[1].questions[0]).value = "val1";
    assert.equal(panel.hasErrors(true), true, "There is the error panel[0].q1 = val1 and panel[1].q1 = val1");
    (<Question>panel.panels[1].questions[0]).value = "val2";
    assert.equal(panel.hasErrors(true), false, "There is no error panel[0].q1 = val1 and panel[1].q1 = val2");
});
/* Think about this-
QUnit.test("PanelDynamic survey.getPageByQuestion/Element", function (assert) {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    assert.equal(survey.getPageByQuestion(question.template.questions[0]).name, "p", "Template question page is found");
    assert.equal(survey.getPageByQuestion(question.panels[0].questions[0]).name, "p", "Nested question page is found");
});
*/