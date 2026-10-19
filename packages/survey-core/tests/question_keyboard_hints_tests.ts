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

const tab = { label: "Tab", shortcut: "Tab", visible: true };
const space = { label: "Space", shortcut: "Space", visible: true };

test("checkbox hints are tab, space, and enter when auto-advance is on", () => {
  expect(hints({ type: "checkbox", choices: ["a", "b"] })).toEqual([
    { text: "to the next item", keys: [tab] },
    { text: "to select", keys: [space] }
  ]);
  expect(hints({ type: "checkbox", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual([
    { text: "to the next item", keys: [tab] },
    { text: "to select", keys: [space] },
    { text: "to submit", keys: [enterHidden] }
  ]);
  expect(hints({ type: "checkbox", choices: ["a", "b"], defaultValue: ["a"] }, { autoAdvanceEnabled: true })[2].keys[0].visible).toBe(true);
});

test("multi-select image picker uses the checkbox hint row", () => {
  const choices = [{ value: "a", imageLink: "#a" }, { value: "b", imageLink: "#b" }];
  expect(hints({ type: "imagepicker", multiSelect: true, choices: choices })).toEqual([
    { text: "to the next item", keys: [tab] },
    { text: "to select", keys: [space] }
  ]);
  expect(hints({
    type: "imagepicker", multiSelect: true, choices: choices, defaultValue: ["a"]
  }, { autoAdvanceEnabled: true })[2].keys[0].visible).toBe(true);
  expect(hints({
    type: "imagepicker", choices: choices, defaultValue: "a"
  }, { autoAdvanceEnabled: true })[0].keys[0].label).toBe("↑↓←→"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
});

test("boolean radio, switch, and segmented use arrow hints", () => {
  for (const displayMode of ["segmented", "radio", "switch"]) {
    expect(hints({ type: "boolean", displayMode: displayMode })).toEqual([
      { text: "to select", keys: [arrows] }
    ]);
  }
});

test("boolean checkbox uses space and enter", () => {
  expect(hints({ type: "boolean", displayMode: "checkbox" })).toEqual([
    { text: "to select", keys: [space] }
  ]);
  expect(hints({ type: "boolean", displayMode: "checkbox" }, { autoAdvanceEnabled: true })[1].keys[0].visible).toBe(false);
  expect(hints({
    type: "boolean", displayMode: "checkbox", defaultValue: false
  }, { autoAdvanceEnabled: true })[1].keys[0].visible).toBe(true);
});

const down = { label: "↓", shortcut: "ArrowDown", visible: true }; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const spaceShown = { label: "Space", shortcut: "Space", visible: true };
const esc = { label: "Esc", shortcut: "Escape", visible: true };
const dropdownSet = [
  { text: "to open", keys: [down] },
  { text: "to select", keys: [spaceShown, enterShown] },
  { text: "to close", keys: [esc] }
];

test("dropdown hints stay one set for both popup states", () => {
  expect(hints({ type: "dropdown", choices: ["a", "b"] })).toEqual(dropdownSet);
  const empty = [
    { text: "to open", keys: [down] },
    { text: "to submit", keys: [enterHidden] },
    { text: "to select", keys: [spaceShown, enterShown] },
    { text: "to close", keys: [esc] }
  ];
  expect(hints({ type: "dropdown", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual(empty);
  const filled = [
    { text: "to open", keys: [down] },
    { text: "to submit", keys: [enterShown] },
    { text: "to select", keys: [spaceShown, enterShown] },
    { text: "to close", keys: [esc] }
  ];
  const survey = new SurveyModel({
    keyboardHintsEnabled: true,
    autoAdvanceEnabled: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"], defaultValue: "a" }]
  });
  const q = survey.getQuestionByName("q") as any;
  expect(q.getKeyboardHints()).toEqual(filled);
  expect(q.ariaKeyShortcuts).toBe("ArrowDown Enter Space Enter Escape");
  q.dropdownListModel.popupModel.show();
  q.dropdownListModel.inputString = "x";
  expect(q.getKeyboardHints()).toEqual(filled);
  expect(JSON.stringify(q.getKeyboardHints())).not.toContain("Backspace");
});

test("tagbox adds a submit chip and does not swap the set when the popup opens", () => {
  const choices = ["a", "b"];
  expect(hints({ type: "tagbox", choices: choices }).map(row => row.text)).toEqual([
    "to open", "to select", "to close"
  ]);
  const empty = hints({ type: "tagbox", choices: choices }, { autoAdvanceEnabled: true });
  expect(empty.map(row => row.text)).toEqual(["to open", "to submit", "to select", "to close"]);
  expect(empty[1].keys).toEqual([{ label: "Enter ↵", shortcut: "Enter", visible: false }]); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  const filled = hints({ type: "tagbox", choices: choices, defaultValue: ["a"] }, { autoAdvanceEnabled: true });
  expect(filled[1].keys[0].visible).toBe(true);
  const survey = new SurveyModel({
    keyboardHintsEnabled: true,
    autoAdvanceEnabled: true,
    elements: [{ type: "tagbox", name: "q", choices: choices, defaultValue: ["a"] }]
  });
  const q = survey.getQuestionByName("q") as any;
  const before = q.getKeyboardHints();
  q.dropdownListModel.popupModel.show();
  q.dropdownListModel.inputString = "";
  expect(q.getKeyboardHints()).toEqual(before);
  expect(q.getKeyboardHints()[2].keys.every((key: { visible: boolean }) => key.visible)).toBe(true);
});
