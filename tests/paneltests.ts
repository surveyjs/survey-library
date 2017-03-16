import {SurveyModel} from "../src/survey";
import {PageModel} from "../src/page";
import {QuestionFactory} from "../src/questionfactory";
import {Question} from "../src/question";
import {QuestionTextModel} from "../src/question_text";

export default QUnit.module("Panel");

QUnit.test("questions-elements synhronization", function (assert) {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    page.addNewQuestion("text", "q3");
    assert.equal(page.questions.length, 3, "There are 3 questions");
    assert.equal(page.elements.length, 3, "There are 3 elements");
    page.questions.splice(1, 1);
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

