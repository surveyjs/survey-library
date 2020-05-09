import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionExpressionModel } from "../src/question_expression";

export default QUnit.module("QuestionExpression");

//Dummy, to include expression question model into tests
new QuestionExpressionModel("q1");

QUnit.test("Expression question is created", function (assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  assert.ok(expression, "expression question is created");
});

QUnit.test("Simple calculation", function (assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  assert.notOk(expression.value, "expression is empty");
  expression.expression = "{q1} + {q2}";
  assert.notOk(expression.value, "q1 and q2 is underfined");
  survey.setValue("q1", 1);
  assert.equal(expression.value, 1, "q1 = 1");
  survey.setValue("q2", 2);
  assert.equal(expression.value, 3, "q1 = 1 and q2 = 2");
});

QUnit.test("Display text + format", function (assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  assert.notOk(expression.value, "expression is empty");
  expression.expression = "{q1} + {q2}";
  survey.data = { q1: 1, q2: 3 };
  assert.equal(expression.value, 4, "q1 = 1 and q2 = 2");
  assert.equal(expression.displayValue, "4", "format is empty");
  expression.format = "{0} $";
  assert.equal(expression.displayValue, "4 $", "format is {0} $");
});
QUnit.test("Display text + defaltValue", function (assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  assert.notOk(expression.value, "expression is empty");
  expression.expression = "{q1} + {q2}";
  expression.defaultValue = 0;
  assert.equal(expression.value, 0, "use default value");
  survey.data = { q1: 1, q2: 3 };
  assert.equal(expression.value, 4, "do not use default value");
});
QUnit.test("Display text + displayStyle", function (assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  assert.notOk(expression.value, "expression is empty");
  expression.expression = "{q1} + {q2}";
  survey.data = { q1: 1, q2: 3 };
  expression.displayStyle = "currency";
  assert.equal(expression.displayValue, "$4.00", "format is empty");
});
QUnit.test("Display text + fraction digitals", function (assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  expression.expression = "64/3";
  survey.data = { q1: 4 };
  expression.displayStyle = "decimal";
  expression.maximumFractionDigits = 2;
  assert.equal(expression.displayValue, "21.33", "2 digits");
});
function createSurveyWith3Questions(): SurveyModel {
  var survey = new SurveyModel();
  var page = survey.addNewPage();
  page.addNewQuestion("text", "q1");
  page.addNewQuestion("text", "q2");
  page.addNewQuestion("text", "q3");
  return survey;
}
