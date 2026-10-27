import { afterEach, expect, test } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { Serializer } from "../src/jsonobject";
import { IKeyboardHint } from "../src/keyboard-hints";
import { getLocaleString } from "../src/surveyStrings";
import { _setIsTouch } from "../src/utils/devices";
import "../src/localization/german";

const arrows = "↑↓←→"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const enter = "Enter";
const tab = "Tab";
const space = "Space";

function row(text: string, keys: string[], visible: boolean = true): IKeyboardHint {
  return { text: text, keys: keys, visible: visible };
}

export function hints(question: any, surveyExtra: any = {}): IKeyboardHint[] {
  const survey = new SurveyModel(Object.assign({
    showKeyboardHints: true,
    elements: [Object.assign({ name: "q" }, question)]
  }, surveyExtra));
  return (survey.getQuestionByName("q") as Question).getKeyboardHints();
}

test("showKeyboardHints defaults to false on the survey and stays unset on a question", () => {
  expect(Serializer.findProperty("survey", "showKeyboardHints").getDefaultValue(undefined)).toBe(false);
  expect(Serializer.findProperty("radiogroup", "showKeyboardHints")).toBeTruthy();
  const plain = new SurveyModel();
  expect(plain.showKeyboardHints).toBe(false);
  expect(plain.toJSON().showKeyboardHints).toBeUndefined();
  const loaded = new SurveyModel({ showKeyboardHints: true });
  expect(loaded.showKeyboardHints).toBe(true);
  expect(loaded.toJSON().showKeyboardHints).toBe(true);
  const survey = new SurveyModel({
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const q = survey.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(q.showKeyboardHints).toBeUndefined();
  expect(q.toJSON().showKeyboardHints).toBeUndefined();
  q.showKeyboardHints = true;
  expect(q.getKeyboardHints().length).toBe(1);
  expect(q.toJSON().showKeyboardHints).toBe(true);
  q.showKeyboardHints = false;
  survey.showKeyboardHints = true;
  expect(q.getKeyboardHints()).toEqual([]);
  expect(q.toJSON().showKeyboardHints).toBe(false);
  q.showKeyboardHints = undefined;
  expect(q.showKeyboardHints).toBeUndefined();
  expect(q.toJSON().showKeyboardHints).toBeUndefined();
  expect(q.getKeyboardHints().length).toBe(1);
});

test("questions with no hint table stay empty when the flag is on", () => {
  expect(hints({ type: "expression", expression: "1+1" })).toEqual([]);
  expect(hints({ type: "html", html: "<p>x</p>" })).toEqual([]);
});

test("english keyboard hint strings", () => {
  const survey = new SurveyModel();
  expect(survey.getLocalizationString("keyboardHintSelectText")).toBe("to select");
  expect(survey.getLocalizationString("keyboardHintToggleText")).toBe("to toggle");
  expect(survey.getLocalizationString("keyboardHintNavigateText")).toBe("to navigate");
  expect(survey.getLocalizationString("keyboardHintContinueText")).toBe("to continue");
  expect(survey.getLocalizationString("keyboardHintSubmitText")).toBe("to submit");
  expect(survey.getLocalizationString("keyboardHintOrText")).toBe("or");
  expect(survey.getLocalizationString("keyboardHintNewLineText")).toBe("for a new line");
  expect(survey.getLocalizationString("keyboardHintNextItemText")).toBe("to next option");
  expect(survey.getLocalizationString("keyboardHintMoveText")).toBe("to move");
  expect(survey.getLocalizationString("keyboardHintOpenText")).toBe("to open");
  expect(survey.getLocalizationString("keyboardHintCloseText")).toBe("to close");
});

test("german keyboard hint strings are translated", () => {
  expect(getLocaleString("keyboardHintSelectText", "de")).toBe("zum Auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintToggleText", "de")).toBe("zum Umschalten");
  expect(getLocaleString("keyboardHintNavigateText", "de")).toBe("zum Navigieren");
  expect(getLocaleString("keyboardHintContinueText", "de")).toBe("zum Fortfahren");
  expect(getLocaleString("keyboardHintSubmitText", "de")).toBe("zum Absenden");
  expect(getLocaleString("keyboardHintOrText", "de")).toBe("oder");
  expect(getLocaleString("keyboardHintNewLineText", "de")).toBe("für eine neue Zeile"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintNextItemText", "de")).toBe("zur nächsten Option"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintMoveText", "de")).toBe("zum Verschieben");
  expect(getLocaleString("keyboardHintOpenText", "de")).toBe("zum Öffnen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintCloseText", "de")).toBe("zum Schließen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
});

test("radio hints follow auto-advance, the value, and the comment area", () => {
  expect(hints({ type: "radiogroup", choices: ["a", "b"] })).toEqual([
    row("to select", [arrows])
  ]);
  expect(hints({ type: "radiogroup", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual([
    row("to select", [arrows]),
    row("to submit", [enter], false)
  ]);
  expect(hints({ type: "radiogroup", choices: ["a", "b"], defaultValue: "a" }, { autoAdvanceEnabled: true })).toEqual([
    row("to select", [arrows]),
    row("to submit", [enter])
  ]);
  expect(hints({
    type: "radiogroup",
    defaultValue: "a",
    choices: [{ value: "a", showCommentArea: true }, "b"]
  }, { autoAdvanceEnabled: true })[1].visible).toBe(false);
});

test("single image picker uses arrow and enter hints", () => {
  const choices = [{ value: "a", imageLink: "#a" }, { value: "b", imageLink: "#b" }];
  expect(hints({ type: "imagepicker", choices: choices, defaultValue: "a" })).toEqual([
    row("to select", [arrows])
  ]);
  expect(hints({ type: "imagepicker", choices: choices }, { autoAdvanceEnabled: true })[1].visible).toBe(false);
  expect(hints({ type: "imagepicker", choices: choices, defaultValue: "a" }, { autoAdvanceEnabled: true })[1].visible).toBe(true);
});

test("the hint row is suppressed by the shared gate", () => {
  const survey = new SurveyModel({
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const q = survey.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(q.getKeyboardHints()).toEqual([]);
  survey.showKeyboardHints = true;
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
    showKeyboardHints: true,
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
    showKeyboardHints: true,
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
  expect(hinted.getKeyboardHints().length).toBe(1);
  expect(hinted.getItemAriaKeyShortcuts(hinted.visibleChoices[0])).toBe("A");
});

test("choice shortcuts do not hide keyboard hints", () => {
  const choices = ["a", "b"];
  const images = [{ value: "a", imageLink: "#a" }, { value: "b", imageLink: "#b" }];
  expect(hints({ type: "radiogroup", choices: choices }, { choiceShortcutsEnabled: true }).map(row => row.text)).toEqual(["to select"]);
  expect(hints({ type: "radiogroup", choices: choices, defaultValue: "a" }, { choiceShortcutsEnabled: true, autoAdvanceEnabled: true }).map(row => row.text)).toEqual(["to select", "to submit"]);
  expect(hints({ type: "checkbox", choices: choices, defaultValue: ["a"] }, { choiceShortcutsEnabled: true, autoAdvanceEnabled: true }).map(row => row.text)).toEqual(["to next option", "to toggle", "to submit"]);
  expect(hints({ type: "imagepicker", choices: images, defaultValue: "a" }, { choiceShortcutsEnabled: true, autoAdvanceEnabled: true }).map(row => row.text)).toEqual(["to select", "to submit"]);
  expect(hints({ type: "imagepicker", multiSelect: true, choices: images, defaultValue: ["a"] }, { choiceShortcutsEnabled: true, autoAdvanceEnabled: true }).map(row => row.text)).toEqual(["to next option", "to toggle", "to submit"]);
});

test("checkbox hints are tab, space, and enter when auto-advance is on", () => {
  expect(hints({ type: "checkbox", choices: ["a", "b"] })).toEqual([
    row("to next option", [tab]),
    row("to toggle", [space])
  ]);
  expect(hints({ type: "checkbox", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual([
    row("to next option", [tab]),
    row("to toggle", [space]),
    row("to submit", [enter], false)
  ]);
  expect(hints({ type: "checkbox", choices: ["a", "b"], defaultValue: ["a"] }, { autoAdvanceEnabled: true })[2].visible).toBe(true);
});

test("multi-select image picker uses the checkbox hint row", () => {
  const choices = [{ value: "a", imageLink: "#a" }, { value: "b", imageLink: "#b" }];
  expect(hints({ type: "imagepicker", multiSelect: true, choices: choices })).toEqual([
    row("to next option", [tab]),
    row("to toggle", [space])
  ]);
  expect(hints({
    type: "imagepicker", multiSelect: true, choices: choices, defaultValue: ["a"]
  }, { autoAdvanceEnabled: true })[2].visible).toBe(true);
  expect(hints({
    type: "imagepicker", choices: choices, defaultValue: "a"
  }, { autoAdvanceEnabled: true })[0].keys).toEqual([arrows]);
});

test("boolean radio, switch, and segmented use arrow hints", () => {
  for (const displayMode of ["segmented", "radio", "switch"]) {
    expect(hints({ type: "boolean", displayMode: displayMode })).toEqual([
      row("to select", [arrows])
    ]);
  }
});

test("boolean checkbox uses space and enter", () => {
  expect(hints({ type: "boolean", displayMode: "checkbox" })).toEqual([
    row("to toggle", [space])
  ]);
  expect(hints({ type: "boolean", displayMode: "checkbox" }, { autoAdvanceEnabled: true })[1].visible).toBe(false);
  expect(hints({
    type: "boolean", displayMode: "checkbox", defaultValue: false
  }, { autoAdvanceEnabled: true })[1].visible).toBe(true);
});

const down = "↓"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const upDown = "↑↓"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const esc = "Esc";
const dropdownSet = [
  row("to open", [down]),
  row("to navigate", [upDown]),
  row("to close", [esc])
];

test("dropdown swaps enter to select with enter to continue", () => {
  expect(hints({ type: "dropdown", choices: ["a", "b"] })).toEqual(dropdownSet);
  const empty = dropdownSet.concat([row("to submit", [enter], false)]);
  expect(hints({ type: "dropdown", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual(empty);
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [
      { type: "dropdown", name: "q", choices: ["a", "b"], defaultValue: "a" },
      { type: "text", name: "next" }
    ]
  });
  const q = survey.getQuestionByName("q") as any;
  const closed = dropdownSet.concat([row("to continue", [enter])]);
  expect(q.getKeyboardHints()).toEqual(closed);
  q.dropdownListModel.popupModel.show();
  expect(q.getKeyboardHints()).toEqual(dropdownSet.concat([row("to select", [enter])]));
  q.dropdownListModel.popupModel.hide();
  expect(q.getKeyboardHints()).toEqual(closed);
  expect(JSON.stringify(q.getKeyboardHints())).not.toContain("Backspace");
  const last = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"], defaultValue: "a" }]
  }).getQuestionByName("q") as any;
  expect(last.getKeyboardHints()[3].text).toBe("to submit");
});

test("tagbox swaps space or enter to select with enter to continue", () => {
  const choices = ["a", "b"];
  expect(hints({ type: "tagbox", choices: choices }).map(row => row.text)).toEqual([
    "to open", "to navigate", "to close"
  ]);
  const empty = hints({ type: "tagbox", choices: choices }, { autoAdvanceEnabled: true });
  expect(empty.map(row => row.text)).toEqual(["to open", "to navigate", "to close", "to submit"]);
  expect(empty[3]).toEqual(row("to submit", [enter], false));
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [
      { type: "tagbox", name: "q", choices: choices, defaultValue: ["a"] },
      { type: "text", name: "next" }
    ]
  });
  const q = survey.getQuestionByName("q") as any;
  expect(q.getKeyboardHints().map((row: IKeyboardHint) => row.text)).toEqual(["to open", "to navigate", "to close", "to continue"]);
  expect(q.getKeyboardHints()[3].visible).toBe(true);
  q.dropdownListModel.popupModel.show();
  expect(q.getKeyboardHints().map((row: IKeyboardHint) => row.text)).toEqual(["to open", "to navigate", "to close", "to select"]);
  expect(q.getKeyboardHints()[3].keys).toEqual([space, enter]);
  q.dropdownListModel.popupModel.hide();
  expect(q.getKeyboardHints()[3].text).toBe("to continue");
});

test("rating hints are only enter, and only when auto-advance is on", () => {
  expect(hints({ type: "rating" })).toEqual([]);
  expect(hints({ type: "rating" }, { autoAdvanceEnabled: true })).toEqual([
    row("to submit", [enter])
  ]);
  expect(JSON.stringify(hints({ type: "rating" }, { autoAdvanceEnabled: true }))).not.toContain("Digit");
});

test("ranking hints follow select-to-rank and auto-advance", () => {
  expect(hints({ type: "ranking", choices: ["a", "b", "c"] }).map(row => row.text)).toEqual([
    "to next option",
    "to move"
  ]);
  const ranked = hints({ type: "ranking", choices: ["a", "b", "c"] }, { autoAdvanceEnabled: true });
  expect(ranked.map(row => row.text)).toEqual(["to next option", "to move", "to submit"]);
  expect(ranked[1].keys).toEqual([upDown]);
  expect(ranked[2].visible).toBe(false);
  const selectToRank = hints({
    type: "ranking", choices: ["a", "b", "c"], selectToRankEnabled: true
  });
  expect(selectToRank.map(row => row.text)).toEqual(["to next option", "to move", "to toggle"]);
  expect(selectToRank[2].keys).toEqual([space]);
  const emptyRank = hints({
    type: "ranking", choices: ["a", "b", "c"], selectToRankEnabled: true
  }, { autoAdvanceEnabled: true });
  expect(emptyRank[emptyRank.length - 1].visible).toBe(false);
  const filledRank = hints({
    type: "ranking", choices: ["a", "b", "c"], selectToRankEnabled: true, defaultValue: ["b", "a"]
  }, { autoAdvanceEnabled: true });
  expect(filledRank[filledRank.length - 1].visible).toBe(true);
});

afterEach(() => {
  _setIsTouch(false);
});

test("enter says to continue while another question follows", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ type: "text", name: "first", defaultValue: "a" }] },
      { elements: [{ type: "text", name: "last", defaultValue: "b" }, { type: "text", name: "hidden", visible: false }] }
    ]
  });
  expect((survey.getQuestionByName("first") as Question).getKeyboardHints()[0].text).toBe("to continue");
  expect((survey.getQuestionByName("last") as Question).getKeyboardHints()[0].text).toBe("to submit");
});

test("single-line text hints enter only when the input can auto-advance", () => {
  expect(hints({ type: "text" }, { autoAdvanceEnabled: true })).toEqual([
    row("to submit", [enter], false)
  ]);
  expect(hints({ type: "text", defaultValue: "a" }, { autoAdvanceEnabled: true })[0].visible).toBe(true);
  expect(hints({ type: "text" })).toEqual([]);
  expect(hints({ type: "text", inputType: "date", defaultValue: "2020-01-01" }, { autoAdvanceEnabled: true })).toEqual([]);
  expect(hints({ type: "text", inputType: "datetime-local", defaultValue: "2020-01-01T00:00" }, { autoAdvanceEnabled: true })).toEqual([]);
  expect(hints({ type: "text", textUpdateMode: "onTyping", defaultValue: "a" }, { autoAdvanceEnabled: true })).toEqual([]);
});

test("long text hints shift+enter and enter", () => {
  expect(hints({ type: "comment", defaultValue: "a" })).toEqual([]);
  expect(hints({ type: "comment" }, { autoAdvanceEnabled: true })).toEqual([
    row("for a new line", ["Shift+Enter"]),
    row("to submit", [enter], false)
  ]);
  expect(hints({ type: "comment", defaultValue: "a" }, { autoAdvanceEnabled: true })[1].visible).toBe(true);
  expect(hints({ type: "comment", acceptCarriageReturn: false, defaultValue: "a" }, { autoAdvanceEnabled: true }).map(row => row.text)).toEqual(["to submit"]);
  _setIsTouch(true);
  expect(hints({ type: "comment", defaultValue: "a" }, { autoAdvanceEnabled: true })).toEqual([]);
  _setIsTouch(false);
});
