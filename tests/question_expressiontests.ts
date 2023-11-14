import { SurveyModel } from "../src/survey";
import { QuestionExpressionModel } from "../src/question_expression";
import { FunctionFactory } from "../src/functionsfactory";

export default QUnit.module("QuestionExpression");

//Dummy, to include expression question model into tests
new QuestionExpressionModel("q1");

QUnit.test("Expression question is created", function(assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  assert.ok(expression, "expression question is created");
});

QUnit.test("Simple calculation", function(assert) {
  var survey = createSurveyWith3Questions();
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  assert.notOk(expression.value, "expression is empty");
  expression.expression = "{q1} + {q2}";
  assert.notOk(expression.value, "q1 and q2 is undefined");
  survey.setValue("q1", 1);
  assert.equal(expression.value, 1, "q1 = 1");
  survey.setValue("q2", 2);
  assert.equal(expression.value, 3, "q1 = 1 and q2 = 2");
});

QUnit.test("Display text + format", function(assert) {
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
QUnit.test("Display text + defaltValue", function(assert) {
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
QUnit.test("Display text + displayStyle", function(assert) {
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
QUnit.test("Display text + fraction digitals", function(assert) {
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
QUnit.test("Display text + survey.onExpressionDisplayValue event", function(
  assert
) {
  var survey = createSurveyWith3Questions();
  survey.onGetExpressionDisplayValue.add((sender, options) => {
    //if (options.question.name !== "exp") return;
    options.displayValue = "$" + options.displayValue + ".";
  });
  var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
  expression.expression = "10";
  survey.data = { q1: 4 };
  expression.displayStyle = "decimal";
  assert.equal(expression.displayValue, "$10.", "Use event");
});
QUnit.test("Formated value", function(assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", defaultValue: 1 },
      { type: "expression", name: "exp1", expression: "{q1}" },
      { type: "expression", name: "exp2", expression: "{q1}", format: "{0} $" },
      { type: "expression", name: "exp3", expression: "{q2}", displayStyle: "currency", currency: "USD" },
    ]
  });
  const exp1 = <QuestionExpressionModel>survey.getQuestionByName("exp1");
  const exp2 = <QuestionExpressionModel>survey.getQuestionByName("exp2");
  const exp3 = <QuestionExpressionModel>survey.getQuestionByName("exp3");
  assert.equal(exp1.formatedValue, "", "exp1 no value");
  assert.equal(exp2.formatedValue, "", "exp2 no value");
  assert.equal(exp3.formatedValue, "$1.00", "exp3 correct value");
  survey.setValue("q1", 2);
  assert.equal(exp1.formatedValue, "2", "exp1 correct");
  assert.equal(exp2.formatedValue, "2 $", "exp2 correct");
  exp1.currency = "USD";
  exp1.displayStyle = "currency";
  assert.equal(exp1.formatedValue, "$2.00", "exp1 correct with USD");
});

function createSurveyWith3Questions(): SurveyModel {
  var survey = new SurveyModel();
  var page = survey.addNewPage();
  page.addNewQuestion("text", "q1");
  page.addNewQuestion("text", "q2");
  page.addNewQuestion("text", "q3");
  return survey;
}
QUnit.test("setting data doesn't calculate expressions if value is set", function (assert) {
  const survey = new SurveyModel({
    questions: [
      {
        "name": "q1",
        "type": "text"
      },
      {
        "name": "q2",
        "type": "text"
      },
      {
        "name": "q3",
        "type": "expression",
        "expression": "{q1} + {q2}"
      }
    ]
  });
  survey.data = { q1: 1, q2: 2, q3: 3 };
  const question = <QuestionExpressionModel>survey.getQuestionByName("q3");
  assert.equal(question.value, 3, "value is correct");
  assert.equal(question.displayValue, "3", "display value is correct");
  assert.equal(question.formatedValue, "3", "formatedValue is correct");
});
QUnit.test("setting data doesn't calculate expressions survey.questionsOnPageMode = 'singlePage'", function (assert) {
  const survey = new SurveyModel({
    questions: [
      {
        "name": "q1",
        "type": "text"
      },
      {
        "name": "q2",
        "type": "text"
      },
      {
        "name": "q3",
        "type": "expression",
        "expression": "{q1} + {q2}"
      }
    ]
  });
  survey.data = { q1: 1, q2: 2 };
  survey.questionsOnPageMode = "singlePage";
  const question = <QuestionExpressionModel>survey.getQuestionByName("q3");
  assert.equal(question.value, 3, "value is correct");
  assert.equal(question.displayValue, "3", "display value is correct");
  assert.equal(question.formatedValue, "3", "formatedValue is correct");
});
QUnit.test("round to digits", function (assert) {
  const survey = new SurveyModel({
    questions: [
      { "name": "q1", "type": "expression", "expression": "1111/125" },
      { "name": "q2", "type": "expression", "expression": "1111/125", "precision": 2 },
      { "name": "q3", "type": "expression", "expression": "1111/125", "precision": 1 },
      { "name": "q4", "type": "expression", "expression": "1111/125", "precision": 0 }
    ]
  });
  const q1 = <QuestionExpressionModel>survey.getQuestionByName("q1");
  const q2 = <QuestionExpressionModel>survey.getQuestionByName("q2");
  const q3 = <QuestionExpressionModel>survey.getQuestionByName("q3");
  const q4 = <QuestionExpressionModel>survey.getQuestionByName("q4");
  assert.equal(q1.precision, -1, "precision:-1");
  assert.equal(q2.precision, 2, "precision:2");
  assert.equal(q3.precision, 1, "precision:1");
  assert.equal(q4.precision, 0, "precision:0");
  assert.equal(q1.value, 8.888, "precision - default (-1)");
  assert.equal(q2.value, 8.89, "precision - 2");
  assert.equal(q3.value, 8.9, "precision - 1");
  assert.equal(q4.value, 9, "precision - 0");
});
QUnit.test("survey.onValueChanging, bug#6548", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "name": "weightKg",
        "type": "text",
        "inputType": "number"
      },
      {
        "name": "heightCm",
        "type": "text",
        "inputType": "number",
      },
      {
        "name": "bmi",
        "type": "expression",
        "expression": "{weightKg}/(({heightCm}/100)^2)"
      }

    ]
  });
  const q = <QuestionExpressionModel>survey.getQuestionByName("bmi");
  survey.onValueChanging.add((sender, options) => {
    if(options.question.name === "bmi" && !!options.value) {
      options.value = parseFloat(options.value.toFixed(0));
    }
  });
  survey.data = {
    weightKg: 88,
    heightCm: 169
  };
  assert.equal(q.value, 31, "correct value on survey.onValueChanging event, #1");
  assert.deepEqual(survey.data, { weightKg: 88, heightCm: 169, bmi: 31 }, "survey.data is correct, #1");
  survey.setValue("weightKg", 100);
  assert.equal(q.value, 35, "correct value on survey.onValueChanging event, #2");
  assert.deepEqual(survey.data, { weightKg: 100, heightCm: 169, bmi: 35 }, "survey.data is correct, #2");
});
QUnit.test("Handle Infinity", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "name": "q1",
        "type": "text"
      },
      {
        "name": "q2",
        "type": "text",
        "inputType": "number"
      },
      {
        "name": "q3",
        "type": "expression",
        "expression": "({q1}^-1)*(2^{q2})",
      }
    ]
  });
  let counter = 0;
  survey.onValueChanged.add((sender, options) => {
    if(options.name === "q3") counter ++;
  });
  const q3 = survey.getQuestionByName("q3");
  survey.setValue("q2", 1);
  assert.equal(counter, 0, "is not updated");
  survey.setValue("q2", 3);
  assert.equal(counter, 0, "is not updated yet");
  assert.equal(q3.isEmpty(), true, "expression question is undefined");
  survey.setValue("q1", 2);
  assert.equal(counter, 1, "updated one time");
  assert.equal(q3.value, 4, "calculated correctly");
});
QUnit.test("Custom function returns object&array, #7050", function (assert) {
  function func1(params: any[]): any {
    return { a: 1, b: 2 };
  }
  function func2(params: any[]): any {
    return [{ a: 1 }, { b: 2 }];
  }
  FunctionFactory.Instance.register("func1", func1);
  FunctionFactory.Instance.register("func2", func2);
  const survey = new SurveyModel({
    elements: [
      {
        "name": "q1",
        "type": "expression",
        "expression": "func1()",
      },
      {
        "name": "q2",
        "type": "expression",
        "expression": "func2()",
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.deepEqual(q1.value, { a: 1, b: 2 }, "function returns object");
  assert.deepEqual(q2.value, [{ a: 1 }, { b: 2 }], "function returns array");

  FunctionFactory.Instance.unregister("func1");
  FunctionFactory.Instance.unregister("func2");
});
QUnit.test("Default value and setValueExpression", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "expression", name: "q1", setValueExpression: "iif({q2} = 1, 'b', ''", defaultValue: "a" },
      { type: "text", name: "q2" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  assert.equal(q1.value, "a", "default value is 'a'");
  assert.equal(q1.formatedValue, "a", "formatedValue, default value is 'a'");
  survey.setValue("q2", 1);
  assert.equal(q1.value, "b", "var1 = 1");
  assert.equal(q1.formatedValue, "b", "formatedValue, var1 = 1");
  survey.setValue("q2", 2);
  assert.equal(q1.value, "", "var1 = 2");
  assert.equal(q1.formatedValue, "", "formatedValue, var1 = 2");
});
