import { SurveyModel } from "../src/survey";

import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

import { describe, test, expect } from "vitest";
describe("boolean", () => {
  test("Test boolean labelTrue and labelFalse property", () => {
    var json = {
      elements: [
        {
          type: "boolean",
          name: "bool",
          label: "Default label tests",
        },
      ],
    };
    var survey = new SurveyModel(json);

    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

    expect(question.locLabelTrue.textOrHtml, "default labelTrue is ok").toBe("Yes");
    expect(question.locLabelFalse.textOrHtml, "default labelFalse is ok").toBe("No");
    expect(question.locLabelTrue.renderedHtml, "default locLabelTrue is ok").toBe("Yes");
    expect(question.locLabelFalse.renderedHtml, "default locLabelFalse is ok").toBe("No");
    question.labelTrue = "Check";
    question.labelFalse = "Uncheck";
    expect(question.labelTrue, "labelTrue is ok").toBe("Check");
    expect(question.labelFalse, "labelFalse is ok").toBe("Uncheck");
    expect(question.locLabelTrue.renderedHtml, "locLabelTrue is ok").toBe("Check");
    expect(question.locLabelFalse.renderedHtml, "locLabelFalse is ok").toBe("Uncheck");
  });

  //https://github.com/surveyjs/survey-library/issues/3653
  test("labelTrue/labelFalse with defaultValue", () => {
    var json = {
      elements: [
        {
          type: "boolean",
          name: "boo-1",
          defaultValue: "yes",
          valueTrue: "yes",
        },
      ],
    };
    var survey = new SurveyModel(json);

    var booleanQ = <QuestionBooleanModel>survey.getAllQuestions()[0];

    expect(booleanQ.value, "the value is equal to ValueTrue 'yes'").toBe("yes");
  });

  test("Test boolean allowClick property", () => {
    var json = {
      elements: [
        {
          type: "boolean",
          name: "bool",
          label: "Default label tests",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

    expect(question.allowClick, "allowClick true is ok").toBe(true);
    question.booleanValue = true;
    expect(question.allowClick, "allowClick false is ok").toBe(false);

    var surveyRO = new SurveyModel(json);
    var questionRO = <QuestionBooleanModel>surveyRO.getAllQuestions()[0];
    questionRO.readOnly = true;
    expect(questionRO.allowClick, "allowClick false is ok").toBe(false);
  });

  test("Check indeterminate defaultValue in design mode", () => {
    var json = {
      elements: [
        {
          type: "boolean",
          name: "q1",
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.setDesignMode(true);
    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
    expect(question.getDefaultValue(), "getDefaultValue()").toBe(undefined);
    question.defaultValue = true;
    expect(question.defaultValue).toBe("true");
    expect(question.value).toBe(true);
    question.defaultValue = undefined;
    expect(question.defaultValue, "#1").toBe(undefined);
    expect(question.value, "#2").toBe(undefined);
    question.defaultValue = false;
    expect(question.defaultValue).toBe("false");
    expect(question.value).toBe(false);
    question.defaultValue = "indeterminate";
    expect(question.defaultValue, "#3").toBe("indeterminate");
    expect(question.value, "#4").toBe(undefined);
    question.defaultValue = null;
    expect(question.defaultValue, "#5").toBe(null);
    expect(question.value, "#6").toBe(undefined);
  });
  test("Check boolean with string values", () => {
    var json = {
      elements: [
        {
          type: "boolean",
          name: "q1",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
    question.value = "true";
    expect(question.value).toBe(true);
    question.value = "false";
    expect(question.value).toBe(false);
    question.value = "indeterminate";
    expect(question.value).toBe(undefined);
  });
  test("Check boolean with valueTrue = 'true' and valueFalse = 'false'", () => {
    var json = {
      "elements": [
        {
          "type": "boolean",
          "name": "bool",
          "valueTrue": "true",
          "valueFalse": "false",
        }
      ]
    };
    var survey = new SurveyModel(json);
    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
    expect(question.valueTrue, "Deserialisation").toBe("true");
    question.booleanValue = true;
    expect(question.value, "Check value").toBe("true");
    expect(question.booleanValue, "Check booleanValue").toBe(true);
    question.booleanValue = false;
    expect(question.value, "Check value #2").toBe("false");
    expect(question.booleanValue, "Check booleanValue #2").toBe(false);
    question.booleanValue = null;
    expect(question.isEmpty(), "Check value is empty").toBe(true);
  });
  test("Remove showTitle and label", () => {
    const createBoolean = (json: any) => {
      const q = new QuestionBooleanModel("q1");
      q.fromJSON(json);
      return q;
    };
    let question = createBoolean({ "label": { default: "Label default", de: "Label de" } });
    expect(question.toJSON(), "Copy title to label").toEqual({ name: "q1", title: { default: "Label default", de: "Label de" } });
    question = createBoolean({ "title": "Title", "label": { default: "Label default", de: "Label de" } });
    expect(question.toJSON(), "Do not copy label").toEqual({ name: "q1", title: "Title" });
    question = createBoolean({ "title": "Title", "label": { default: "Label default", de: "Label de" }, titleLocation: "hidden" });
    expect(question.toJSON(), "Title location is hidden").toEqual({ name: "q1", title: { default: "Label default", de: "Label de" }, titleLocation: "hidden" });
  });

  test("Check boolean labelRenderedAriaID", () => {
    var json = {
      "elements": [
        {
          "type": "boolean",
          "name": "bool",
          "valueTrue": "true",
          "valueFalse": "false"
        }
      ]
    };
    var survey = new SurveyModel(json);
    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];
    expect(question.labelRenderedAriaID).toBe(null);

    question.titleLocation = "hidden";
    expect(question.labelRenderedAriaID.indexOf("_ariaTitle") !== -1).toBe(true);
  });

  test("Boolean shouldn't call preventDefault on key down", () => {
    var json = {
      "elements": [
        {
          "type": "boolean",
          "name": "bool",
        }
      ]
    };
    var survey = new SurveyModel(json);
    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

    let pdCount = 0;
    let spCount = 0;
    const event = {
      key: "ArrowLeft",
      target: document.createElement("div"),
      preventDefault: () => { pdCount++; },
      stopPropagation: () => { spCount++; }
    };
    question.onKeyDownCore(event);
    expect(pdCount).toBe(0);
    expect(spCount).toBe(1);
  });
  test("Boolean shouldn't set booleanValue in design time", () => {
    var json = {
      "elements": [
        {
          "type": "boolean",
          "name": "bool",
        }
      ]
    };
    var survey = new SurveyModel(json);
    var question = <QuestionBooleanModel>survey.getAllQuestions()[0];

    expect(question.value).toBe(undefined);

    question.booleanValue = true;
    expect(question.value).toBe(true);

    survey.setDesignMode(true);
    question.booleanValue = false;
    expect(question.value).toBe(true);
  });
  test("Boolean swapOrder", () => {
    const survey = new SurveyModel({});
    const question = new QuestionBooleanModel("q1");
    survey.css = defaultCss;
    question.setSurveyImpl(survey);
    expect(question.swapOrder).toBe(false);
    expect(question.getItemCss()).toBe("sd-boolean sd-boolean--allowhover sd-boolean--indeterminate");
    expect(question.getLabelCss(false)).toBe("sd-boolean__label");
    expect(question.getLabelCss(true)).toBe("sd-boolean__label");
    expect(question.locLabelLeft).toBe(question.locLabelFalse);
    expect(question.locLabelRight).toBe(question.locLabelTrue);

    question.swapOrder = true;
    expect(question.swapOrder).toBe(true);
    expect(question.getItemCss()).toBe("sd-boolean sd-boolean--allowhover sd-boolean--exchanged sd-boolean--indeterminate");
    expect(question.getLabelCss(false)).toBe("sd-boolean__label");
    expect(question.getLabelCss(true)).toBe("sd-boolean__label");
    expect(question.locLabelLeft).toBe(question.locLabelTrue);
    expect(question.locLabelRight).toBe(question.locLabelFalse);
  });
  test("Boolean in matrix dynamic", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "q1", columns: [{ cellType: "text", name: "col1" }, { cellType: "boolean", name: "col2" }], rowCount: 1 }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    q.visibleRows[0].cells[0].value = "abc";
    expect(q.value, "there is not boolean value").toEqual([{ col1: "abc" }]);
  });
  test("Boolean render as checkbox: useTitleAsLabel", () => {
    const q1 = new QuestionBooleanModel("q1");
    q1.renderAs = "checkbox";
    q1.useTitleAsLabel = true;
    expect(q1.isLabelRendered).toBe(true);
    expect(q1.titleLocation).toBe("hidden");
  });
  test("Boolean in calculation vs not, Bug#10412", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", inputType: "date", name: "a1", defaultValue: "2000-01-01" },
        { type: "boolean", name: "b1", defaultValue: true },
        { type: "boolean", name: "b2", defaultValue: true },
        { type: "expression", name: "exp1", expression: "age({a1}) >= 18 and !{b1} and !{b2}" },
      ],

    });
    const b1 = <QuestionBooleanModel>survey.getQuestionByName("b1");
    const b2 = <QuestionBooleanModel>survey.getQuestionByName("b2");
    const exp1 = survey.getQuestionByName("exp1");
    expect(exp1.value, "exp1.value #1").toBe(false);
    b1.value = !b1.value;
    expect(exp1.value, "exp1.value #2").toBe(false);
    b2.value = !b2.value;
    expect(exp1.value, "exp1.value #3").toBe(true);
  });
});
