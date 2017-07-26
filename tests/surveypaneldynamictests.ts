import {Question} from "../src/question";
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

    question.value = [{q1: "item1_1", q2: "item1_2"}, {q1: "item2_1", q2: "item2_2"}];
    
    assert.equal((<Question>p1.panel.questions[1]).value, "item1_2", "value set correct q2 panel1");
    assert.equal((<Question>p2.panel.questions[0]).value, "item2_1", "value set correct q1 panel2");
    (<Question>p1.panel.questions[0]).value = "newValue";
});