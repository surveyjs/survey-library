import { SurveyModel } from "../src/survey";
import { QuestionExpressionModel } from "../src/question_expression";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { ComponentCollection, QuestionCustomModel } from "../src/question_custom";
import { FunctionFactory } from "../src/functionsfactory";
import { settings } from "../src/settings";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { PanelModel } from "../src/panel";
import { PageModel } from "../src/page";
import { Serializer } from "../src/jsonobject";
import { ElementFactory } from "../src/questionfactory";

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
  test("settings.expressionQuestionTrackDependencies = true, run on dependency change only", () => {
    let depCount = 0;
    let noParamCount = 0;
    FunctionFactory.Instance.register("depFunc", (params: any[]): any => { depCount++; return params[0]; });
    FunctionFactory.Instance.register("noParamFunc", (): any => { noParamCount++; return 1; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "expression", name: "dep", expression: "depFunc({q1})" },
          { type: "expression", name: "noParam", expression: "noParamFunc()" }
        ]
      });
      expect(depCount > 0, "dep runs on the first run").toBeTruthy();
      expect(noParamCount > 0, "noParam runs on the first run").toBeTruthy();
      depCount = 0;
      noParamCount = 0;
      survey.setValue("q2", "a");
      expect(depCount, "dep is skipped when a non-dependent value changes").toBe(0);
      expect(noParamCount > 0, "parameterless function runs on any value change").toBeTruthy();
      depCount = 0;
      survey.setValue("q1", "b");
      expect(depCount > 0, "dep runs when its dependency changes").toBeTruthy();
      expect(survey.getValue("dep"), "dep value is calculated").toBe("b");
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("depFunc");
      FunctionFactory.Instance.unregister("noParamFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = false (default), run on any value change", () => {
    let depCount = 0;
    FunctionFactory.Instance.register("depFunc3", (params: any[]): any => { depCount++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = false;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "expression", name: "dep", expression: "depFunc3({q1})" }
        ]
      });
      depCount = 0;
      survey.setValue("q2", "a");
      expect(depCount > 0, "dep runs even when a non-dependent value changes").toBeTruthy();
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("depFunc3");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, chained expressions that depend on each other", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1", defaultValue: 1 },
          { type: "expression", name: "expA", expression: "{q1} + 1" },
          { type: "expression", name: "expB", expression: "{expA} + 1" },
          { type: "expression", name: "expC", expression: "{expB} + 1" }
        ]
      });
      expect(survey.getValue("expA"), "expA on the first run").toBe(2);
      expect(survey.getValue("expB"), "expB on the first run").toBe(3);
      expect(survey.getValue("expC"), "expC on the first run").toBe(4);
      survey.setValue("q1", 10);
      expect(survey.getValue("expA"), "expA after q1 change").toBe(11);
      expect(survey.getValue("expB"), "expB cascades after q1 change").toBe(12);
      expect(survey.getValue("expC"), "expC cascades after q1 change").toBe(13);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression with several dependencies", () => {
    let count = 0;
    FunctionFactory.Instance.register("multiFunc", (params: any[]): any => { count++; return params[0] + params[1]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "text", name: "q3" },
          { type: "expression", name: "exp", expression: "multiFunc({q1}, {q2})" }
        ]
      });
      count = 0;
      survey.setValue("q3", 1);
      expect(count, "skipped when a non-dependent value changes").toBe(0);
      count = 0;
      survey.setValue("q1", 2);
      expect(count > 0, "runs when the first dependency changes").toBeTruthy();
      count = 0;
      survey.setValue("q2", 3);
      expect(count > 0, "runs when the second dependency changes").toBeTruthy();
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("multiFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression depends on a variable", () => {
    let count = 0;
    FunctionFactory.Instance.register("varFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "expression", name: "exp", expression: "varFunc({myVar})" }
        ]
      });
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "not recalculated for a non-dependent value").toBe(0);
      survey.setVariable("myVar", 5);
      expect(count > 0, "recalculated when the variable changes").toBeTruthy();
      expect(survey.getValue("exp"), "variable value is calculated").toBe(5);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("varFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, constant expression", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "expression", name: "exp", expression: "2 + 3" }
        ]
      });
      expect(survey.getValue("exp"), "constant expression is calculated on the first run").toBe(5);
      survey.setValue("q1", "a");
      expect(survey.getValue("exp"), "constant expression keeps its value").toBe(5);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, runExpressions re-runs everything", () => {
    let count = 0;
    FunctionFactory.Instance.register("depFunc4", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "expression", name: "exp", expression: "depFunc4({q1})" }
        ]
      });
      count = 0;
      survey.setValue("q2", "a");
      expect(count, "skipped when a non-dependent value changes").toBe(0);
      survey.runExpressions();
      expect(count > 0, "runExpressions forces a full re-run").toBeTruthy();
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("depFunc4");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression inside a dynamic panel", () => {
    let count = 0;
    FunctionFactory.Instance.register("panelDepFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
            { type: "text", name: "pq1" },
            { type: "expression", name: "pexp", expression: "panelDepFunc({panel.pq1})" }
          ] }
        ]
      });
      const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a value outside the panel changes").toBe(0);
      pd.panels[0].getQuestionByName("pq1").value = "b";
      expect(count > 0, "runs when the in-panel dependency changes").toBeTruthy();
      expect(pd.panels[0].getQuestionByName("pexp").value, "in-panel expression is calculated").toBe("b");
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("panelDepFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression inside a dynamic panel depends on an outside question", () => {
    let count = 0;
    FunctionFactory.Instance.register("topDepFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
            { type: "expression", name: "pexp", expression: "topDepFunc({q2})" }
          ] }
        ]
      });
      const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a non-dependent value changes").toBe(0);
      survey.setValue("q2", "b");
      expect(count > 0, "runs when the outside dependency changes").toBeTruthy();
      expect(pd.panels[0].getQuestionByName("pexp").value, "in-panel expression is calculated").toBe("b");
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("topDepFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression inside a nested dynamic panel", () => {
    let count = 0;
    FunctionFactory.Instance.register("nestedFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "paneldynamic", name: "outerPanel", panelCount: 1, templateElements: [
            { type: "paneldynamic", name: "innerPanel", panelCount: 1, templateElements: [
              { type: "text", name: "iq1" },
              { type: "expression", name: "iexp", expression: "nestedFunc({panel.iq1})" }
            ] }
          ] }
        ]
      });
      const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outerPanel");
      const inner = <QuestionPanelDynamicModel>outer.panels[0].getQuestionByName("innerPanel");
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a value outside the panels changes").toBe(0);
      inner.panels[0].getQuestionByName("iq1").value = 5;
      expect(count > 0, "runs when the nested in-panel dependency changes").toBeTruthy();
      expect(inner.panels[0].getQuestionByName("iexp").value, "nested in-panel expression is calculated").toBe(5);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("nestedFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression depends on parentPanel", () => {
    let count = 0;
    FunctionFactory.Instance.register("parentFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "paneldynamic", name: "outerPanel", panelCount: 1, templateElements: [
            { type: "text", name: "opq1" },
            { type: "paneldynamic", name: "innerPanel", panelCount: 1, templateElements: [
              { type: "expression", name: "iexp", expression: "parentFunc({parentPanel.opq1})" }
            ] }
          ] }
        ]
      });
      const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outerPanel");
      const inner = <QuestionPanelDynamicModel>outer.panels[0].getQuestionByName("innerPanel");
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a value outside the panels changes").toBe(0);
      outer.panels[0].getQuestionByName("opq1").value = "b";
      expect(count > 0, "runs when the parent panel dependency changes").toBeTruthy();
      expect(inner.panels[0].getQuestionByName("iexp").value, "parentPanel expression is calculated").toBe("b");
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("parentFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression column inside a dynamic matrix", () => {
    let count = 0;
    FunctionFactory.Instance.register("rowFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "matrixdynamic", name: "mx", rowCount: 1, columns: [
            { name: "col1", cellType: "text" },
            { name: "col2", cellType: "expression", expression: "rowFunc({row.col1})" }
          ] }
        ]
      });
      const mx = <QuestionMatrixDynamicModel>survey.getQuestionByName("mx");
      const rows = mx.visibleRows;
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a value outside the matrix changes").toBe(0);
      rows[0].cells[0].question.value = 7;
      expect(count > 0, "runs when the row dependency changes").toBeTruthy();
      expect(rows[0].cells[1].question.value, "cell expression is calculated").toBe(7);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("rowFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression column depends on an outside question", () => {
    let count = 0;
    FunctionFactory.Instance.register("rowFunc2", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "matrixdynamic", name: "mx", rowCount: 1, columns: [
            { name: "col1", cellType: "expression", expression: "rowFunc2({q2})" }
          ] }
        ]
      });
      const mx = <QuestionMatrixDynamicModel>survey.getQuestionByName("mx");
      const rows = mx.visibleRows;
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a non-dependent value changes").toBe(0);
      survey.setValue("q2", "b");
      expect(count > 0, "runs when the outside dependency changes").toBeTruthy();
      expect(rows[0].cells[0].question.value, "cell expression is calculated").toBe("b");
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("rowFunc2");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression column inside a matrix nested in a dynamic panel", () => {
    let count = 0;
    FunctionFactory.Instance.register("nestedRowFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
            { type: "matrixdynamic", name: "mx", rowCount: 1, columns: [
              { name: "col1", cellType: "text" },
              { name: "col2", cellType: "expression", expression: "nestedRowFunc({row.col1})" }
            ] }
          ] }
        ]
      });
      const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      const mx = <QuestionMatrixDynamicModel>pd.panels[0].getQuestionByName("mx");
      const rows = mx.visibleRows;
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a value outside the panel changes").toBe(0);
      rows[0].cells[0].question.value = 3;
      expect(count > 0, "runs when the nested row dependency changes").toBeTruthy();
      expect(rows[0].cells[1].question.value, "nested cell expression is calculated").toBe(3);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("nestedRowFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression column depends on totalRow", () => {
    let count = 0;
    FunctionFactory.Instance.register("totalRowFunc", (params: any[]): any => { count++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "matrixdynamic", name: "mx", rowCount: 2, columns: [
            { name: "col1", cellType: "text", totalType: "sum" },
            { name: "col2", cellType: "expression", expression: "totalRowFunc({totalRow.col1})" }
          ] }
        ]
      });
      const mx = <QuestionMatrixDynamicModel>survey.getQuestionByName("mx");
      const rows = mx.visibleRows;
      count = 0;
      survey.setValue("q1", "a");
      expect(count, "skipped when a value outside the matrix changes").toBe(0);
      rows[0].cells[0].question.value = 5;
      expect(count > 0, "runs when the total row dependency changes").toBeTruthy();
      expect(rows[0].cells[1].question.value, "totalRow expression is calculated").toBe(5);
      count = 0;
      rows[1].cells[0].question.value = 3;
      expect(count > 0, "runs when the total changes via another row").toBeTruthy();
      expect(rows[0].cells[1].question.value, "totalRow expression is recalculated").toBe(8);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("totalRowFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression columns depend on prevRow and nextRow", () => {
    let prevCount = 0;
    let nextCount = 0;
    FunctionFactory.Instance.register("prevRowFunc", (params: any[]): any => { prevCount++; return params[0]; });
    FunctionFactory.Instance.register("nextRowFunc", (params: any[]): any => { nextCount++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "matrixdynamic", name: "mx", rowCount: 2, columns: [
            { name: "col1", cellType: "text" },
            { name: "col2", cellType: "expression", expression: "prevRowFunc({prevRow.col1})" },
            { name: "col3", cellType: "expression", expression: "nextRowFunc({nextRow.col1})" }
          ] }
        ]
      });
      const mx = <QuestionMatrixDynamicModel>survey.getQuestionByName("mx");
      const rows = mx.visibleRows;
      prevCount = 0;
      nextCount = 0;
      survey.setValue("q1", "a");
      expect(prevCount, "prevRow is skipped when a value outside the matrix changes").toBe(0);
      expect(nextCount, "nextRow is skipped when a value outside the matrix changes").toBe(0);
      rows[0].cells[0].question.value = 5;
      expect(prevCount > 0, "prevRow runs when a matrix value changes").toBeTruthy();
      expect(rows[1].cells[1].question.value, "prevRow expression in the second row is calculated").toBe(5);
      rows[1].cells[0].question.value = 7;
      expect(nextCount > 0, "nextRow runs when a matrix value changes").toBeTruthy();
      expect(rows[0].cells[2].question.value, "nextRow expression in the first row is calculated").toBe(7);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("prevRowFunc");
      FunctionFactory.Instance.unregister("nextRowFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expressions depend on prevPanel and nextPanel", () => {
    let prevCount = 0;
    let nextCount = 0;
    FunctionFactory.Instance.register("prevPanelFunc", (params: any[]): any => { prevCount++; return params[0]; });
    FunctionFactory.Instance.register("nextPanelFunc", (params: any[]): any => { nextCount++; return params[0]; });
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "paneldynamic", name: "pd", panelCount: 2, templateElements: [
            { type: "text", name: "pq1" },
            { type: "expression", name: "expPrev", expression: "prevPanelFunc({prevPanel.pq1})" },
            { type: "expression", name: "expNext", expression: "nextPanelFunc({nextPanel.pq1})" }
          ] }
        ]
      });
      const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      prevCount = 0;
      nextCount = 0;
      survey.setValue("q1", "a");
      expect(prevCount, "prevPanel is skipped when a value outside the panel changes").toBe(0);
      expect(nextCount, "nextPanel is skipped when a value outside the panel changes").toBe(0);
      pd.panels[0].getQuestionByName("pq1").value = 5;
      expect(prevCount > 0, "prevPanel runs when a panel value changes").toBeTruthy();
      expect(pd.panels[1].getQuestionByName("expPrev").value, "prevPanel expression in the second panel is calculated").toBe(5);
      pd.panels[1].getQuestionByName("pq1").value = 7;
      expect(nextCount > 0, "nextPanel runs when a panel value changes").toBeTruthy();
      expect(pd.panels[0].getQuestionByName("expNext").value, "nextPanel expression in the first panel is calculated").toBe(7);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      FunctionFactory.Instance.unregister("prevPanelFunc");
      FunctionFactory.Instance.unregister("nextPanelFunc");
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, expression depends on panelIndex and visiblePanelIndex", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          { type: "paneldynamic", name: "pd", panelCount: 2,
            templateVisibleIf: "{q1} != 'hideFirst' or {panelIndex} > 0",
            templateElements: [
              { type: "expression", name: "pIdx", expression: "{panelIndex}" },
              { type: "expression", name: "vIdx", expression: "{visiblePanelIndex}" }
            ] }
        ]
      });
      const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      expect(pd.panels[0].getQuestionByName("pIdx").value, "panelIndex in the first panel").toBe(0);
      expect(pd.panels[1].getQuestionByName("pIdx").value, "panelIndex in the second panel").toBe(1);
      expect(pd.panels[1].getQuestionByName("vIdx").value, "visiblePanelIndex in the second panel").toBe(1);
      pd.addPanel();
      expect(pd.panels[2].getQuestionByName("pIdx").value, "panelIndex in the added panel").toBe(2);
      expect(pd.panels[2].getQuestionByName("vIdx").value, "visiblePanelIndex in the added panel").toBe(2);
      survey.setValue("q1", "hideFirst");
      expect(pd.panels[0].visible, "the first panel is hidden").toBeFalsy();
      expect(pd.panels[1].getQuestionByName("vIdx").value, "visiblePanelIndex is recalculated in the second panel").toBe(0);
      expect(pd.panels[2].getQuestionByName("vIdx").value, "visiblePanelIndex is recalculated in the third panel").toBe(1);
      expect(pd.panels[1].getQuestionByName("pIdx").value, "panelIndex is not changed in the second panel").toBe(1);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
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
  test("survey.onExpressionRunning, expressionQuestionTrackDependencies = false, #10258", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = false;
    try {
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
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("survey.onExpressionRunning, expressionQuestionTrackDependencies = true, #10258", () => {
    // An onExpressionRunning subscriber can rewrite expressions, so dependency
    // tracking is disabled while the event has subscribers: the event fires once
    // per evaluation and the behavior matches expressionQuestionTrackDependencies = false.
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
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
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, total row recalculates when row visibility depends on another question, Bug#11636", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          {
            type: "matrixdynamic", name: "matrix",
            rowsVisibleIf: "{row.col1} != {q1}", cellType: "text",
            columns: [{ name: "col1" }, { name: "col2", totalType: "sum" }]
          }
        ]
      });
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
      matrix.value = [{ col1: "a", col2: 5 }, { col1: "b", col2: 10 }, { col1: "a", col2: 15 }];
      expect(matrix.visibleRows.length, "all rows are visible").toBe(3);
      expect(matrix.visibleTotalRow.cells[1].value, "total sum #1, all rows are visible").toBe(30);
      survey.setValue("q1", "b");
      expect(matrix.visibleRows.length, "row2 is hidden").toBe(2);
      expect(matrix.visibleTotalRow.cells[1].value, "total sum #2, row2 is hidden").toBe(20);
      survey.setValue("q1", "a");
      expect(matrix.visibleRows.length, "row1 and row3 are hidden").toBe(1);
      expect(matrix.visibleTotalRow.cells[1].value, "total sum #3, row1 and row3 are hidden").toBe(10);
      survey.setValue("q1", "c");
      expect(matrix.visibleRows.length, "all rows are visible again").toBe(3);
      expect(matrix.visibleTotalRow.cells[1].value, "total sum #4, all rows are visible again").toBe(30);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, totalExpression with a condition that references another question, Bug#11636", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1", defaultValue: 0 },
          {
            type: "matrixdynamic", name: "q2",
            columns: [
              { cellType: "text", name: "col1", totalExpression: "sumInArray({matrix}, 'col1', '{col2} > {q1}')" },
              { cellType: "text", name: "col2" }
            ]
          }
        ]
      });
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
      matrix.value = [
        { col1: 1, col2: 10 },
        { col1: 2, col2: 20 },
        { col1: 3, col2: 30 },
        { col1: 4, col2: 40 },
      ];
      expect(matrix.totalValue, "Total value #1").toEqual({ col1: 10 });
      survey.setValue("q1", 15);
      expect(matrix.totalValue, "Total value #2").toEqual({ col1: 9 });
      survey.setValue("q1", 35);
      expect(matrix.totalValue, "Total value #3").toEqual({ col1: 4 });
      survey.setValue("q1", 1);
      expect(matrix.totalValue, "Total value #4").toEqual({ col1: 10 });
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, total value recalculates on a value change after totalType is changed, Bug#11636", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    try {
      const survey = new SurveyModel();
      const page = survey.addNewPage("p1");
      const matrix = new QuestionMatrixDynamicModel("q1");
      page.addElement(matrix);
      matrix.addColumn("col1");
      matrix.columns[0].totalType = "count";
      matrix.value = [{ col1: 1 }, { col1: 2 }, {}, { col1: 3 }];
      matrix.visibleRows;
      const question = matrix.visibleTotalRow.cells[0].question;
      expect(question.value, "There are 3 values").toBe(3);
      matrix.columns[0].totalType = "min";
      survey.setValue("q2", 1);
      expect(question.value, "Min is 1").toBe(1);
      matrix.columns[0].totalType = "max";
      survey.setValue("q2", 2);
      expect(question.value, "Max is 3").toBe(3);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("settings.expressionQuestionTrackDependencies = true, cell and total expressions inside a custom question, Bug#11636", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = true;
    ComponentCollection.Instance.add(<any>{
      name: "order",
      questionJSON: {
        type: "matrixdropdown",
        columns: [
          { name: "price", cellType: "expression" },
          { name: "qty", cellType: "dropdown", choices: [1, 2, 3, 4, 5] },
          { name: "total", cellType: "expression", expression: "{row.qty} * {row.price}", totalType: "sum" },
        ],
        rows: ["Steak", "Salmon"],
        defaultValue: { Steak: { price: 23 }, Salmon: { price: 19 } },
      },
    });
    try {
      const survey = new SurveyModel({
        elements: [{ type: "order", name: "q1" }],
      });
      const q = <QuestionCustomModel>survey.getAllQuestions()[0];
      const matrix = <QuestionMatrixDropdownModel>q.contentQuestion;
      matrix.visibleRows[0].getQuestionByColumnName("qty").value = 2;
      expect(survey.data, "cell and total expressions are recalculated").toEqual({
        q1: {
          Steak: { price: 23, qty: 2, total: 46 },
          Salmon: { price: 19, total: 0 },
        },
        "q1-total": { total: 46 },
      });
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
      ComponentCollection.Instance.clear();
    }
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

  test("Recalculate the expression when it is assigned at runtime, Bug#11798", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "n" },
        { type: "expression", name: "q", expression: "{n} + 100" }
      ]
    });
    survey.setValue("n", 5);
    const q = <QuestionExpressionModel>survey.getQuestionByName("q");
    expect(q.value, "the initial expression is calculated").toBe(105);

    q.expression = "{n} + 1";
    expect(q.value, "the new expression is calculated on assignment").toBe(6);
    expect(q.displayValue, "the display value is updated as well").toBe("6");

    survey.setValue("n", 6);
    expect(q.value, "the new expression is calculated on a value change").toBe(7);
  });
  test("Recalculate the expression assigned at runtime, settings.expressionQuestionTrackDependencies is false, Bug#11798", () => {
    const prevTrackDependencies = settings.expressionQuestionTrackDependencies;
    settings.expressionQuestionTrackDependencies = false;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "n" },
          { type: "expression", name: "q", expression: "{n} + 100" }
        ]
      });
      survey.setValue("n", 5);
      const q = <QuestionExpressionModel>survey.getQuestionByName("q");
      q.expression = "{n} + 1";
      expect(q.value, "the new expression is calculated on assignment").toBe(6);
    } finally {
      settings.expressionQuestionTrackDependencies = prevTrackDependencies;
    }
  });
  test("Do not run the expression assigned at runtime in a read-only question, Bug#11798", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "n" },
        { type: "expression", name: "q", expression: "{n} + 100" }
      ]
    });
    survey.setValue("n", 5);
    const q = <QuestionExpressionModel>survey.getQuestionByName("q");
    survey.mode = "display";
    q.expression = "{n} + 1";
    expect(q.value, "the expression is not run in a read-only question").toBe(105);

    q.runIfReadOnly = true;
    q.expression = "{n} + 2";
    expect(q.value, "runIfReadOnly allows running the expression").toBe(7);
  });
  test("Do not run the expression assigned at runtime in the design mode, Bug#11798", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        { type: "text", name: "n" },
        { type: "expression", name: "q" }
      ]
    });
    const q = <QuestionExpressionModel>survey.getQuestionByName("q");
    q.expression = "1 + 1";
    expect(q.value, "the expression is not run in the design mode").toBeFalsy();
  });
});
// visibleIf is registered with strict dependencies: it runs only when a value or variable it uses
// changed. These cover the references that never appear in the changed keys as written.
describe("Strict dependencies: which changes run a visibleIf", () => {
  test("a built-in variable {correctanswers} counts as changed", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", correctAnswer: "a" },
        { type: "text", name: "q2", visibleIf: "{correctanswers} = 1" }
      ]
    });
    const q2 = survey.getQuestionByName("q2");
    expect(q2.isVisible, "nothing answered").toBe(false);
    survey.setValue("q1", "a");
    expect(q2.isVisible, "q1 is correct").toBe(true);
    survey.setValue("q1", "b");
    expect(q2.isVisible, "q1 is wrong").toBe(false);
  });
  test("names and changed keys are compared case-insensitively", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "Age" },
        { type: "text", name: "q2", visibleIf: "{age} > 1" },
        { type: "text", name: "age2" },
        { type: "text", name: "q3", visibleIf: "{AGE2} > 1" },
        { type: "matrix", name: "m", columns: ["a", "b"], rows: ["row1", "row2"] },
        { type: "text", name: "q4", visibleIf: "{M.row1} = 'b'" },
        { type: "checkbox", name: "Fruits", choices: ["apple", "banana"], valuePropertyName: "fruit" },
        { type: "text", name: "q5", visibleIf: "{fruits-unwrapped} contains 'apple'" }
      ]
    });
    survey.setValue("Age", 30);
    expect(survey.getQuestionByName("q2").isVisible, "key Age, name {age}").toBe(true);
    survey.setValue("age2", 40);
    expect(survey.getQuestionByName("q3").isVisible, "key age2, name {AGE2}").toBe(true);
    survey.setValue("m", { row2: "a" });
    expect(survey.getQuestionByName("q4").isVisible, "key m, another row").toBe(false);
    survey.setValue("m", { row2: "a", row1: "b" });
    expect(survey.getQuestionByName("q4").isVisible, "key m, name {M.row1}").toBe(true);
    survey.getQuestionByName("Fruits").renderedValue = ["apple"];
    expect(survey.getQuestionByName("q5").isVisible, "key Fruits, name {fruits-unwrapped}").toBe(true);
  });
});
// The survey walks only the questions whose resetValueIf/setValueIf/setValueExpression (or a trigger
// a subclass registers) can run, plus the questions that forward triggers to nested questions.
// The list is built on the first walk, so every test changes a value first ("warm-up") and only then
// changes the survey or a trigger property.
describe("Question triggers: the survey walks only the questions that have them", () => {
  const hasTriggers = (q: Question): boolean => !!q.resetValueIf || !!q.setValueIf || !!q.setValueExpression;
  const spyRunTriggers = () => vi.spyOn(Question.prototype, "runTriggers");
  const calledOn = (spy: any): Array<Question> => spy.mock.contexts as Array<Question>;

  test("trigger properties set at runtime run", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "q" }, { type: "text", name: "r" }]
    });
    const q = <Question>survey.getQuestionByName("q");
    const r = <Question>survey.getQuestionByName("r");
    survey.setValue("a", 0);
    q.setValueIf = "{a} = 1";
    q.setValueExpression = "'set'";
    survey.setValue("a", 1);
    expect(q.value, "setValueIf set at runtime").toBe("set");
    r.resetValueIf = "{a} = 2";
    r.value = "v";
    survey.setValue("a", 2);
    expect(r.isEmpty(), "resetValueIf set at runtime").toBe(true);
  });
  test("a question added at runtime runs its triggers", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" }] });
    const page = survey.pages[0];
    survey.setValue("a", 0);
    const q2 = <Question>page.addNewQuestion("text", "q2");
    q2.setValueIf = "{a} = 2";
    q2.setValueExpression = "'set2'";
    survey.setValue("a", 2);
    expect(q2.value, "added, then its triggers set").toBe("set2");
    const q3 = new QuestionTextModel("q3");
    q3.setValueIf = "{a} = 3";
    q3.setValueExpression = "'set3'";
    page.addElement(q3);
    survey.setValue("a", 3);
    expect(q3.value, "triggers set, then added").toBe("set3");
  });
  test("a panel or a page added at runtime runs the triggers of its questions", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" }] });
    survey.setValue("a", 0);
    const panel = new PanelModel("panel1");
    const pq = <Question>panel.addNewQuestion("text", "pq");
    pq.setValueIf = "{a} = 1";
    pq.setValueExpression = "'panel-set'";
    survey.pages[0].addElement(panel);
    survey.setValue("a", 1);
    expect(pq.value, "question in an added panel").toBe("panel-set");
    const page2 = new PageModel("page2");
    const pq2 = <Question>page2.addNewQuestion("text", "pq2");
    pq2.resetValueIf = "{a} = 2";
    survey.addPage(page2);
    pq2.value = "v";
    survey.setValue("a", 2);
    expect(pq2.isEmpty(), "question in an added page").toBe(true);
  });
  test("a question moved to another page runs its triggers", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "a" }] },
        { elements: [{ type: "text", name: "q", setValueIf: "{a} = 1", setValueExpression: "'moved'" }] }
      ]
    });
    const q = <Question>survey.getQuestionByName("q");
    survey.setValue("a", 0);
    q.moveTo(survey.pages[0]);
    expect(q.page, "moved to page 1").toBe(survey.pages[0]);
    survey.setValue("a", 1);
    expect(q.value, "moved question").toBe("moved");
  });
  test("a removed question, panel or page no longer runs its triggers", () => {
    const json = {
      pages: [
        { elements: [{ type: "text", name: "a" },
          { type: "text", name: "q", setValueIf: "{a} = 1", setValueExpression: "'set'" },
          { type: "panel", name: "panel1", elements: [{ type: "text", name: "pq", setValueIf: "{a} = 1", setValueExpression: "'set'" }] }] },
        { name: "page2", elements: [{ type: "text", name: "p2q", setValueIf: "{a} = 1", setValueExpression: "'set'" }] }
      ]
    };
    const checkRemoved = (remove: (survey: SurveyModel) => void, name: string) => {
      const survey = new SurveyModel(json);
      const q = <Question>survey.getQuestionByName(name);
      survey.setValue("a", 0);
      remove(survey);
      expect(survey.getAllQuestions().indexOf(q), name + " is removed").toBe(-1);
      q.value = "own";
      const spy = spyRunTriggers();
      try {
        survey.setValue("a", 1);
        expect(calledOn(spy).indexOf(q), name + ": no runTriggers call").toBe(-1);
      } finally {
        spy.mockRestore();
      }
      expect(q.value, name + ": value stays as set").toBe("own");
    };
    checkRemoved(survey => survey.pages[0].removeElement(survey.getQuestionByName("q")), "q");
    checkRemoved(survey => survey.pages[0].removeElement(survey.getPanelByName("panel1")), "pq");
    checkRemoved(survey => survey.removePage(survey.getPageByName("page2")), "p2q");
  });
  test("a question whose triggers were cleared no longer runs them", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" }, { type: "text", name: "q", setValueIf: "{a} = 1", setValueExpression: "'set'" }]
    });
    const q = <Question>survey.getQuestionByName("q");
    survey.setValue("a", 0);
    q.setValueIf = "";
    q.setValueExpression = "";
    q.value = "kept";
    const spy = spyRunTriggers();
    try {
      survey.setValue("a", 1);
      expect(calledOn(spy).indexOf(q), "no runTriggers call after the clear").toBe(-1);
    } finally {
      spy.mockRestore();
    }
    expect(q.value, "the old condition is true").toBe("kept");
  });
  test("trigger properties loaded from JSON into a question in the survey run", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "a" }, { type: "text", name: "q" }] });
    const q = <Question>survey.getQuestionByName("q");
    survey.setValue("a", 0);
    q.fromJSON({ name: "q", setValueIf: "{a} = 1", setValueExpression: "'json'" });
    expect(q.setValueIf, "loaded").toBe("{a} = 1");
    survey.setValue("a", 1);
    expect(q.value).toBe("json");
  });
  test("a trigger in a dynamic panel template runs", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" },
        { type: "paneldynamic", name: "pd", panelCount: 1,
          templateElements: [{ type: "text", name: "t", setValueIf: "{a} = 1", setValueExpression: "'pd-set'" }] }]
    });
    survey.setValue("a", 1);
    expect(survey.getQuestionByName("pd").value).toEqual([{ t: "pd-set" }]);
  });
  test("the questions with triggers run in the order of getAllQuestions()", () => {
    const never = { setValueIf: "{a} = -1", setValueExpression: "'x'" };
    const reset = { resetValueIf: "{a} = -1" };
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "a" }, { type: "text", name: "x1" },
          { type: "text", name: "t1", ...never }, { type: "text", name: "x2" }, { type: "text", name: "t2", ...reset }] },
        { name: "page2", elements: [{ type: "text", name: "x3" }, { type: "text", name: "t3", ...reset },
          { type: "panel", name: "panel1", elements: [{ type: "text", name: "t4", ...never }, { type: "text", name: "x4" }] },
          { type: "text", name: "t5", ...never }] }
      ]
    });
    let counter = 0;
    const checkOrder = (reason: string) => {
      const spy = spyRunTriggers();
      try {
        survey.setValue("a", ++counter);
        const expected = survey.getAllQuestions().filter(q => hasTriggers(q)).map(q => q.name);
        const actual = calledOn(spy).filter(q => hasTriggers(q)).map(q => q.name);
        expect(actual, reason).toEqual(expected);
      } finally {
        spy.mockRestore();
      }
    };
    checkOrder("initial");
    checkOrder("warm-up done");
    survey.getQuestionByName("t5").moveTo(survey.pages[0], 0);
    checkOrder("t5 moved to the start of page 1");
    survey.getQuestionByName("t1").moveTo(survey.getPanelByName("panel1"));
    checkOrder("t1 moved into panel1");
    const page2 = survey.pages[1];
    survey.pages.splice(1, 1);
    survey.pages.splice(0, 0, page2);
    expect(survey.pages[0].name, "pages reordered").toBe("page2");
    checkOrder("pages reordered");
  });
  test("the questions with triggers run in the order of getAllQuestions() after the questions are randomized", () => {
    const elements: Array<any> = [{ type: "text", name: "a" }];
    for (let i = 1; i <= 8; i++) {
      elements.push({ type: "text", name: "t" + i, setValueIf: "{a} = -1", setValueExpression: "'x'" });
    }
    const survey = new SurveyModel({ pages: [{ name: "page1", questionOrder: "random", elements: elements }] });
    const names = () => survey.getAllQuestions().map(q => q.name);
    const checkOrder = (value: number, reason: string) => {
      const spy = spyRunTriggers();
      try {
        survey.setValue("a", value);
        const expected = survey.getAllQuestions().filter(q => hasTriggers(q)).map(q => q.name);
        expect(calledOn(spy).filter(q => hasTriggers(q)).map(q => q.name), reason).toEqual(expected);
      } finally {
        spy.mockRestore();
      }
    };
    checkOrder(1, "warm-up");
    const oldOrder = names();
    survey.randomSeed = 123456;
    expect(names(), "the questions are reordered").not.toEqual(oldOrder);
    checkOrder(2, "after randomSeed changed");
  });
  test("one value change runs only the questions in the list (instrumented)", () => {
    const elements: Array<any> = [];
    for (let i = 0; i < 200; i++) {
      elements.push({ type: "text", name: "q" + i });
    }
    elements.push({ type: "text", name: "trigger1", setValueIf: "{q0} = -1", setValueExpression: "'x'" });
    elements.push({ type: "paneldynamic", name: "pd", panelCount: 2, templateElements: [{ type: "text", name: "t" }] });
    const survey = new SurveyModel({ elements: elements });
    const countTopLevelCalls = (value: any): number => {
      const spy = spyRunTriggers();
      try {
        survey.setValue("q0", value);
        const all = survey.getAllQuestions();
        return calledOn(spy).filter(q => all.indexOf(q) > -1).length;
      } finally {
        spy.mockRestore();
      }
    };
    expect(countTopLevelCalls(1), "trigger1 and pd").toBe(2);
    const added = <Question>survey.pages[0].addNewQuestion("text", "trigger2");
    added.resetValueIf = "{q0} = -1";
    expect(countTopLevelCalls(2), "trigger1, pd and trigger2").toBe(3);
  });
  test("a trigger registered by a subclass through addTriggerInfo runs", () => {
    class QuestionCustomTriggerTextModel extends QuestionTextModel {
      constructor(name: string) {
        super(name);
        this.addTriggerInfo({
          name: "customIf",
          canRun: (): boolean => true,
          doComplete: (res: any): void => { if (res === true) { this.value = "custom"; } }
        });
      }
      public getType(): string { return "customtriggertext"; }
      public get customIf(): string { return this.getPropertyValue("customIf"); }
      public set customIf(val: string) { this.setPropertyValue("customIf", val); }
      public lateIf: string = "{a} = 3";
      public addLateTrigger(): void {
        this.addTriggerInfo({
          name: "lateIf",
          canRun: (): boolean => true,
          doComplete: (res: any): void => { if (res === true) { this.value = "late"; } }
        });
      }
    }
    Serializer.addClass("customtriggertext", [{ name: "customIf:condition" }], () => new QuestionCustomTriggerTextModel(""), "text");
    ElementFactory.Instance.registerElement("customtriggertext", (name: string) => new QuestionCustomTriggerTextModel(name));
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "a" },
          { type: "customtriggertext", name: "c1", customIf: "{a} = 1" },
          { type: "customtriggertext", name: "c2" }]
      });
      const c1 = <QuestionCustomTriggerTextModel>survey.getQuestionByName("c1");
      const c2 = <QuestionCustomTriggerTextModel>survey.getQuestionByName("c2");
      expect(c1.getType(), "the custom class is created").toBe("customtriggertext");
      expect(hasTriggers(c1), "no built-in trigger").toBe(false);
      survey.setValue("a", 1);
      expect(c1.value, "customIf from JSON").toBe("custom");
      expect(c2.isEmpty(), "c2 has no customIf").toBe(true);
      c2.customIf = "{a} = 2";
      survey.setValue("a", 2);
      expect(c2.value, "customIf set at runtime").toBe("custom");
      const c3 = <QuestionCustomTriggerTextModel>survey.pages[0].addNewQuestion("customtriggertext", "c3");
      survey.setValue("a", 0);
      c3.addLateTrigger();
      survey.setValue("a", 3);
      expect(c3.value, "trigger info registered at runtime").toBe("late");
    } finally {
      ElementFactory.Instance.unregisterElement("customtriggertext");
      Serializer.removeClass("customtriggertext");
    }
  });
  test("a trigger enabled on a later question during the walk runs in that walk", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" },
        { type: "text", name: "q1", setValueIf: "{a} = 1", setValueExpression: "'first'" },
        { type: "text", name: "q2" }]
    });
    const q2 = <Question>survey.getQuestionByName("q2");
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q1") {
        q2.setValueIf = "{a} = 1";
        q2.setValueExpression = "'second'";
      }
    });
    survey.setValue("a", 1);
    expect(survey.getValue("q1"), "q1").toBe("first");
    expect(q2.value, "q2 enabled by the q1 change").toBe("second");
  });
  // The walk rebuilds its list when the survey changes during it, so a question added after the current
  // one runs and a removed one does not. A walk over the questions taken at its start did the opposite.
  test("a question added during the walk after the current one runs in that walk", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" },
        { type: "text", name: "q1", setValueIf: "{a} = 1", setValueExpression: "'first'" }]
    });
    let q3: Question;
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q1") {
        q3 = new QuestionTextModel("q3");
        q3.setValueIf = "{a} = 1";
        q3.setValueExpression = "'third'";
        survey.pages[0].addElement(q3);
      }
    });
    survey.setValue("a", 1);
    expect(survey.getValue("q1"), "q1").toBe("first");
    expect(q3.value, "q3 added by the q1 change").toBe("third");
  });
  test("a question removed during the walk after the current one does not run", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" },
        { type: "text", name: "q1", setValueIf: "{a} = 1", setValueExpression: "'first'" },
        { type: "text", name: "q2", setValueIf: "{a} = 1", setValueExpression: "'second'" },
        { type: "text", name: "q3", setValueIf: "{a} = 1", setValueExpression: "'third'" }]
    });
    const q2 = <Question>survey.getQuestionByName("q2");
    // onValueChanging: the nested walk the q1 change starts would run q2 before onValueChanged
    survey.onValueChanging.add((_, options) => {
      if (options.name === "q1") {
        survey.pages[0].removeElement(q2);
      }
    });
    survey.setValue("a", 1);
    expect(survey.getValue("q1"), "q1").toBe("first");
    expect(q2.isEmpty(), "q2 removed by the q1 change").toBe(true);
    expect(survey.getValue("q3"), "q3 after the removed question").toBe("third");
  });
  test("the walk continues after the current question when the current question removes itself", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "a" },
        { type: "text", name: "q1", setValueIf: "{a} = 1", setValueExpression: "'first'" },
        { type: "text", name: "q2", setValueIf: "{a} = 1", setValueExpression: "'second'" }]
    });
    const q1 = <Question>survey.getQuestionByName("q1");
    survey.onValueChanged.add((_, options) => {
      if (options.name === "q1") {
        survey.pages[0].removeElement(q1);
      }
    });
    const spy = spyRunTriggers();
    try {
      survey.setValue("a", 1);
      expect(calledOn(spy).filter(q => q.name === "q2").length > 0, "q2 runs").toBe(true);
    } finally {
      spy.mockRestore();
    }
    expect(survey.getValue("q2"), "q2 after the removed current question").toBe("second");
  });
});
