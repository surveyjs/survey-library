import { SurveyModel } from "../src/survey";
import { QuestionCommentModel } from "../src/question_comment";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { SurveyElement } from "../src/survey-element";
import { settings } from "../src/settings";
import { _setIsTouch } from "../src/utils/devices";

import { describe, test, expect } from "vitest";
describe("Comment question", () => {
  test("A Comment displays undefined when resetting the value", () => {
    let json = {
      "elements": [
        {
          "type": "comment",
          "name": "billing-address",
          "title": "Billing address",
          "rows": 2
        },
        {
          "type": "boolean",
          "name": "shipping-same-as-billing",
          "title": "Shipping address same as billing",
          "defaultValue": "true"
        },
        {
          "type": "comment",
          "name": "shipping-address",
          "title": "Shipping address",
          "enableIf": "{shipping-same-as-billing} = false",
          "resetValueIf": "{shipping-same-as-billing} = false",
          "setValueIf": "{shipping-same-as-billing} = true",
          "setValueExpression": "{billing-address}",
          "rows": 2
        }
      ],
      "showQuestionNumbers": "off",
      "textUpdateMode": "onTyping"
    };
    let survey = new SurveyModel(json);
    let comment1 = survey.getQuestionByName("billing-address") as QuestionCommentModel;
    let comment2 = survey.getQuestionByName("shipping-address") as QuestionCommentModel;
    let boolQuestion = survey.getQuestionByName("shipping-same-as-billing");
    const textArea1 = document.createElement("textarea");
    const textArea2 = document.createElement("textarea");
    comment1.textAreaModel.setElement(textArea1);
    comment2.textAreaModel.setElement(textArea2);

    expect(comment1.value, "commnet 1 value #1").toBe(undefined);
    expect(comment2.value, "commnet 2 value #1").toBe(undefined);
    expect(boolQuestion.value, "boolQuestion value #1").toBe(true);
    expect(textArea1.value, "textArea 1 value #1").toBe("");
    expect(textArea2.value, "textArea 2 value #1").toBe("");

    comment1.value = "test";
    expect(comment1.value, "commnet 1 value #2").toBe("test");
    expect(comment2.value, "commnet 2 value #2").toBe("test");
    expect(boolQuestion.value, "boolQuestion value #2").toBe(true);
    expect(textArea1.value, "textArea 1 value #2").toBe("test");
    expect(textArea2.value, "textArea 2 value #2").toBe("test");

    boolQuestion.value = false;
    expect(comment1.value, "commnet 1 value #3").toBe("test");
    expect(comment2.value, "commnet 2 value #3").toBe(undefined);
    expect(boolQuestion.value, "boolQuestion value #3").toBe(false);
    expect(textArea1.value, "textArea 1 value #3").toBe("test");
    expect(textArea2.value, "textArea 2 value #3").toBe("");

    textArea1.remove();
    textArea2.remove();
  });
  test("The text length validation error occurs when the minLength validator is enabled and 'allowDigits' is false Bug#8988", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "q1",
          validators: [
            { type: "text", minLength: 5,
              allowDigits: false
            }
          ]
        }
      ]
    });
    const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
    q1.value = "abcdedf";
    survey.validate(true);
    expect(q1.errors.length, "No errors").toBe(0);
    q1.value = "123456";
    survey.validate(true);
    expect(q1.errors.length, "There are errors").toBe(1);
    expect(q1.errors[0].text, "No digits allowing").toBe("Numbers are not allowed.");
  });
  test("Collapse/expand/read-only & focus Bug#10434", () => {
    const focusFunc = SurveyElement.FocusElement;
    let focusedQuestionId = "";
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "q1", state: "expanded", readOnly: true, defaultValue: "test" }
      ]
    });
    const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
    expect(q1.isReadOnly, "The question is read-only").toBe(true);
    expect(q1.isExpanded, "The question is expanded").toBe(true);
    q1.collapse();
    expect(q1.isCollapsed, "The question is collapsed").toBe(true);
    q1.expand();
    q1.focus();
    expect(q1.isExpanded, "The question is expanded again").toBe(true);
    expect(focusedQuestionId, "The question is not focused").toBe("");
    SurveyElement.FocusElement = focusFunc;
  });

  test("Textarea read-only ignores forceIsInputReadOnly Bug#7372", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "q1" }
      ]
    });
    const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
    q1.forceIsInputReadOnly = true;
    const textArea = q1.textAreaModel;
    expect(textArea.isReadOnlyAttr, "The textarea is read-only").toBe(true);
    expect(textArea.isDisabledAttr, "The textarea is not disabled").toBe(false);
    expect(q1.isReadOnly, "The question is not read-only").toBe(false);
  });

  test("Comment Question: autoAdvanceEnabled waits for Enter", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "comment", name: "q1" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      const createKeyEvent = (key: string, keyCode: number, value: string, extra: any = {}) => {
        let prevented = false;
        return {
          key,
          keyCode,
          target: { value },
          ...extra,
          preventDefault: () => { prevented = true; },
          get defaultPrevented() { return prevented; }
        };
      };

      question.value = "typed";
      question.onBlur({ target: { value: "typed" } });
      expect(survey.currentPageNo, "Value change and blur do not auto-advance").toBe(0);
      expect(question.supportAutoAdvance(), "Typing does not opt in").toBe(false);

      const enterEvent = createKeyEvent("Enter", 13, "abc");
      question.onKeyDown(enterEvent);
      expect(enterEvent.defaultPrevented, "Enter is prevented when auto-advancing").toBe(true);
      expect(survey.currentPageNo, "Enter confirms the value and auto-advances").toBe(1);
      expect(survey.data).toEqual({ q1: "abc" });
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: Enter keeps line breaks and Shift+Enter does not auto-advance", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "comment", name: "q1" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      let shiftPrevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        shiftKey: true,
        target: { value: "line1\n" },
        preventDefault: () => { shiftPrevented = true; }
      });
      expect(shiftPrevented, "Shift+Enter is not prevented").toBe(false);
      expect(survey.currentPageNo, "Shift+Enter stays on the page").toBe(0);
      expect(survey.data, "Shift+Enter does not commit the value").toEqual({});

      let prevented = false;
      const enterEvent = {
        key: "Enter",
        keyCode: 13,
        target: { value: "line1\nline2" },
        preventDefault: () => { prevented = true; },
        get defaultPrevented() { return prevented; }
      };
      question.onKeyDown(enterEvent);
      expect(enterEvent.defaultPrevented, "Enter is prevented when auto-advancing").toBe(true);
      expect(survey.currentPageNo, "Enter confirms the value and auto-advances").toBe(1);
      expect(survey.data).toEqual({ q1: "line1\nline2" });
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: Enter does not auto-advance when the value is empty, read-only, or autoAdvanceEnabled is false", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const createSurvey = (autoAdvanceEnabled?: boolean) => {
        return new SurveyModel({
          autoAdvanceEnabled,
          pages: [
            { elements: [{ type: "comment", name: "q1" }] },
            { elements: [{ type: "text", name: "q2" }] },
          ],
        });
      };
      const pressEnter = (question: QuestionCommentModel, value: string) => {
        let prevented = false;
        question.onKeyDown({
          key: "Enter",
          keyCode: 13,
          target: { value },
          preventDefault: () => { prevented = true; }
        });
        return prevented;
      };

      const emptySurvey = createSurvey(true);
      const emptyQuestion = <QuestionCommentModel>emptySurvey.getQuestionByName("q1");
      expect(pressEnter(emptyQuestion, ""), "Empty Enter is not prevented").toBe(false);
      expect(emptySurvey.currentPageNo, "Empty value stays on the page").toBe(0);

      const readOnlySurvey = createSurvey(true);
      const readOnlyQuestion = <QuestionCommentModel>readOnlySurvey.getQuestionByName("q1");
      readOnlyQuestion.readOnly = true;
      expect(pressEnter(readOnlyQuestion, "abc"), "Read-only Enter is not prevented").toBe(false);
      expect(readOnlySurvey.currentPageNo, "Read-only stays on the page").toBe(0);
      expect(readOnlySurvey.data, "Read-only Enter does not commit the value").toEqual({});

      const disabledSurvey = createSurvey(false);
      const disabledQuestion = <QuestionCommentModel>disabledSurvey.getQuestionByName("q1");
      expect(pressEnter(disabledQuestion, "abc"), "Disabled auto advance Enter is not prevented").toBe(false);
      expect(disabledSurvey.currentPageNo, "autoAdvanceEnabled false stays on the page").toBe(0);
      expect(disabledSurvey.data, "autoAdvanceEnabled false does not commit on Enter").toEqual({});
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: acceptCarriageReturn false still blocks an empty Enter and advances with text", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const createSurvey = () => {
        const survey = new SurveyModel({
          autoAdvanceEnabled: true,
          pages: [
            { elements: [{ type: "comment", name: "q1", acceptCarriageReturn: false }] },
            { elements: [{ type: "text", name: "q2" }] },
          ],
        });
        return <QuestionCommentModel>survey.getQuestionByName("q1");
      };

      const emptyQuestion = createSurvey();
      let emptyPrevented = false;
      let emptyStopped = false;
      emptyQuestion.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "" },
        preventDefault: () => { emptyPrevented = true; },
        stopPropagation: () => { emptyStopped = true; }
      });
      expect(emptyPrevented, "Empty Enter is prevented").toBe(true);
      expect(emptyStopped, "Empty Enter stops propagation").toBe(true);
      expect(emptyQuestion.survey.currentPageNo, "Empty value stays on the page").toBe(0);

      const question = createSurvey();
      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; },
        get defaultPrevented() { return prevented; }
      });
      expect(question.survey.currentPageNo, "Enter with text auto-advances").toBe(1);
      expect(question.survey.data).toEqual({ q1: "abc" });
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: textUpdateMode onTyping does not auto-advance until Enter", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "comment", name: "q1", textUpdateMode: "onTyping" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      question.onInput({ target: { value: "abc" } });
      expect(survey.currentPageNo, "Typing does not auto-advance").toBe(0);
      expect(survey.data).toEqual({ q1: "abc" });

      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; },
        get defaultPrevented() { return prevented; }
      });
      expect(survey.currentPageNo, "Enter confirms the value and auto-advances").toBe(1);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: Enter does not auto-advance if other questions are empty", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [
            { type: "comment", name: "q1" },
            { type: "text", name: "q2" }
          ] },
          { elements: [{ type: "text", name: "q3" }] },
        ],
      });
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; },
        get defaultPrevented() { return prevented; }
      });
      expect(prevented, "Enter inserts a newline when the page cannot advance").toBe(false);
      expect(survey.currentPageNo, "Stay until all questions on the page are answered").toBe(0);
      expect(survey.data).toEqual({ q1: "abc" });
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Matrix dropdown comment column does not support auto advance", () => {
    const survey = new SurveyModel({
      autoAdvanceEnabled: true,
      elements: [{
        type: "matrixdropdown",
        name: "q1",
        columns: [{ name: "col1", cellType: "comment" }],
        rows: ["row1"]
      }]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    const cellQuestion = matrix.visibleRows[0].cells[0].question;
    cellQuestion.value = "abc";
    expect(cellQuestion.getType(), "Cell question type").toBe("comment");
    expect(cellQuestion.supportAutoAdvance(), "Comment cell stays opted out").toBe(false);
    expect(matrix.supportAutoAdvance(), "Matrix stays opted out").toBe(false);
  });

  test("Comment cell Enter inserts a newline", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        elements: [{
          type: "matrixdropdown",
          name: "q1",
          columns: [{ name: "col1", cellType: "comment" }],
          rows: ["row1"]
        }]
      });
      const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
      const cellQuestion = <QuestionCommentModel>matrix.visibleRows[0].cells[0].question;
      let prevented = false;
      cellQuestion.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter in a comment cell inserts a newline").toBe(false);
      expect(survey.currentPageNo, "Comment cell stays on the page").toBe(0);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment inside a dynamic panel does not auto-advance on Enter", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{
            type: "paneldynamic",
            name: "panel",
            panelCount: 1,
            templateElements: [{ type: "comment", name: "c1" }]
          }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
      const comment = <QuestionCommentModel>panel.panels[0].getQuestionByName("c1");
      let prevented = false;
      comment.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter inserts a newline").toBe(false);
      expect(survey.currentPageNo, "Stay on the first page").toBe(0);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: last page Enter completes only when autoAdvanceAllowComplete is true", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const blocked = new SurveyModel({
        autoAdvanceEnabled: true,
        autoAdvanceAllowComplete: false,
        elements: [{ type: "comment", name: "q1" }]
      });
      const blockedQuestion = <QuestionCommentModel>blocked.getQuestionByName("q1");
      let blockedPrevented = false;
      blockedQuestion.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { blockedPrevented = true; }
      });
      expect(blockedPrevented, "Enter inserts a newline when complete is not allowed").toBe(false);
      expect(blocked.state, "Survey stays running").not.toBe("completed");

      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        autoAdvanceAllowComplete: true,
        elements: [{ type: "comment", name: "q1" }]
      });
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter is prevented when the survey completes").toBe(true);
      expect(survey.state, "Survey is completed").toBe("completed");
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: Enter does not advance or show errors when validation fails", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{
            type: "comment",
            name: "q1",
            validators: [{ type: "text", minLength: 10 }]
          }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter inserts a newline").toBe(false);
      expect(survey.currentPageNo, "Stay on the first page").toBe(0);
      expect(question.errors, "Validation stays silent").toHaveLength(0);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment cell Enter does not advance a top-level question with the same name", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [
            { type: "text", name: "col1" },
            {
              type: "matrixdropdown",
              name: "m1",
              columns: [{ name: "col1", cellType: "comment" }],
              rows: ["row1"]
            }
          ] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      survey.getQuestionByName("col1").value = "ready";
      const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m1");
      const cellQuestion = <QuestionCommentModel>matrix.visibleRows[0].cells[0].question;
      let prevented = false;
      cellQuestion.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter in the cell inserts a newline").toBe(false);
      expect(survey.currentPageNo, "The top-level question does not advance the page").toBe(0);
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: IME Enter does not auto-advance", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    try {
      const survey = new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "comment", name: "q1" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 229,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Composition Enter is not prevented").toBe(false);
      expect(survey.currentPageNo, "Composition Enter stays on the page").toBe(0);
      expect(survey.data).toEqual({});
    } finally {
      settings.autoAdvanceDelay = prevDelay;
    }
  });

  test("Comment Question: Enter on a touch device inserts a line break", () => {
    const prevDelay = settings.autoAdvanceDelay;
    settings.autoAdvanceDelay = 0;
    _setIsTouch(true);
    try {
      const createSurvey = () => new SurveyModel({
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "comment", name: "q1" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      const survey = createSurvey();
      const question = <QuestionCommentModel>survey.getQuestionByName("q1");
      let prevented = false;
      question.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { prevented = true; }
      });
      expect(prevented, "Enter is not prevented").toBe(false);
      expect(question.value, "Keydown does not write the textarea value").toBeUndefined();
      expect(survey.currentPageNo, "Stay on the first page").toBe(0);

      question.textAreaModel.onTextAreaBlur({ target: { value: "abc" } });
      expect(question.value, "Blur commits the textarea value").toBe("abc");
      expect(survey.currentPageNo, "Blur does not auto-advance").toBe(0);

      const blocked = createSurvey();
      const blockedQuestion = <QuestionCommentModel>blocked.getQuestionByName("q1");
      blockedQuestion.acceptCarriageReturn = false;
      let blockedPrevented = false;
      let stopped = false;
      blockedQuestion.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { blockedPrevented = true; },
        stopPropagation: () => { stopped = true; }
      });
      expect(blockedPrevented, "Enter is prevented when carriage return is disabled").toBe(true);
      expect(stopped, "Enter does not propagate when carriage return is disabled").toBe(true);
      expect(blocked.currentPageNo, "Stay on the first page").toBe(0);

      _setIsTouch(false);
      const desktop = createSurvey();
      const desktopQuestion = <QuestionCommentModel>desktop.getQuestionByName("q1");
      let desktopPrevented = false;
      desktopQuestion.onKeyDown({
        key: "Enter",
        keyCode: 13,
        target: { value: "abc" },
        preventDefault: () => { desktopPrevented = true; },
        get defaultPrevented() { return desktopPrevented; }
      });
      expect(desktopPrevented, "Desktop Enter is prevented when auto-advancing").toBe(true);
      expect(desktop.currentPageNo, "Desktop Enter auto-advances").toBe(1);
    } finally {
      _setIsTouch(false);
      settings.autoAdvanceDelay = prevDelay;
    }
  });
});
