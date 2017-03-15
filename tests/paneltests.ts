import {SurveyModel} from "../src/survey";
import {PageModel} from "../src/page";
import {QuestionFactory} from "../src/questionfactory";
import {Question} from "../src/question";

export default QUnit.module("Panel");

QUnit.test("elements count", function (assert) {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    assert.equal(page.questions.length, 2, "There are two questions");
});

