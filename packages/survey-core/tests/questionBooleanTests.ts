import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";

import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { IAction } from "../src/actions/action";

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
    expect(q1.getTitleLocation()).toBe("hidden");
    expect(q1.hasTitle).toBe(false);
  });
  test("Boolean: useTitleAsLabel is true by default & is applied in the checkbox and switch display modes only", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1" },
        { type: "boolean", name: "q2", displayMode: "radio" },
        { type: "boolean", name: "q3", displayMode: "checkbox" },
        { type: "boolean", name: "q4", displayMode: "switch" }
      ]
    });
    const questions = <Array<QuestionBooleanModel>>survey.getAllQuestions();
    expect(questions.map(q => q.useTitleAsLabel)).toEqual([true, true, true, true]);
    expect(questions.map(q => q.isLabelRendered)).toEqual([false, false, true, true]);
    expect(questions.map(q => q.getTitleLocation())).toEqual(["top", "top", "hidden", "hidden"]);
    expect(survey.toJSON().pages[0].elements).toEqual([
      { type: "boolean", name: "q1" },
      { type: "boolean", name: "q2", displayMode: "radio" },
      { type: "boolean", name: "q3", displayMode: "checkbox" },
      { type: "boolean", name: "q4", displayMode: "switch" }
    ]);
  });
  test("Boolean: set useTitleAsLabel to false in the checkbox & switch display modes", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1", displayMode: "checkbox", useTitleAsLabel: false },
        { type: "boolean", name: "q2", displayMode: "switch", useTitleAsLabel: false }
      ]
    });
    const questions = <Array<QuestionBooleanModel>>survey.getAllQuestions();
    expect(questions.map(q => q.useTitleAsLabel)).toEqual([false, false]);
    expect(questions.map(q => q.isLabelRendered)).toEqual([false, false]);
    expect(questions.map(q => q.getTitleLocation())).toEqual(["top", "top"]);
    expect(survey.toJSON().pages[0].elements).toEqual([
      { type: "boolean", name: "q1", displayMode: "checkbox", useTitleAsLabel: false },
      { type: "boolean", name: "q2", displayMode: "switch", useTitleAsLabel: false }
    ]);
  });
  test("Boolean: useTitleAsLabel is re-applied on the displayMode change", () => {
    const q = new QuestionBooleanModel("q1");
    expect(q.useTitleAsLabel).toBe(true);
    expect(q.isLabelRendered).toBe(false);
    expect(q.getTitleLocation()).toBe("top");
    q.displayMode = "switch";
    expect(q.isLabelRendered).toBe(true);
    expect(q.getTitleLocation()).toBe("hidden");
    q.displayMode = "radio";
    expect(q.isLabelRendered).toBe(false);
    expect(q.getTitleLocation()).toBe("top");
    q.displayMode = "checkbox";
    q.useTitleAsLabel = false;
    expect(q.isLabelRendered).toBe(false);
    expect(q.getTitleLocation()).toBe("top");
    q.useTitleAsLabel = true;
    expect(q.isLabelRendered).toBe(true);
    expect(q.getTitleLocation()).toBe("hidden");
  });
  test("Boolean: useTitleAsLabel is not applied to matrix cell questions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            { name: "col1", cellType: "boolean", displayMode: "checkbox", title: "My col1" },
            { name: "col2", cellType: "boolean", displayMode: "switch", title: "My col2" }
          ],
          rows: ["row1"]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const cells = matrix.visibleRows[0].cells;
    const questions = <Array<QuestionBooleanModel>>cells.map(cell => cell.question);
    expect(questions.map(q => q.useTitleAsLabel)).toEqual([true, true]);
    expect(questions.map(q => q.isLabelRendered)).toEqual([false, false]);
    expect(questions.map(q => q.locTitle.renderedHtml)).toEqual(["row row1, column My col1", "row row1, column My col2"]);
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
  test("Boolean keyboard navigation should respect swapOrder", () => {
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
    const createEvent = (key: string) => ({
      key: key,
      target: document.createElement("div"),
      preventDefault: () => { pdCount++; },
      stopPropagation: () => { spCount++; }
    });

    // Test without swapOrder (default behavior)
    question.onKeyDownCore(createEvent("ArrowRight"));
    expect(question.booleanValue).toBe(true);
    expect(spCount).toBe(1);

    question.booleanValue = null;
    question.onKeyDownCore(createEvent("ArrowLeft"));
    expect(question.booleanValue).toBe(false);
    expect(spCount).toBe(2);

    // Test with swapOrder = true
    question.swapOrder = true;
    question.booleanValue = null;
    spCount = 0;

    // With swapOrder, ArrowRight should select false (No is on the right)
    question.onKeyDownCore(createEvent("ArrowRight"));
    expect(question.booleanValue).toBe(false);
    expect(spCount).toBe(1);

    question.booleanValue = null;
    // With swapOrder, ArrowLeft should select true (Yes is on the left)
    question.onKeyDownCore(createEvent("ArrowLeft"));
    expect(question.booleanValue).toBe(true);
    expect(spCount).toBe(2);
  });

  test("check boolean displayMode", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", displayMode: "radio" }],
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    expect(q1.displayMode).toBe("radio");
    expect(q1.renderAs).toBe("default");
    expect(q1.toJSON()).toEqual({ name: "q1", displayMode: "radio" });

    q1.displayMode = "checkbox";
    expect(q1.renderAs).toBe("default");
    expect(q1.toJSON()).toEqual({ name: "q1", displayMode: "checkbox" });

    q1.displayMode = "switch";
    expect(q1.renderAs).toBe("default");
    expect(q1.toJSON()).toEqual({ name: "q1", displayMode: "switch" });

    q1.displayMode = "segmented";
    expect(q1.renderAs).toBe("default");
    expect(q1.toJSON()).toEqual({ name: "q1" });
  });

  test("check boolean displayMode responsiveness", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1" }],
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    q1["processResponsiveness"](500, 600);
    expect(q1.renderAs).toBe("default");
    q1["processResponsiveness"](600, 500);
    expect(q1.renderAs).toBe("radio");

    q1.displayMode = "radio";
    q1["processResponsiveness"](500, 600);
    expect(q1.renderAs).toBe("radio");
    q1["processResponsiveness"](600, 500);
    expect(q1.renderAs).toBe("radio");
  });

  test("displayMode and legacy renderAs migration", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", renderAs: "checkbox" }],
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    expect(q1.displayMode).toBe("checkbox");
    expect(q1.renderAs).toBe("default");
    expect(q1.toJSON()).toEqual({ name: "q1", displayMode: "checkbox" });
  });

  test("displayMode is custom for a custom renderAs value", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", renderAs: "my-custom-renderer" }],
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    expect(q1.displayMode).toBe("custom");
    expect(q1.renderAs).toBe("my-custom-renderer");
    expect(q1.toJSON()).toEqual({ name: "q1", renderAs: "my-custom-renderer" });
  });

  test("legacy renderAs set in JSON has higher priority than displayMode", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", displayMode: "radio", renderAs: "checkbox" }],
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    expect(q1.displayMode).toBe("checkbox");
    expect(q1.renderAs).toBe("default");
    expect(q1.toJSON()).toEqual({ name: "q1", displayMode: "checkbox" });
  });

  test("Boolean checkbox: autoAdvanceEnabled waits for Enter", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "boolean", name: "q1", displayMode: "checkbox" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionBooleanModel>survey.getQuestionByName("q1");
      question.value = true;
      expect(survey.currentPageNo, "Selecting a value does not auto-advance").toBe(0);
      expect(question.supportAutoAdvance(), "Mouse or Space selection does not opt in").toBe(false);

      question.onKeyDown({ key: " ", keyCode: 32, preventDefault: () => {} });
      expect(survey.currentPageNo, "Space does not auto-advance").toBe(0);

      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter is prevented when auto-advancing").toBe(true);
      expect(survey.currentPageNo, "Enter confirms true and auto-advances").toBe(1);

      const falseSurvey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "boolean", name: "q1", displayMode: "checkbox" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const falseQuestion = <QuestionBooleanModel>falseSurvey.getQuestionByName("q1");
      falseQuestion.value = false;
      expect(falseQuestion.isEmpty(), "false is an answer").toBe(false);
      falseQuestion.onKeyDown({ key: "Enter", keyCode: 13, preventDefault: () => {} });
      expect(falseSurvey.currentPageNo, "Enter confirms false and auto-advances").toBe(1);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
  test("Boolean checkbox: Enter does not auto-advance when the value is empty, read-only, or autoAdvanceEnabled is false", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const createSurvey = (autoAdvanceEnabled?: boolean) => new SurveyModel({
        autoAdvanceEnabled,
        pages: [
          { elements: [{ type: "boolean", name: "q1", displayMode: "checkbox" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const enterEvent = () => ({ key: "Enter", keyCode: 13, shiftKey: false, preventDefault: () => {} });

      const emptySurvey = createSurvey(true);
      const emptyQuestion = <QuestionBooleanModel>emptySurvey.getQuestionByName("q1");
      emptyQuestion.onKeyDown(enterEvent());
      expect(emptySurvey.currentPageNo, "Empty value stays on the page").toBe(0);
      expect(emptyQuestion.isEmpty(), "Enter does not coerce empty to false").toBe(true);

      const readOnlySurvey = createSurvey(true);
      const readOnlyQuestion = <QuestionBooleanModel>readOnlySurvey.getQuestionByName("q1");
      readOnlyQuestion.value = true;
      readOnlyQuestion.readOnly = true;
      readOnlyQuestion.onKeyDown(enterEvent());
      expect(readOnlySurvey.currentPageNo, "Read-only stays on the page").toBe(0);

      const disabledSurvey = createSurvey(false);
      const disabledQuestion = <QuestionBooleanModel>disabledSurvey.getQuestionByName("q1");
      disabledQuestion.value = true;
      disabledQuestion.onKeyDown(enterEvent());
      expect(disabledSurvey.currentPageNo, "autoAdvanceEnabled false stays on the page").toBe(0);

      const shiftSurvey = createSurvey(true);
      const shiftQuestion = <QuestionBooleanModel>shiftSurvey.getQuestionByName("q1");
      shiftQuestion.value = true;
      shiftQuestion.onKeyDown({ key: "Enter", keyCode: 13, shiftKey: true, preventDefault: () => {} });
      expect(shiftSurvey.currentPageNo, "Shift+Enter stays on the page").toBe(0);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
  test("Boolean checkbox: Enter on a title action does not auto-advance", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "boolean", name: "q1", displayMode: "checkbox" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionBooleanModel>survey.getQuestionByName("q1");
      question.value = true;
      const root = { tagName: "DIV" };
      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { tagName: "BUTTON" },
        currentTarget: root,
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter on a title action is not prevented").toBe(false);
      expect(survey.currentPageNo, "Title action stays on the page").toBe(0);

      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { tagName: "INPUT", type: "checkbox" },
        currentTarget: root,
        preventDefault: () => { prevented = true; }
      });
      expect(survey.currentPageNo, "Enter on the checkbox input auto-advances").toBe(1);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
  test("Boolean checkbox: legacy renderAs checkbox waits for Enter", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "boolean", name: "q1", renderAs: "checkbox" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionBooleanModel>survey.getQuestionByName("q1");
      expect(question.displayMode, "legacy renderAs migrates to checkbox").toBe("checkbox");
      question.value = true;
      expect(survey.currentPageNo, "Selecting a value does not auto-advance").toBe(0);
      question.onKeyDown({ key: "Enter", keyCode: 13, preventDefault: () => {} });
      expect(survey.currentPageNo, "Enter confirms the value and auto-advances").toBe(1);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
  test("Boolean switch and segmented still auto-advance on value change", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const createSurvey = (element: any) => new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [element] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const switchSurvey = createSurvey({ type: "boolean", name: "q1", displayMode: "switch" });
      switchSurvey.getQuestionByName("q1").value = true;
      expect(switchSurvey.currentPageNo, "Switch advances on value change").toBe(1);

      const segmentedSurvey = createSurvey({ type: "boolean", name: "q1", displayMode: "segmented" });
      segmentedSurvey.getQuestionByName("q1").value = true;
      expect(segmentedSurvey.currentPageNo, "Segmented advances on value change").toBe(1);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
  test("Boolean checkbox cell in matrixdropdown does not auto-advance", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          {
            elements: [{
              type: "matrixdropdown",
              name: "q1",
              columns: [{ name: "col1", cellType: "boolean", displayMode: "checkbox" }],
              rows: ["row1"]
            }]
          },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
      const cellQuestion = <QuestionBooleanModel>matrix.visibleRows[0].cells[0].question;
      cellQuestion.value = true;
      expect(survey.currentPageNo, "Cell value change stays on the page").toBe(0);
      expect(cellQuestion.supportAutoAdvance(), "Cell stays opted out").toBe(false);
      cellQuestion.onKeyDown({ key: "Enter", keyCode: 13, preventDefault: () => {} });
      expect(survey.currentPageNo, "Enter in a matrix cell stays on the page").toBe(0);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });
  test("custom renderAs is restored when switching displayMode custom -> radio -> custom", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", renderAs: "my-custom-renderer" }],
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    expect(q1.displayMode).toBe("custom");
    expect(q1.renderAs).toBe("my-custom-renderer");

    q1.displayMode = "radio";
    expect(q1.renderAs).toBe("default");
    expect(q1.getComponentName()).not.toBe("my-custom-renderer");

    q1.displayMode = "custom";
    expect(q1.renderAs).toBe("my-custom-renderer");
    expect(q1.toJSON()).toEqual({ name: "q1", renderAs: "my-custom-renderer" });
  });
  test("allowClear: serialization, Bug#11936", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1", allowClear: true },
        { type: "boolean", name: "q2" }
      ]
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    const q2 = <QuestionBooleanModel>survey.getQuestionByName("q2");
    expect(q1.allowClear, "allowClear is loaded from JSON").toBe(true);
    expect(q2.allowClear, "allowClear is false by default").toBe(false);
    expect(q1.toJSON(), "allowClear is serialized").toEqual({ name: "q1", allowClear: true });
    expect(q2.toJSON(), "default allowClear is not serialized").toEqual({ name: "q2" });
    expect(q1.getConditionJson().allowClear, "allowClear is removed from the condition JSON").toBeUndefined();
  });
  test("allowClear: the Clear title action resets the value, Bug#11936", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", allowClear: true }]
    });
    survey.css = defaultCss;
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    const action = <IAction>q1.getTitleActions()[0];
    expect(action.title, "the action uses the clearCaption string").toBe("Clear");
    expect(action.visible, "the action is visible when allowClear is enabled").toBe(true);

    q1.booleanValue = true;
    expect(survey.data, "the value is set").toEqual({ q1: true });
    action.action();
    expect(q1.isEmpty(), "the value is cleared").toBe(true);
    expect(q1.isIndeterminate, "the question returns to the unanswered state").toBe(true);
    expect(survey.data, "the value is removed from survey data").toEqual({});

    q1.booleanValue = false;
    action.action();
    expect(q1.isEmpty(), "a false value is cleared as well").toBe(true);

    q1.allowClear = false;
    expect(action.visible, "the action is hidden when allowClear is disabled").toBe(false);
  });
  test("allowClear: the Clear title action is hidden in read-only and display modes, Bug#11936", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", allowClear: true, defaultValue: "true" }]
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    const action = <IAction>q1.getTitleActions()[0];
    expect(action.visible, "visible by default").toBe(true);

    q1.readOnly = true;
    expect(action.visible, "hidden for a read-only question").toBe(false);
    q1.readOnly = false;
    expect(action.visible, "visible again").toBe(true);

    survey.readOnly = true;
    expect(action.visible, "hidden in survey read-only mode").toBe(false);
    survey.readOnly = false;
    expect(action.visible, "visible after leaving read-only mode").toBe(true);
  });
  test("allowClear: no Clear title action in design mode, Bug#11936", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "boolean", name: "q1", allowClear: true }]
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    expect(q1.getTitleActions().length, "no title actions in design mode").toBe(0);
  });
  test("allowClear stays available when the Boolean title is hidden, Bug#11936", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "check", allowClear: true, displayMode: "checkbox", title: "Checkbox" },
        { type: "boolean", name: "sw", allowClear: true, displayMode: "switch", title: "Switch" },
        { type: "boolean", name: "asCheckbox", allowClear: true, renderAs: "checkbox", title: "Render as checkbox" },
        { type: "boolean", name: "radio", allowClear: true, displayMode: "radio", title: "Radio" },
        { type: "boolean", name: "segmented", allowClear: true, title: "Segmented" }
      ]
    });
    const check = <QuestionBooleanModel>survey.getQuestionByName("check");
    const sw = <QuestionBooleanModel>survey.getQuestionByName("sw");
    const asCheckbox = <QuestionBooleanModel>survey.getQuestionByName("asCheckbox");
    const radio = <QuestionBooleanModel>survey.getQuestionByName("radio");
    const segmented = <QuestionBooleanModel>survey.getQuestionByName("segmented");

    expect(check.hasTitle, "a checkbox label has no header").toBe(false);
    expect(check.getTitleActions().length, "checkbox still has Clear").toBe(1);
    expect(sw.hasTitle, "a switch label has no header").toBe(false);
    expect(sw.getTitleActions().length, "switch still has Clear").toBe(1);
    sw.titleLocation = "hidden";
    expect(sw.getTitleActions().length, "a hidden title keeps Clear").toBe(1);
    expect(asCheckbox.displayMode, "renderAs checkbox becomes displayMode").toBe("checkbox");
    expect(asCheckbox.getTitleActions().length, "renderAs checkbox keeps Clear").toBe(1);
    expect(radio.getTitleActions().length, "radio keeps Clear").toBe(1);
    expect(radio.canShowClearButton, "radio Clear is visible").toBe(true);
    expect(segmented.getTitleActions().length, "segmented keeps Clear").toBe(1);

    const prop = Serializer.findProperty("boolean", "allowClear");
    expect(prop.isVisible("", check), "property stays visible without a checkbox header").toBe(true);
    expect(prop.isVisible("", sw), "property stays visible for a hidden switch title").toBe(true);
    expect(prop.isVisible("", radio), "property is visible for radio").toBe(true);
    expect(prop.isVisible("", segmented), "property is visible for segmented").toBe(true);
  });
  test("allowClear follows the title and displayMode, Bug#11936", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", allowClear: true, title: "Yes or no" }]
    });
    survey.css = defaultCss;
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    const toolbar = q1.getTitleToolbar();
    expect(toolbar.actions.length, "Clear is in the title").toBe(1);
    expect(toolbar.actions[0].visible, "Clear is visible with a title").toBe(true);

    q1.titleLocation = "hidden";
    expect(q1.hasTitle, "a hidden title is not rendered").toBe(false);
    expect(q1.canShowClearButton, "visibility does not depend on the title").toBe(true);
    expect(toolbar.actions[0].visible, "the action stays visible for the title bar").toBe(true);

    q1.titleLocation = "top";
    q1.displayMode = "checkbox";
    expect(q1.getTitleActions().length, "checkbox keeps Clear").toBe(1);
    expect(toolbar.actions.length, "the toolbar keeps Clear").toBe(1);

    q1.displayMode = "switch";
    expect(q1.getTitleActions().length, "switch keeps Clear").toBe(1);

    q1.displayMode = "radio";
    expect(q1.getTitleActions().length, "radio keeps Clear").toBe(1);
    expect((<IAction>q1.getTitleActions()[0]).visible, "radio Clear is visible").toBe(true);
  });

});
