import {Question} from "../src/question";
import {QuestionPanelDynamicModel, QuestionPanelDynamicItem} from "../src/question_paneldynamic";

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