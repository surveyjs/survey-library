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