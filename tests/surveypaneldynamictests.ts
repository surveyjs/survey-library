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
    assert.equal(p1.panel.elements.length, 2, "There are two elements in the first panel");
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
    assert.equal((<Question>p1.panel.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.panel.questions[0]).value, "item2_1", "value set correct q1 panel2");
    (<Question>p1.panel.questions[0]).value = "newValue";
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

    assert.equal((<Question>p1.panel.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.panel.questions[0]).value, "item2_1", "value set correct q1 panel2");
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
    assert.ok(p1.panel, "the panel has been created");
    assert.equal(p1.panel.elements.length, 2, "There are two elements in the copied panel");
    assert.equal(p1.panel.questions[1].name, "q2", "the name of the second question in the copied panel is 'q2'");
    assert.equal(p1.panel.isVisible, true, "the panel is visible");

    question.value = [{q1: "item1_1", q2: "item1_2"}, {q1: "item2_1", q2: "item2_2"}];
    
    assert.equal((<Question>p1.panel.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.panel.questions[0]).value, "item2_1", "value set correct q1 panel2");
    (<Question>p1.panel.questions[0]).value = "newValue";
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
    var p1 = question.panels[0].panel;
    var p2 = question.panels[1].panel;
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
    assert.equal(question.panels[0].panel.elements.length, 0, "Initially there is no elements in the copied panel");
    question.template.addNewQuestion("text", "q1");
    assert.equal(question.panels[0].panel.elements.length, 1, "Add question into template - add question into copied panels");
    question.template.removeQuestion(question.template.questions[0]);
    assert.equal(question.panels[0].panel.elements.length, 0, "Remove question from template - from question from copied panels");
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
    assert.equal(question.panels[0].panel.questions[1].visible, false, "q1 is not 'val'");
    question.value = [{q1: "val"}];
    assert.equal(question.panels[0].panel.questions[1].visible, true, "q1 is 'val'");
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
    var panel = question.panels[1].panel;
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
    assert.equal(question.panels[0].panel.id, question.template.id, "The template panel should be shown");
});
