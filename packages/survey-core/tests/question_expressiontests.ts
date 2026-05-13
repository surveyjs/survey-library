import { SurveyModel } from "../src/survey";
import { QuestionExpressionModel } from "../src/question_expression";
import { FunctionFactory } from "../src/functionsfactory";

import { describe, test, expect, vi } from "vitest";
describe("QuestionExpression", () => {
//Dummy, to include expression question model into tests
  new QuestionExpressionModel("q1");

  test("Expression question is created", () => {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
    expect(expression, "expression question is created").toBeTruthy();
  });

  test("Simple calculation", () => {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
    expect(expression.value, "expression is empty").toBeFalsy();
    expression.expression = "{q1} + {q2}";
    expect(expression.value, "q1 and q2 is undefined").toBeFalsy();
    survey.setValue("q1", 1);
    expect(expression.value, "q1 = 1").toBe(1);
    survey.setValue("q2", 2);
    expect(expression.value, "q1 = 1 and q2 = 2").toBe(3);
  });

  test("Display text + format", () => {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
    expect(expression.value, "expression is empty").toBeFalsy();
    expression.expression = "{q1} + {q2}";
    survey.data = { q1: 1, q2: 3 };
    expect(expression.value, "q1 = 1 and q2 = 2").toBe(4);
    expect(expression.displayValue, "format is empty").toBe("4");
    expression.format = "{0} $";
    expect(expression.displayValue, "format is {0} $").toBe("4 $");
  });
  test("Display text + defaltValue", () => {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
    expect(expression.value, "expression is empty").toBeFalsy();
    expression.expression = "{q1} + {q2}";
    expression.defaultValue = 0;
    expect(expression.value, "use default value").toBe(0);
    survey.data = { q1: 1, q2: 3 };
    expect(expression.value, "do not use default value").toBe(4);
  });
  test("Display text + displayStyle", () => {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
    expect(expression.value, "expression is empty").toBeFalsy();
    expression.expression = "{q1} + {q2}";
    survey.data = { q1: 1, q2: 3 };
    expression.displayStyle = "currency";
    expect(expression.displayValue, "format is empty").toBe("$4.00");
  });
  test("Display text + fraction digitals", () => {
    var survey = createSurveyWith3Questions();
    var expression = <QuestionExpressionModel>(
    survey.pages[0].addNewQuestion("expression", "exp")
  );
    expression.expression = "64/3";
    survey.data = { q1: 4 };
    expression.displayStyle = "decimal";
    expression.maximumFractionDigits = 2;
    expect(expression.displayValue, "2 digits").toBe("21.33");
  });
  test("Display text + survey.onExpressionDisplayValue event", () => {
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
    expect(expression.displayValue, "Use event").toBe("$10.");
  });
  test("Formated value", () => {
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
    expect(exp1.formatedValue, "exp1 no value").toBe("");
    expect(exp2.formatedValue, "exp2 no value").toBe("");
    expect(exp3.formatedValue, "exp3 correct value").toBe("$1.00");
    survey.setValue("q1", 2);
    expect(exp1.formatedValue, "exp1 correct").toBe("2");
    expect(exp2.formatedValue, "exp2 correct").toBe("2 $");
    exp1.currency = "USD";
    exp1.displayStyle = "currency";
    expect(exp1.formatedValue, "exp1 correct with USD").toBe("$2.00");
  });

  function createSurveyWith3Questions(): SurveyModel {
    var survey = new SurveyModel();
    var page = survey.addNewPage();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    page.addNewQuestion("text", "q3");
    return survey;
  }
  test("setting data doesn't calculate expressions if value is set", () => {
    const survey = new SurveyModel({
      elements: [
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
    expect(question.value, "value is correct").toBe(3);
    expect(question.displayValue, "display value is correct").toBe("3");
    expect(question.formatedValue, "formatedValue is correct").toBe("3");
  });
  test("setting data doesn't calculate expressions survey.questionsOnPageMode = 'singlePage'", () => {
    const survey = new SurveyModel({
      elements: [
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
    expect(question.value, "value is correct").toBe(3);
    expect(question.displayValue, "display value is correct").toBe("3");
    expect(question.formatedValue, "formatedValue is correct").toBe("3");
  });
  test("round to digits", () => {
    const survey = new SurveyModel({
      elements: [
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
    expect(q1.precision, "precision:-1").toBe(-1);
    expect(q2.precision, "precision:2").toBe(2);
    expect(q3.precision, "precision:1").toBe(1);
    expect(q4.precision, "precision:0").toBe(0);
    expect(q1.value, "precision - default (-1)").toBe(8.888);
    expect(q2.value, "precision - 2").toBe(8.89);
    expect(q3.value, "precision - 1").toBe(8.9);
    expect(q4.value, "precision - 0").toBe(9);
  });
  test("survey.onValueChanging, bug#6548", () => {
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
      if (options.question.name === "bmi" && !!options.value) {
        options.value = parseFloat(options.value.toFixed(0));
      }
    });
    survey.data = {
      weightKg: 88,
      heightCm: 169
    };
    expect(q.value, "correct value on survey.onValueChanging event, #1").toBe(31);
    expect(survey.data, "survey.data is correct, #1").toEqual({ weightKg: 88, heightCm: 169, bmi: 31 });
    survey.setValue("weightKg", 100);
    expect(q.value, "correct value on survey.onValueChanging event, #2").toBe(35);
    expect(survey.data, "survey.data is correct, #2").toEqual({ weightKg: 100, heightCm: 169, bmi: 35 });
  });
  test("Handle Infinity", () => {
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
      if (options.name === "q3") counter ++;
    });
    const q3 = survey.getQuestionByName("q3");
    survey.setValue("q2", 1);
    expect(counter, "is not updated").toBe(0);
    survey.setValue("q2", 3);
    expect(counter, "is not updated yet").toBe(0);
    expect(q3.isEmpty(), "expression question is undefined").toBe(true);
    survey.setValue("q1", 2);
    expect(counter, "updated one time").toBe(1);
    expect(q3.value, "calculated correctly").toBe(4);
  });
  test("Custom function returns object&array, #7050", () => {
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
    expect(q1.value, "function returns object").toEqual({ a: 1, b: 2 });
    expect(q2.value, "function returns array").toEqual([{ a: 1 }, { b: 2 }]);

    FunctionFactory.Instance.unregister("func1");
    FunctionFactory.Instance.unregister("func2");
  });
  test("Default value and setValueExpression", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "expression", name: "q1", setValueExpression: "iif({q2} = 1, 'b', ''", defaultValue: "a" },
        { type: "text", name: "q2" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value, "default value is 'a'").toBe("a");
    expect(q1.formatedValue, "formatedValue, default value is 'a'").toBe("a");
    survey.setValue("q2", 1);
    expect(q1.value, "var1 = 1").toBe("b");
    expect(q1.formatedValue, "formatedValue, var1 = 1").toBe("b");
    survey.setValue("q2", 2);
    expect(q1.value, "var1 = 2").toBe("");
    expect(q1.formatedValue, "formatedValue, var1 = 2").toBe("");
  });
  test("Do not serialized required, resetValueIf, setValueIf, defaultValueExpression and other properties, Bug#9559", () => {
    const q1 = new QuestionExpressionModel("q1");
    q1.expression = "{q2} + {q3}";
    q1.setValueIf = "abc";
    q1.setValueExpression = "def";
    q1.resetValueIf = "ghi";
    q1.isRequired = true;
    expect(q1.toJSON(), "Serialize only expression").toEqual({ name: "q1", expression: "{q2} + {q3}" });
  });
  test("Values as number and as string, Bug#9690", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "expression", name: "q1", expression: "{q2} + 1" },
        { type: "dropdown", name: "q2", choices: [1, 2, 3] }
      ]
    });
    survey.data = { q2: 1, q1: "2" };
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value, "q1.value is number").toBe(2);
    expect(survey.getValue("q1"), "survey.getValue('q1') is string").toBe(2);
  });
  test("minimumFractionDigits/maximumFractionDigits  onSettingValue property function", () => {
    const q = new QuestionExpressionModel("q1");
    expect(q.minimumFractionDigits, "min #0").toBe(-1);
    expect(q.maximumFractionDigits, "max #0").toBe(-1);

    q.minimumFractionDigits = 2;
    expect(q.minimumFractionDigits, "min #1").toBe(2);
    expect(q.maximumFractionDigits, "max #1").toBe(-1);

    q.maximumFractionDigits = 1;
    expect(q.minimumFractionDigits, "min #2").toBe(2);
    expect(q.maximumFractionDigits, "max #2").toBe(2);

    q.minimumFractionDigits = 3;
    expect(q.minimumFractionDigits, "min #3").toBe(2);
    expect(q.maximumFractionDigits, "max #3").toBe(2);

    q.maximumFractionDigits = 3;
    expect(q.minimumFractionDigits, "min #4").toBe(2);
    expect(q.maximumFractionDigits, "max #4").toBe(3);
  });
  test("survey.onExpressionRunning, #10258", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "expression", name: "q1", expression: "{q2} + 1" },
        { type: "text", name: "q2" }
      ]
    });
    let allow = true;
    let expression = "{q2} + 1";
    let counter = 0;
    survey.data = { q2: 1 };
    survey.onExpressionRunning.add((sender, options) => {
      if ((<any>options.element).name === "q1" && options.propertyName === "expression") {
        options.allow = allow;
        options.expression = expression;
        counter ++;
      }
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value, "q1.value #1").toBe(2);
    expect(counter, "counter #1").toBe(0);
    survey.setValue("q2", 2);
    expect(q1.value, "q1.value #2").toBe(3);
    expect(counter, "counter #2").toBe(2);
    allow = false;
    survey.setValue("q2", 3);
    expect(q1.value, "q1.value #3").toBe(3);
    expect(counter, "counter #3").toBe(3);
    allow = true;
    expression = "{q2} + 2";
    survey.setValue("q2", 4);
    expect(q1.value, "q1.value #4").toBe(6);
    expect(counter, "counter #4").toBe(5);
  });

  test("Support Promises in Custom Functions", async () => {
    vi.useFakeTimers();
    try {
      const MyFunc = function(params: any): any {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(Number(params[0]) + 10);
          }, 1);
        });
      };
      FunctionFactory.Instance.register("MyFunc", MyFunc, true);
      const survey = new SurveyModel({
        elements: [
          {
            "name": "q1",
            "type": "expression",
            "expression": "MyFunc({q2})",
          },
          { "name": "q2", "type": "text", "defaultValue": 3 }
        ]
      });
      const q1 = survey.getQuestionByName("q1");
      const q2 = survey.getQuestionByName("q2");
      await vi.advanceTimersByTimeAsync(10);
      expect(q1.value, "The async function result is correct").toBe(13);
      FunctionFactory.Instance.unregister("MyFunc");
    } finally {
      vi.useRealTimers();
    }
  });

  test("Access page and panel properties in expression, #11198", () => {
    const survey = new SurveyModel({
      "title": "Survey Title",
      "description": "Survey Description",
      "pages": [
        {
          "name": "page2",
          "elements": [
            {
              "type": "expression",
              "name": "question5",
              "title": "Info about Survey",
              "expression": "{$survey.title}"
            }
          ]
        },
        {
          "name": "page1",
          "title": "Page 1 Title",
          "description": "Page 1 Description",
          "elements": [
            {
              "type": "expression",
              "name": "question4",
              "title": "Info about Page",
              "expression": "{$page1.title}"
            },
            {
              "type": "panel",
              "name": "panel1",
              "title": "Panel Title",
              "description": "Panel Description",
              "elements": [
                {
                  "type": "expression",
                  "name": "question2",
                  "title": "Info about Panel",
                  "expression": "{$panel1.title}"
                },
                {
                  "type": "boolean",
                  "name": "question1",
                  "title": "Yes/No Title",
                  "description": "Yes/No Description"
                },
                {
                  "type": "expression",
                  "name": "question3",
                  "startWithNewLine": false,
                  "title": "Info about Boolean question",
                  "expression": "{$question1.title}"
                }
              ]
            }
          ]
        }
      ],
      "questionsOnPageMode": "singlePage"
    });

    const question2 = survey.getQuestionByName("question2");
    const question3 = survey.getQuestionByName("question3");
    const question4 = survey.getQuestionByName("question4");
    const question5 = survey.getQuestionByName("question5");

    expect(question2.value, "question2: access panel1.title").toBe("Panel Title");
    expect(question3.value, "question3: access question1.title").toBe("Yes/No Title");
    expect(question4.value, "question4: access page1.title").toBe("Page 1 Title");
    expect(question5.value, "question5: access survey.title").toBe("Survey Title");
  });
});
