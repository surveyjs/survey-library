import {SurveyModel} from "../src/survey";
import {PageModel} from "../src/page";
import {QuestionFactory} from "../src/questionfactory";
import {Question} from "../src/question";
import {QuestionTextModel} from "../src/question_text";
import {JsonObject, JsonUnknownPropertyError} from "../src/jsonobject";

export default QUnit.module("Panel");

QUnit.test("questions-elements synhronization", function (assert) {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    page.addNewQuestion("text", "q3");
    assert.equal(page.questions.length, 3, "There are 3 questions");
    assert.equal(page.elements.length, 3, "There are 3 elements");
    page.removeQuestion(page.questions[1]);
    assert.equal(page.questions.length, 2, "There are 2 questions");
    assert.equal(page.elements.length, 2, "There are 2 elements");
    assert.equal((<Question>page.elements[1]).name, "q3", "The second element is correct");
});

QUnit.test("elements-questions synhronization", function (assert) {
    var page = new PageModel();
    page.elements.push(new QuestionTextModel("q1"));
    page.elements.push(new QuestionTextModel("q2"));
    page.elements.push(new QuestionTextModel("q3"));
    assert.equal(page.elements.length, 3, "There are 3 elements");
    assert.equal(page.questions.length, 3, "There are 3 questions");
    page.elements.splice(1, 1);
    assert.equal(page.elements.length, 2, "There are 2 elements");
    assert.equal(page.questions.length, 2, "There are 2 questions");
    assert.equal(page.questions[1].name, "q3", "The second element is correct");
});

QUnit.test("load page from json with old questions", function (assert) {
    var page = new PageModel();
    var jsonObject = new JsonObject();
    jsonObject.toObject({ "questions":[ { "type": "text", "name": "q1" }, { "type": "text", "name": "q2" }]}, page);
    assert.equal(page.elements.length, 2, "There are two elements");
    assert.equal(page.questions.length, 2, "There are two questions");
    assert.equal(jsonObject.errors.length, 0, "There is no errors");
});

QUnit.test("Simple test on nested panel", function (assert) {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    var panel = page.addNewPanel("p1");
    assert.equal(page.elements.length, 2, "There are two elements");
    assert.equal(page.questions.length, 1, "There is still one question");
    panel.addNewQuestion("text", "q2_1");
    panel.addNewQuestion("text", "q2_2");
    assert.equal(page.elements.length, 2, "There are two elements");
    assert.equal(page.questions.length, 3, "There are three questions");
    page.addNewQuestion("text", "q3");
    assert.equal(page.elements.length, 3, "There are two elements");
    assert.equal(page.questions.length, 4, "There are four questions");
    panel.addNewQuestion("text", "q2_3");
    assert.equal(page.elements.length, 3, "There are two elements");
    assert.equal(page.questions.length, 5, "There are five questions");
});

QUnit.test("add questions to list", function (assert) {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    var panel = page.addNewPanel("p1");
    panel.addNewQuestion("text", "q2_1");
    page.addNewQuestion("text", "q3");
    var list = [];
    page.addQuestionsToList(list);
    assert.equal(list.length, 3, "There are three questions");
});

QUnit.test("load nested panel from json", function (assert) {
    var page = new PageModel();
    var jsonObject = new JsonObject();
    jsonObject.toObject({ "elements":[
        { "type": "text", "name": "q1" },
        {"type": "panel", "elements":[ { "type": "text", "name": "q1" }, { "type": "text", "name": "q3" }]},
    { "type": "text", "name": "q4" }]}, page);
    assert.equal(page.elements.length, 3, "There are two elements");
    assert.equal(page.questions.length, 4, "There are four questions");
    assert.equal(jsonObject.errors.length, 0, "There is no errors");
});

QUnit.test("panel rows generation - simple", function (assert) {
    var page = new PageModel();
    var q1 = page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    assert.equal(page.rows.length, 2, "There are two rows");
    assert.equal(page.rows[0].visible, true, "The first row is visible");
    q1.visible = false;
    assert.equal(page.rows[0].visible, false, "The first row is invisible now");
});

QUnit.test("panel rows generation - startNewLine false", function (assert) {
    var page = new PageModel();
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    q2.startWithNewLine = false;
    assert.equal(page.rows.length, 1, "There is one row");
    assert.equal(page.rows[0].visible, true, "The first row is visible");
    q1.visible = false;
    assert.equal(page.rows[0].visible, true, "The first row is still visible");
    q2.visible = false;
    assert.equal(page.rows[0].visible, false, "The first row is invisible now");
});

QUnit.test("panel rows generation - nested panel", function (assert) {
    var page = new PageModel();
    var q1 = page.addNewQuestion("text", "q1");
    var p1 = page.addNewPanel("p1");
    var p1q1 = p1.addNewQuestion("text", "p1q1");
    assert.equal(page.rows.length, 2, "There is two rows");
    assert.equal(page.rows[1].visible, true, "The panel row is visible");
    p1.visible = false;
    assert.equal(page.rows[1].visible, false, "The panel row is invisible since panel is invisible");
    p1.visible = true;
    assert.equal(page.rows[1].visible, true, "The panel row is visible since panel is visible");
    p1q1.visible = false;
    assert.equal(page.rows[1].visible, false, "The panel row is invisible since all questions are invisible");
});
