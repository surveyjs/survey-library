import {SurveyModel} from "../src/survey";
import {Question} from "../src/question";
import {QuestionExpressionModel} from "../src/question_expression";
import {JsonObject, JsonUnknownPropertyError} from "../src/jsonobject";

export default QUnit.module("QuestionExpression");

//Dummy, to include expression question model into tests
new QuestionExpressionModel("q1");

QUnit.test("Expression question is created", function (assert) {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>survey.pages[0].addNewQuestion("expression", "exp");
    assert.ok(expression, "expression question is created");
});

QUnit.test("Simple calculation", function (assert) {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>survey.pages[0].addNewQuestion("expression", "exp");
    assert.notOk(expression.value, "expression is empty");
    expression.expression = "{q1} + {q2}";
    assert.notOk(expression.value, "q1 and q2 is underfined");
    survey.setValue("q1", 1);
    assert.equal(expression.value, 1, "q1 = 1");
    survey.setValue("q2", 2);
    assert.equal(expression.value, 3, "q1 = 1 and q2 = 2");
});

function createSurveyWith3Questions(): SurveyModel {
    var survey = new SurveyModel();
    var page = survey.addNewPage();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    page.addNewQuestion("text", "q3");
    return survey;
}
