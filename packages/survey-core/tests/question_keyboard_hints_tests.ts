import { expect, test } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { Serializer } from "../src/jsonobject";
import { IKeyboardHint } from "../src/keyboard-hints";

export function hints(question: any, surveyExtra: any = {}): IKeyboardHint[] {
  const survey = new SurveyModel(Object.assign({
    keyboardHintsEnabled: true,
    elements: [Object.assign({ name: "q" }, question)]
  }, surveyExtra));
  return (survey.getQuestionByName("q") as Question).getKeyboardHints();
}

test("keyboardHintsEnabled defaults to false", () => {
  expect(Serializer.findProperty("survey", "keyboardHintsEnabled").getDefaultValue(undefined)).toBe(false);
  expect(Serializer.findProperty("radiogroup", "keyboardHintsEnabled")).toBeFalsy();
  const plain = new SurveyModel();
  expect(plain.keyboardHintsEnabled).toBe(false);
  expect(plain.toJSON().keyboardHintsEnabled).toBeUndefined();
  const loaded = new SurveyModel({ keyboardHintsEnabled: true });
  expect(loaded.keyboardHintsEnabled).toBe(true);
  expect(loaded.toJSON().keyboardHintsEnabled).toBe(true);
});

test("questions with no hint table stay empty when the flag is on", () => {
  expect(hints({ type: "expression", expression: "1+1" })).toEqual([]);
  expect(hints({ type: "html", html: "<p>x</p>" })).toEqual([]);
});

test("english keyboard hint strings", () => {
  const survey = new SurveyModel();
  expect(survey.getLocalizationString("keyboardHintSelectText")).toBe("to select");
  expect(survey.getLocalizationString("keyboardHintSubmitText")).toBe("to submit");
  expect(survey.getLocalizationString("keyboardHintOrText")).toBe("or");
  expect(survey.getLocalizationString("keyboardHintNewLineText")).toBe("to add a line");
  expect(survey.getLocalizationString("keyboardHintNextItemText")).toBe("to the next item");
  expect(survey.getLocalizationString("keyboardHintMoveText")).toBe("to move");
  expect(survey.getLocalizationString("keyboardHintOpenText")).toBe("to open");
  expect(survey.getLocalizationString("keyboardHintCloseText")).toBe("to close");
});

import { getLocaleString } from "../src/surveyStrings";
import "../src/localization/german";

test("german keyboard hint strings are translated", () => {
  expect(getLocaleString("keyboardHintSelectText", "de")).toBe("zum Auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintSubmitText", "de")).toBe("zum Absenden");
  expect(getLocaleString("keyboardHintOrText", "de")).toBe("oder");
  expect(getLocaleString("keyboardHintNewLineText", "de")).toBe("zum Hinzufügen einer Zeile"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintNextItemText", "de")).toBe("zum nächsten Element"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintMoveText", "de")).toBe("zum Verschieben");
  expect(getLocaleString("keyboardHintOpenText", "de")).toBe("zum Öffnen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintCloseText", "de")).toBe("zum Schließen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
});

const arrows = { label: "↑↓←→", shortcut: "ArrowUp ArrowDown ArrowLeft ArrowRight", visible: true }; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const enterHidden = { label: "Enter ↵", shortcut: "Enter", visible: false }; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const enterShown = { label: "Enter ↵", shortcut: "Enter", visible: true }; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code

test("radio hints follow auto-advance, the value, and the comment area", () => {
  expect(hints({ type: "radiogroup", choices: ["a", "b"] })).toEqual([
    { text: "to select", keys: [arrows] }
  ]);
  expect(hints({ type: "radiogroup", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual([
    { text: "to select", keys: [arrows] },
    { text: "to submit", keys: [enterHidden] }
  ]);
  expect(hints({ type: "radiogroup", choices: ["a", "b"], defaultValue: "a" }, { autoAdvanceEnabled: true })).toEqual([
    { text: "to select", keys: [arrows] },
    { text: "to submit", keys: [enterShown] }
  ]);
  expect(hints({
    type: "radiogroup",
    defaultValue: "a",
    choices: [{ value: "a", showCommentArea: true }, "b"]
  }, { autoAdvanceEnabled: true })[1].keys[0].visible).toBe(false);
});

test("single image picker uses arrow and enter hints", () => {
  const choices = [{ value: "a", imageLink: "#a" }, { value: "b", imageLink: "#b" }];
  expect(hints({ type: "imagepicker", choices: choices, defaultValue: "a" })).toEqual([
    { text: "to select", keys: [arrows] }
  ]);
  expect(hints({ type: "imagepicker", choices: choices }, { autoAdvanceEnabled: true })[1].keys[0].visible).toBe(false);
  expect(hints({ type: "imagepicker", choices: choices, defaultValue: "a" }, { autoAdvanceEnabled: true })[1].keys[0].visible).toBe(true);
});

test("the hint row is suppressed by the shared gate", () => {
  const survey = new SurveyModel({
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const q = survey.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(q.getKeyboardHints()).toEqual([]);
  survey.keyboardHintsEnabled = true;
  expect(q.getKeyboardHints().length).toBe(1);
  survey.setDesignMode(true);
  expect(q.getKeyboardHints()).toEqual([]);
  survey.setDesignMode(false);
  q.readOnly = true;
  expect(q.getKeyboardHints()).toEqual([]);
  q.readOnly = false;
  survey.mode = "display";
  expect(q.getKeyboardHints()).toEqual([]);
  const bare = new QuestionRadiogroupModel("alone");
  bare.choices = ["a", "b"] as any;
  expect(bare.getKeyboardHints()).toEqual([]);
});

test("a matrix cell has no hint row and a panel question does", () => {
  const survey = new SurveyModel({
    keyboardHintsEnabled: true,
    elements: [
      { type: "panel", name: "p", elements: [{ type: "radiogroup", name: "inPanel", choices: ["a", "b"] }] },
      {
        type: "paneldynamic", name: "pd", panelCount: 1,
        templateElements: [{ type: "radiogroup", name: "inDynamic", choices: ["a", "b"] }]
      },
      {
        type: "matrixdropdown", name: "m", rows: ["r1"],
        columns: [{ name: "c", cellType: "radiogroup", choices: ["a", "b"] }]
      }
    ]
  });
  expect((survey.getQuestionByName("inPanel") as Question).getKeyboardHints().length).toBe(1);
  const dynamic = survey.getQuestionByName("pd") as any;
  expect(dynamic.panels[0].getQuestionByName("inDynamic").getKeyboardHints().length).toBe(1);
  const matrix = survey.getQuestionByName("m") as any;
  const cell = matrix.visibleRows[0].cells[0].question as Question;
  expect(cell.inMatrixMode).toBe(true);
  expect(cell.getKeyboardHints()).toEqual([]);
});

test("keyboard hints and letter badges stay independent", () => {
  const hintsOnly = new SurveyModel({
    keyboardHintsEnabled: true,
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const hinted = hintsOnly.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(hinted.getChoiceKeyBadge(hinted.visibleChoices[0])).toBeFalsy();
  expect(hinted.getKeyboardHints().length).toBe(1);
  const badgesOnly = new SurveyModel({
    choiceShortcutsEnabled: true,
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const badged = badgesOnly.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(badged.getChoiceKeyBadge(badged.visibleChoices[0])).toBe("A");
  expect(badged.getKeyboardHints()).toEqual([]);
  expect(badged.getItemAriaKeyShortcuts(badged.visibleChoices[0])).toBe("A");
  hintsOnly.choiceShortcutsEnabled = true;
  expect(hinted.getItemAriaKeyShortcuts(hinted.visibleChoices[0])).toBe("A ArrowUp ArrowDown ArrowLeft ArrowRight");
  expect(hinted.ariaKeyShortcuts).toBe("ArrowUp ArrowDown ArrowLeft ArrowRight");
});
