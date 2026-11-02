import { afterEach, expect, test, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { ComponentCollection } from "../src/question_custom";
import { Serializer } from "../src/jsonobject";
import { getLocaleString } from "../src/surveyStrings";
import { _setIsTouch } from "../src/utils/devices";
import { settings } from "../src/settings";
import "../src/localization/german";

const arrows = "↑↓←→"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const horizontalArrows = "←→"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const enter = "Enter";
const tab = "Tab";
const space = "Space";
const hiddenClass = "sd-question__keyboard-hint--hidden";

function row(text: string, keys: string[]): { text: string, keys: string[] } {
  return { text: text, keys: keys };
}

function rowOf(item: { parts: Array<{ text: string, className: string }> }): { text: string, keys: string[] } {
  let text = "";
  const keys: string[] = [];
  item.parts.forEach(part => {
    if (part.className === "sd-item__shortcut-key") keys.push(part.text);
    if (part.className === "sd-question__keyboard-hint-text") text = part.text;
  });
  return { text: text, keys: keys };
}

function hints(question: any, surveyExtra: any = {}): Array<{ text: string, keys: string[] }> {
  const survey = new SurveyModel(Object.assign({
    showKeyboardHints: true,
    elements: [Object.assign({ name: "q" }, question)]
  }, surveyExtra));
  return shown(survey.getQuestionByName("q") as Question);
}

function shown(question: Question): Array<{ text: string, keys: string[] }> {
  return question.getKeyboardHintModel().items.filter(item => !item.className.includes(hiddenClass)).map(rowOf);
}

function isToggleVisible(obj: any): boolean {
  return Serializer.findProperty(obj.getType(), "showKeyboardHints").isVisible("", obj);
}

function isToggleVisibleFor(question: any): boolean {
  const survey = new SurveyModel({ elements: [Object.assign({ name: "q" }, question)] });
  return isToggleVisible(survey.getQuestionByName("q"));
}

test("showKeyboardHints is visible on question types that have hints", () => {
  const choices = ["a", "b"];
  [
    { type: "text" },
    { type: "comment" },
    { type: "radiogroup", choices: choices },
    { type: "checkbox", choices: choices },
    { type: "imagepicker", choices: choices },
    { type: "ranking", choices: choices },
    { type: "boolean" },
    { type: "rating" },
    { type: "multipletext", items: [{ name: "a" }] },
    { type: "dropdown", choices: choices },
    { type: "tagbox", choices: choices }
  ].forEach(question => {
    expect(isToggleVisibleFor(question), question.type).toBe(true);
  });
});

test("showKeyboardHints is hidden on question types without hints", () => {
  [
    { type: "buttongroup", choices: ["a", "b"] },
    { type: "slider" },
    { type: "matrix", columns: ["a"], rows: ["b"] },
    { type: "matrixdropdown", columns: [{ name: "a" }], rows: ["b"] },
    { type: "matrixdynamic", columns: [{ name: "a" }] },
    { type: "paneldynamic" },
    { type: "file" },
    { type: "signaturepad" },
    { type: "imagemap" },
    { type: "expression" },
    { type: "html" },
    { type: "image" }
  ].forEach(question => {
    expect(isToggleVisibleFor(question), question.type).toBe(false);
  });
});

test("showKeyboardHints is hidden by the question settings that remove every hint", () => {
  expect(isToggleVisibleFor({ type: "rating", displayMode: "dropdown" })).toBe(false);
  expect(isToggleVisibleFor({ type: "text", inputType: "date" })).toBe(false);
  expect(isToggleVisibleFor({ type: "text", textUpdateMode: "onTyping" })).toBe(false);
  expect(isToggleVisibleFor({ type: "boolean", renderAs: "myRenderer" })).toBe(false);
});

test("showKeyboardHints follows the setting, not the rendering or the survey state", () => {
  const survey = new SurveyModel({
    autoAdvanceEnabled: false,
    elements: [{ type: "rating", name: "q" }]
  });
  const q = survey.getQuestionByName("q") as any;
  q.renderAs = "dropdown";
  expect(q.displayMode).toBe("auto");
  expect(isToggleVisible(q)).toBe(true);
  q.displayMode = "dropdown";
  expect(isToggleVisible(q)).toBe(false);
  q.displayMode = "buttons";
  expect(isToggleVisible(q)).toBe(true);
});

test("showKeyboardHints is hidden on matrix columns: cells never show the row", () => {
  const survey = new SurveyModel({
    elements: [{
      type: "matrixdropdown",
      name: "q",
      columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "dropdown", choices: [1] }],
      rows: ["r"]
    }]
  });
  const matrix = survey.getQuestionByName("q") as QuestionMatrixDropdownModel;
  matrix.columns.forEach(column => {
    expect(Serializer.findProperty(column.cellType, "showKeyboardHints").isVisible("", column), column.name).toBe(false);
  });
});

test("showKeyboardHints is hidden on a custom question that inherits it from its content", () => {
  ComponentCollection.Instance.add({
    name: "customtext",
    inheritBaseProps: true,
    questionJSON: { type: "text" }
  });
  try {
    expect(isToggleVisibleFor({ type: "customtext" })).toBe(false);
  } finally {
    ComponentCollection.Instance.clear();
  }
});

test("showKeyboardHints set on a question type without hints still loads and serializes", () => {
  const json = { type: "matrix", name: "q", showKeyboardHints: true, columns: ["a"], rows: ["b"] };
  const survey = new SurveyModel({ elements: [json] });
  const q = survey.getQuestionByName("q") as Question;
  expect(q.showKeyboardHints).toBe(true);
  expect(q.toJSON().showKeyboardHints).toBe(true);
});

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
  expect(q.getKeyboardHintModel().items.length).toBe(1);
  expect(q.toJSON().showKeyboardHints).toBe(true);
  q.showKeyboardHints = false;
  survey.showKeyboardHints = true;
  expect(q.getKeyboardHintModel().hasItems()).toBe(false);
  expect(q.toJSON().showKeyboardHints).toBe(false);
  q.showKeyboardHints = undefined;
  expect(q.showKeyboardHints).toBeUndefined();
  expect(q.toJSON().showKeyboardHints).toBeUndefined();
  expect(q.getKeyboardHintModel().items.length).toBe(1);
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

test("radio enter hint stays visible while auto-advance is on", () => {
  expect(hints({ type: "radiogroup", choices: ["a", "b"] })).toEqual([
    row("to select", [arrows])
  ]);
  const withEnter = [
    row("to select", [arrows]),
    row("to submit", [enter])
  ];
  expect(hints({ type: "radiogroup", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual(withEnter);
  expect(hints({ type: "radiogroup", choices: ["a", "b"], defaultValue: "a" }, { autoAdvanceEnabled: true })).toEqual(withEnter);
  expect(hints({
    type: "radiogroup",
    defaultValue: "a",
    choices: [{ value: "a", showCommentArea: true }, "b"]
  }, { autoAdvanceEnabled: true })).toEqual(withEnter);
});

test("single image picker uses arrow and enter hints", () => {
  const choices = [{ value: "a", imageLink: "#a" }, { value: "b", imageLink: "#b" }];
  expect(hints({ type: "imagepicker", choices: choices, defaultValue: "a" })).toEqual([
    row("to select", [arrows])
  ]);
  expect(hints({ type: "imagepicker", choices: choices }, { autoAdvanceEnabled: true })).toEqual([
    row("to select", [arrows]),
    row("to submit", [enter])
  ]);
  expect(hints({ type: "imagepicker", choices: choices, defaultValue: "a" }, { autoAdvanceEnabled: true })[1].text).toBe("to submit");
});

test("the hint row is suppressed by the shared gate", () => {
  const survey = new SurveyModel({
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const q = survey.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(q.getKeyboardHintModel().hasItems()).toBe(false);
  survey.showKeyboardHints = true;
  expect(q.getKeyboardHintModel().items.length).toBe(1);
  survey.setDesignMode(true);
  expect(q.getKeyboardHintModel().hasItems()).toBe(false);
  survey.setDesignMode(false);
  q.readOnly = true;
  expect(q.getKeyboardHintModel().hasItems()).toBe(false);
  q.readOnly = false;
  survey.mode = "display";
  expect(q.getKeyboardHintModel().hasItems()).toBe(false);
  const bare = new QuestionRadiogroupModel("alone");
  bare.choices = ["a", "b"] as any;
  expect(bare.getKeyboardHintModel().hasItems()).toBe(false);
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
  expect((survey.getQuestionByName("inPanel") as Question).getKeyboardHintModel().items.length).toBe(1);
  const dynamic = survey.getQuestionByName("pd") as any;
  expect(dynamic.panels[0].getQuestionByName("inDynamic").getKeyboardHintModel().items.length).toBe(1);
  const matrix = survey.getQuestionByName("m") as any;
  const cell = matrix.visibleRows[0].cells[0].question as Question;
  expect(cell.inMatrixMode).toBe(true);
  expect(cell.getKeyboardHintModel().hasItems()).toBe(false);
});

test("keyboard hints and letter badges stay independent", () => {
  const hintsOnly = new SurveyModel({
    showKeyboardHints: true,
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const hinted = hintsOnly.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(hinted.getChoiceKeyBadge(hinted.visibleChoices[0])).toBeFalsy();
  expect(hinted.getKeyboardHintModel().items.length).toBe(1);
  const badgesOnly = new SurveyModel({
    choiceShortcutsEnabled: true,
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }]
  });
  const badged = badgesOnly.getQuestionByName("q") as QuestionRadiogroupModel;
  expect(badged.getChoiceKeyBadge(badged.visibleChoices[0])).toBe("A");
  expect(badged.getKeyboardHintModel().hasItems()).toBe(false);
  expect(badged.getItemAriaKeyShortcuts(badged.visibleChoices[0])).toBe("A");
  hintsOnly.choiceShortcutsEnabled = true;
  expect(hinted.getKeyboardHintModel().items.length).toBe(1);
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
    row("to submit", [enter])
  ]);
  expect(hints({ type: "checkbox", choices: ["a", "b"], defaultValue: ["a"] }, { autoAdvanceEnabled: true })[2].text).toBe("to submit");
});

test("multi-select image picker uses the checkbox hint row", () => {
  const choices = [{ value: "a", imageLink: "#a" }, { value: "b", imageLink: "#b" }];
  expect(hints({ type: "imagepicker", multiSelect: true, choices: choices })).toEqual([
    row("to next option", [tab]),
    row("to toggle", [space])
  ]);
  expect(hints({
    type: "imagepicker", multiSelect: true, choices: choices, defaultValue: ["a"]
  }, { autoAdvanceEnabled: true })[2].text).toBe("to submit");
  expect(hints({
    type: "imagepicker", choices: choices, defaultValue: "a"
  }, { autoAdvanceEnabled: true })[0].keys).toEqual([arrows]);
});

test("boolean radio shows all arrows: the native radio group moves on every arrow key", () => {
  expect(hints({ type: "boolean", displayMode: "radio" })).toEqual([row("to select", [arrows])]);
});

test("boolean segmented shows the horizontal arrows at both widths", () => {
  expect(hints({ type: "boolean", displayMode: "segmented" })).toEqual([row("to select", [horizontalArrows])]);
  const survey = new SurveyModel({ showKeyboardHints: true, elements: [{ type: "boolean", name: "q" }] });
  const q = survey.getQuestionByName("q") as QuestionBooleanModel;
  q.renderAs = "radio";
  expect(q.displayMode).toBe("segmented");
  expect(shown(q)).toEqual([row("to select", [horizontalArrows])]);
});

test("boolean segmented: Left and Right set the value, Up and Down leave it", () => {
  const survey = new SurveyModel({ elements: [{ type: "boolean", name: "q", defaultValue: true }] });
  const q = survey.getQuestionByName("q") as QuestionBooleanModel;
  const press = (key: string): void => {
    q.onKeyDownCore({ key: key, stopPropagation: () => {} });
  };
  press("ArrowUp");
  expect(q.value).toBe(true);
  press("ArrowDown");
  expect(q.value).toBe(true);
  press("ArrowLeft");
  expect(q.value).toBe(false);
  press("ArrowUp");
  expect(q.value).toBe(false);
  press("ArrowRight");
  expect(q.value).toBe(true);
});

test("boolean switch shows Space only: arrows do nothing there and Enter toggles too", () => {
  expect(hints({ type: "boolean", displayMode: "switch" })).toEqual([row("to toggle", [space])]);
  expect(hints({ type: "boolean", displayMode: "switch", defaultValue: true }, { autoAdvanceEnabled: true })).toEqual([
    row("to toggle", [space])
  ]);
});

test("boolean with a custom renderer shows no hints", () => {
  expect(hints({ type: "boolean", renderAs: "myRenderer" })).toEqual([]);
});

test("boolean checkbox uses space and enter", () => {
  expect(hints({ type: "boolean", displayMode: "checkbox" })).toEqual([
    row("to toggle", [space])
  ]);
  expect(hints({ type: "boolean", displayMode: "checkbox" }, { autoAdvanceEnabled: true })).toEqual([
    row("to toggle", [space]),
    row("to submit", [enter])
  ]);
  expect(hints({
    type: "boolean", displayMode: "checkbox", defaultValue: false
  }, { autoAdvanceEnabled: true })[1].text).toBe("to submit");
});

const down = "↓"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const upDown = "↑↓"; // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
const esc = "Esc";
const dropdownSet = [
  row("to open", [down]),
  row("to navigate", [upDown]),
  row("to close", [esc])
];

test("dropdown shows enter only while the popup is open, because a closed dropdown does not advance", () => {
  expect(hints({ type: "dropdown", choices: ["a", "b"] })).toEqual(dropdownSet);
  expect(hints({ type: "dropdown", choices: ["a", "b"] }, { autoAdvanceEnabled: true })).toEqual(dropdownSet);
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [
      { type: "dropdown", name: "q", choices: ["a", "b"] },
      { type: "text", name: "next" }
    ]
  });
  const q = survey.getQuestionByName("q") as any;
  const closed = dropdownSet;
  const open = dropdownSet.concat([row("to select", [enter])]);
  const popupChanges: boolean[] = [];
  q.addOnPropertyValueChangedCallback((_sender: Question, options: { name: string, newValue: boolean }) => {
    if (options.name === "isPopupVisible") popupChanges.push(options.newValue);
  });
  expect(shown(q)).toEqual(closed);
  q.value = "a";
  expect(shown(q)).toEqual(closed);
  q.dropdownListModel.onFocus(null);
  q.dropdownListModel.popupModel.show();
  expect(shown(q)).toEqual(open);
  q.clearValue();
  expect(shown(q)).toEqual(open);
  q.dropdownListModel.popupModel.hide();
  expect(shown(q)).toEqual(closed);
  expect(popupChanges).toEqual([true, false]);
  expect(q.toJSON().isPopupVisible).toBeUndefined();
  expect(JSON.stringify(q.getKeyboardHintModel())).not.toContain("Backspace");
  const last = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"] }]
  }).getQuestionByName("q") as Question;
  expect(shown(last).map(row => row.text)).toEqual(["to open", "to navigate", "to close"]);
});

test("tagbox swaps enter to continue with space or enter to select", () => {
  const choices = ["a", "b"];
  expect(hints({ type: "tagbox", choices: choices }).map(row => row.text)).toEqual([
    "to open", "to navigate", "to close"
  ]);
  expect(hints({ type: "tagbox", choices: choices }, { autoAdvanceEnabled: true }).map(row => row.text)).toEqual([
    "to open", "to navigate", "to close", "to submit"
  ]);
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ type: "tagbox", name: "q", choices: choices, searchEnabled: false }] },
      { elements: [{ type: "text", name: "next" }] }
    ]
  });
  const q = survey.getQuestionByName("q") as any;
  expect(shown(q).map(row => row.text)).toEqual(["to open", "to navigate", "to close", "to continue"]);
  q.value = ["a"];
  expect(shown(q).map(row => row.text)).toEqual(["to open", "to navigate", "to close", "to continue"]);
  q.dropdownListModel.popupModel.show();
  expect(shown(q).map(row => row.text)).toEqual(["to open", "to navigate", "to close", "to select"]);
  const select = q.getKeyboardHintModel().items[4];
  expect(rowOf(select)).toEqual(row("to select", [space, enter]));
  expect(select.parts.map(part => part.text)).toEqual([space, "or", enter, "to select"]);
  expect(select.parts.map(part => part.className)).toEqual(["sd-item__shortcut-key", "sd-question__keyboard-hint-or", "sd-item__shortcut-key", "sd-question__keyboard-hint-text"]);
  q.clearValue();
  q.dropdownListModel.popupModel.hide();
  expect(shown(q)[3].text).toBe("to continue");
  survey.showKeyboardHints = false;
  q.dropdownListModel.popupModel.show();
  survey.showKeyboardHints = true;
  expect(shown(q)[3].text).toBe("to select");
});

test("closed dropdown and tagbox without auto-advance keep the enter slot hidden", () => {
  ["dropdown", "tagbox"].forEach(type => {
    const survey = new SurveyModel({
      showKeyboardHints: true,
      elements: [{ type: type, name: "q", choices: ["a", "b"] }]
    });
    const q = survey.getQuestionByName("q") as any;
    const closed = q.getKeyboardHintModel().items;
    expect(rowOf(closed[3]).text, type).toBe("to select");
    expect(closed[3].className, type).toContain(hiddenClass);
    q.dropdownListModel.popupModel.show();
    const open = q.getKeyboardHintModel().items;
    expect(rowOf(open[3]), type).toEqual(rowOf(closed[3]));
    expect(open[3].className, type).not.toContain(hiddenClass);
    expect(open.length, type).toBe(closed.length);
  });
});

test("only a hidden keyboard hint carries the hidden class", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"] }]
  });
  const items = (survey.getQuestionByName("q") as Question).getKeyboardHintModel().items;
  expect(items.map(item => item.className)).toEqual([
    "sd-question__keyboard-hint",
    "sd-question__keyboard-hint",
    "sd-question__keyboard-hint",
    "sd-question__keyboard-hint sd-question__keyboard-hint--hidden"
  ]);
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
  const selectToRank = hints({
    type: "ranking", choices: ["a", "b", "c"], selectToRankEnabled: true
  });
  expect(selectToRank.map(row => row.text)).toEqual(["to next option", "to move", "to toggle"]);
  expect(selectToRank[2].keys).toEqual([space]);
  const emptyRank = hints({
    type: "ranking", choices: ["a", "b", "c"], selectToRankEnabled: true
  }, { autoAdvanceEnabled: true });
  expect(emptyRank.map(row => row.text)).toEqual(["to next option", "to move", "to toggle", "to submit"]);
  const filledRank = hints({
    type: "ranking", choices: ["a", "b", "c"], selectToRankEnabled: true, defaultValue: ["b", "a"]
  }, { autoAdvanceEnabled: true });
  expect(filledRank[filledRank.length - 1].text).toBe("to submit");
});

const defaultAutoAdvanceDelay = settings.autoAdvanceDelay;

afterEach(() => {
  _setIsTouch(false);
  settings.autoAdvanceDelay = defaultAutoAdvanceDelay;
});

test("enter says to continue before the last page and to submit on it", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ type: "text", name: "first", defaultValue: "a" }] },
      { elements: [{ type: "text", name: "last", defaultValue: "b" }, { type: "text", name: "hidden", visible: false }] }
    ]
  });
  expect(shown(survey.getQuestionByName("first") as Question)[0].text).toBe("to continue");
  survey.nextPage();
  expect(shown(survey.getQuestionByName("last") as Question)[0].text).toBe("to submit");
});

test("multiple text hints enter the same way as single-line text", () => {
  const items = [{ name: "a" }, { name: "b" }];
  expect(hints({ type: "multipletext", items: items })).toEqual([]);
  expect(hints({ type: "multipletext", items: items }, { autoAdvanceEnabled: true })).toEqual([
    row("to submit", [enter])
  ]);
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ type: "multipletext", name: "q", items: items }] },
      { elements: [{ type: "text", name: "next" }] }
    ]
  });
  expect(shown(survey.getQuestionByName("q") as Question)[0].text).toBe("to continue");
});

test("single-line text hints enter only when the input can auto-advance", () => {
  expect(hints({ type: "text" }, { autoAdvanceEnabled: true })).toEqual([
    row("to submit", [enter])
  ]);
  expect(hints({ type: "text", defaultValue: "a" }, { autoAdvanceEnabled: true })[0].text).toBe("to submit");
  expect(hints({ type: "text" })).toEqual([]);
  expect(hints({ type: "text", inputType: "date", defaultValue: "2020-01-01" }, { autoAdvanceEnabled: true })).toEqual([]);
  expect(hints({ type: "text", inputType: "datetime-local", defaultValue: "2020-01-01T00:00" }, { autoAdvanceEnabled: true })).toEqual([]);
  expect(hints({ type: "text", textUpdateMode: "onTyping", defaultValue: "a" }, { autoAdvanceEnabled: true })).toEqual([]);
});

test("keyboard hint classes follow question cssClasses", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [{ type: "text", name: "q", defaultValue: "a" }]
  });
  survey.onUpdateQuestionCssClasses.add((_, options) => {
    options.cssClasses.keyboardHintContainer = "hints";
    options.cssClasses.keyboardHintItem = "hint";
    options.cssClasses.keyboardHintKeyLabel = "key";
    options.cssClasses.keyboardHintSeparator = "or";
    options.cssClasses.keyboardHintText = "label";
  });
  const q = survey.getQuestionByName("q") as Question;
  q.updateElementCss();
  const model = q.getKeyboardHintModel();
  expect(model.cssClasses.keyboardHintContainer).toBe("hints");
  expect(model.cssClasses.keyboardHintItem).toBe("hint");
  expect(model.items[0].parts.map(part => part.className)).toEqual(["key", "label"]);
});

test("long text hints shift+enter and enter", () => {
  expect(hints({ type: "comment", defaultValue: "a" })).toEqual([]);
  expect(hints({ type: "comment" }, { autoAdvanceEnabled: true })).toEqual([
    row("for a new line", ["Shift+Enter"]),
    row("to submit", [enter])
  ]);
  expect(hints({ type: "comment", defaultValue: "a" }, { autoAdvanceEnabled: true })[1].text).toBe("to submit");
  expect(hints({ type: "comment", acceptCarriageReturn: false, defaultValue: "a" }, { autoAdvanceEnabled: true }).map(row => row.text)).toEqual(["to submit"]);
  _setIsTouch(true);
  expect(hints({ type: "comment", defaultValue: "a" }, { autoAdvanceEnabled: true })).toEqual([]);
  _setIsTouch(false);
});

test("a touch device has no hint row", () => {
  const autoAdvance = { autoAdvanceEnabled: true };
  const questions = [
    { type: "radiogroup", choices: ["a", "b"] },
    { type: "checkbox", choices: ["a", "b"] },
    { type: "dropdown", choices: ["a", "b"] },
    { type: "text" }
  ];
  questions.forEach(question => {
    expect(hints(question, autoAdvance).length, question.type).toBeGreaterThan(0);
  });
  _setIsTouch(true);
  questions.forEach(question => {
    expect(hints(question, autoAdvance), question.type).toEqual([]);
  });
});

test("a collapsed question has no hint row until it is expanded", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    elements: [{ type: "radiogroup", name: "q", choices: ["a", "b"], state: "collapsed" }]
  });
  const q = survey.getQuestionByName("q") as Question;
  expect(q.canShowKeyboardHints()).toBe(false);
  expect(shown(q)).toEqual([]);
  q.expand();
  expect(q.canShowKeyboardHints()).toBe(true);
  expect(shown(q).length).toBe(1);
});

test("a dropdown with hints off keeps the popup state without notifying anyone", () => {
  ["dropdown", "tagbox"].forEach(type => {
    const survey = new SurveyModel({ elements: [{ type: type, name: "q", choices: ["a", "b"] }] });
    const q = survey.getQuestionByName("q") as any;
    const popup = q.dropdownListModel.popupModel;
    // The first close resets the keyboard preview state, which has nothing to do with hints.
    popup.show();
    popup.hide();
    const changes: string[] = [];
    q.onPropertyChanged.add((_sender: Question, options: { name: string }) => changes.push(options.name));
    q.addOnPropertyValueChangedCallback((_sender: Question, options: { name: string }) => changes.push(options.name));
    expect(q.canShowKeyboardHints(), type).toBe(false);
    popup.show();
    expect(q.isPopupVisible, type + " opened").toBe(true);
    popup.hide();
    expect(q.isPopupVisible, type + " closed").toBe(false);
    expect(changes, type).toEqual([]);
  });
});

test("the popup state stays correct when the row disappears or returns around a popup change", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [
      { type: "dropdown", name: "q", choices: ["a", "b"] },
      { type: "text", name: "next" }
    ]
  });
  const q = survey.getQuestionByName("q") as any;
  q.dropdownListModel.popupModel.show();
  survey.showKeyboardHints = false;
  q.dropdownListModel.popupModel.hide();
  expect(q.isPopupVisible).toBe(false);
  survey.showKeyboardHints = true;
  q.readOnly = true;
  q.dropdownListModel.popupModel.show();
  q.readOnly = false;
  expect(shown(q)[3].text).toBe("to select");
});

test("inputPerPage multipletext leaves the row to the input on screen", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "multipletext", name: "q", items: [{ name: "a" }, { name: "b" }] },
      { type: "text", name: "next" }
    ]
  });
  const q = survey.getQuestionByName("q") as Question;
  expect(q.singleInputQuestion.name).toBe("a");
  expect(q.canShowKeyboardHints()).toBe(false);
  expect(shown(q)).toEqual([]);
  expect(q.singleInputQuestion.canShowKeyboardHints()).toBe(true);
  expect(shown(q.singleInputQuestion).length).toBe(1);
});

test("inputPerPage select question keeps its row at its own step and yields it at a nested step", () => {
  [
    { type: "radiogroup", value: "item" },
    { type: "checkbox", value: ["item"] }
  ].forEach(({ type, value }) => {
    const survey = new SurveyModel({
      showKeyboardHints: true,
      autoAdvanceEnabled: true,
      questionsOnPageMode: "inputPerPage",
      elements: [
        { type: type, name: "q", choices: [{ value: "item", elements: [{ type: "text", name: "nested" }] }] },
        { type: "text", name: "next" }
      ]
    });
    const q = survey.getQuestionByName("q") as Question;
    q.value = value;
    expect(q.singleInputQuestion, type).toBeUndefined();
    expect(q.canShowKeyboardHints(), type + " own step").toBe(true);
    expect(shown(q).length, type + " own step").toBeGreaterThan(0);
    survey.performNext();
    expect(q.singleInputQuestion.name, type).toBe("nested");
    expect(q.canShowKeyboardHints(), type + " nested step").toBe(false);
    expect(shown(q), type + " nested step").toEqual([]);
    expect(q.singleInputQuestion.canShowKeyboardHints(), type + " nested input").toBe(true);
  });
});

function enterChip(question: Question): string | undefined {
  return shown(question).filter(hint => hint.keys.indexOf(enter) > -1)[0]?.text;
}

test("every question on a page gets the same enter label", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }] },
      { elements: [{ type: "text", name: "c" }, { type: "text", name: "d" }] }
    ]
  });
  const label = (name: string) => enterChip(survey.getQuestionByName(name) as Question);
  expect(label("a")).toBe("to continue");
  expect(label("b")).toBe("to continue");
  survey.nextPage();
  expect(label("c")).toBe("to submit");
  expect(label("d")).toBe("to submit");
});

test("questionPerPage: the enter label follows the question on screen", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    questionsOnPageMode: "questionPerPage",
    elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }]
  });
  expect(enterChip(survey.getQuestionByName("a") as Question)).toBe("to continue");
  survey.performNext();
  expect(enterChip(survey.getQuestionByName("b") as Question)).toBe("to submit");
});

test("inputPerPage: the enter label follows the input on screen and the last input submits", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "text", name: "first" },
      { type: "multipletext", name: "q", items: [{ name: "a" }, { name: "b" }] }
    ]
  });
  const q = survey.getQuestionByName("q") as Question;
  expect(enterChip(survey.getQuestionByName("first") as Question)).toBe("to continue");
  survey.performNext();
  expect(q.singleInputQuestion.name).toBe("a");
  expect(enterChip(q.singleInputQuestion)).toBe("to continue");
  survey.performNext();
  expect(q.singleInputQuestion.name).toBe("b");
  expect(enterChip(q.singleInputQuestion)).toBe("to submit");
});

test("a question in a dynamic panel has no enter chip and keeps its other chips", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [{
      type: "paneldynamic", name: "pd", panelCount: 1,
      templateElements: [
        { type: "radiogroup", name: "radio", choices: ["a", "b"] },
        { type: "checkbox", name: "check", choices: ["a", "b"] },
        { type: "dropdown", name: "drop", choices: ["a", "b"] },
        { type: "comment", name: "comment" }
      ]
    }]
  });
  const panel = (survey.getQuestionByName("pd") as any).panels[0];
  expect(shown(panel.getQuestionByName("radio"))).toEqual([row("to select", [arrows])]);
  expect(shown(panel.getQuestionByName("check")).map(row => row.text)).toEqual(["to next option", "to toggle"]);
  expect(shown(panel.getQuestionByName("drop"))).toEqual(dropdownSet);
  // Enter in a nested long text stays a line break, so Shift+Enter would mean nothing.
  expect(shown(panel.getQuestionByName("comment"))).toEqual([]);
});

test("a question on the start page has no enter chip", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    firstPageIsStartPage: true,
    pages: [
      { elements: [{ type: "text", name: "start" }] },
      { elements: [{ type: "text", name: "a" }] }
    ]
  });
  expect(enterChip(survey.getQuestionByName("start") as Question)).toBeUndefined();
  survey.start();
  expect(enterChip(survey.getQuestionByName("a") as Question)).toBe("to submit");
});

test("autoAdvanceAllowComplete false removes the enter chip on the last page only", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    autoAdvanceAllowComplete: false,
    pages: [
      { elements: [{ type: "text", name: "a" }] },
      { elements: [{ type: "text", name: "b" }] }
    ]
  });
  expect(enterChip(survey.getQuestionByName("a") as Question)).toBe("to continue");
  survey.nextPage();
  expect(enterChip(survey.getQuestionByName("b") as Question)).toBeUndefined();
});

test("showPreviewBeforeComplete says to continue on the last page", () => {
  expect(hints({ type: "text" }, { autoAdvanceEnabled: true, showPreviewBeforeComplete: true })).toEqual([
    row("to continue", [enter])
  ]);
});

test("rating has an enter chip unless it renders as a dropdown", () => {
  const rateValues = [1, 2, 3];
  expect(hints({ type: "rating", rateValues: rateValues }, { autoAdvanceEnabled: true })).toEqual([
    row("to submit", [enter])
  ]);
  expect(hints({ type: "rating", rateValues: rateValues, displayMode: "dropdown" }, { autoAdvanceEnabled: true })).toEqual([]);
});

const keyDown = { keyCode: 40, preventDefault: () => { }, stopPropagation: () => { } };
function enterKey(target: any = {}): any {
  return { key: "Enter", keyCode: 13, which: 13, target: target, preventDefault: () => { }, stopPropagation: () => { } };
}

test("an open dropdown hides the enter chip while enter would clear the value", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"], defaultValue: "a" }]
  });
  const q = survey.getQuestionByName("q") as any;
  const model = q.dropdownListModel;
  model.onFocus(null);
  model.keyHandler(keyDown);
  expect(enterChip(q)).toBe("to select");
  const changes: string[] = [];
  q.onPropertyChanged.add((_sender: Question, options: { name: string }) => changes.push(options.name));
  model.inputStringRendered = "";
  expect(changes).toContain("inputHasValue");
  expect(enterChip(q)).toBeUndefined();
  expect(q.getKeyboardHintModel().items.length).toBe(4);
  model.keyHandler(enterKey());
  expect(q.value).toBeUndefined();
});

test("an open dropdown keeps the enter chip while a typed text or the selected item is in the input", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"], defaultValue: "a" }]
  });
  const q = survey.getQuestionByName("q") as any;
  const model = q.dropdownListModel;
  model.onFocus(null);
  model.keyHandler(keyDown);
  model.inputStringRendered = "b";
  expect(enterChip(q)).toBe("to select");
});

test("an open dropdown with search off keeps the enter chip, and enter keeps the value", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    elements: [{ type: "dropdown", name: "q", choices: ["a", "b"], defaultValue: "a", searchEnabled: false }]
  });
  const q = survey.getQuestionByName("q") as any;
  const model = q.dropdownListModel;
  model.popupModel.show();
  expect(enterChip(q)).toBe("to select");
  model.keyHandler(enterKey());
  expect(q.value).toBe("a");
});

test("tagbox offers space only when the input does not take it", () => {
  const selectKeys = (question: any) => {
    const survey = new SurveyModel({
      showKeyboardHints: true,
      elements: [Object.assign({ type: "tagbox", name: "q", choices: ["a", "b"] }, question)]
    });
    const q = survey.getQuestionByName("q") as any;
    const beforeModel = q.getKeyboardHintModel().items.slice(-1)[0];
    expect(q.dropdownListModelValue).toBeUndefined();
    q.dropdownListModel.popupModel.show();
    expect(rowOf(q.getKeyboardHintModel().items.slice(-1)[0]).keys).toEqual(rowOf(beforeModel).keys);
    return rowOf(beforeModel).keys;
  };
  expect(selectKeys({})).toEqual([enter]);
  expect(selectKeys({ searchEnabled: false })).toEqual([space, enter]);
  expect(selectKeys({ searchEnabled: false, allowCustomChoices: true })).toEqual([enter]);
});

test("a tagbox keeps both enter slots, so opening it does not resize the row", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ type: "tagbox", name: "q", choices: ["a", "b"] }] },
      { elements: [{ type: "text", name: "next" }] }
    ]
  });
  const q = survey.getQuestionByName("q") as any;
  const slots = () => q.getKeyboardHintModel().items.slice(3).map(item => ({
    text: rowOf(item).text, hidden: item.className.includes(hiddenClass)
  }));
  expect(slots()).toEqual([{ text: "to continue", hidden: false }, { text: "to select", hidden: true }]);
  q.dropdownListModel.popupModel.show();
  expect(slots()).toEqual([{ text: "to continue", hidden: true }, { text: "to select", hidden: false }]);
});

test("building hints does not walk the survey", () => {
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    elements: [
      { type: "text", name: "text" },
      { type: "comment", name: "comment" },
      { type: "radiogroup", name: "radio", choices: ["a", "b"] },
      { type: "checkbox", name: "check", choices: ["a", "b"] },
      { type: "dropdown", name: "drop", choices: ["a", "b"] },
      { type: "tagbox", name: "tag", choices: ["a", "b"] },
      { type: "rating", name: "rate" },
      { type: "ranking", name: "rank", choices: ["a", "b"] },
      { type: "boolean", name: "bool", displayMode: "checkbox" },
      { type: "multipletext", name: "multi", items: [{ name: "a" }] }
    ]
  });
  const questions = survey.getAllQuestions();
  const walk = vi.spyOn(survey, "getAllQuestions");
  questions.forEach(question => question.getKeyboardHintModel());
  expect(walk).not.toHaveBeenCalled();
});

// Each page is filled, so nothing holds Enter back: the chip has to match what the handler does.
test("the enter chip says what the real key handler does", () => {
  settings.autoAdvanceDelay = 0;
  const onPages = (element: any, extra: any = {}, pagesAfter = 1) => {
    const pages: any[] = [{ elements: [Object.assign({ name: "q" }, element)] }];
    if (pagesAfter > 0) pages.push({ elements: [{ type: "text", name: "next" }] });
    const survey = new SurveyModel(Object.assign({ showKeyboardHints: true, autoAdvanceEnabled: true, pages: pages }, extra));
    return { survey: survey, q: survey.getQuestionByName("q") as any };
  };
  const pressText = (q: any) => q.onKeyUp(enterKey({ value: "typed" }));
  const pressRadio = (q: any) => q.onKeyDown(enterKey());
  const pressList = (q: any) => q.dropdownListModel.keyHandler(enterKey());
  const cases: Array<{ name: string, element: any, value?: any, press: (q: any) => void }> = [
    { name: "text", element: { type: "text" }, press: pressText },
    { name: "radiogroup", element: { type: "radiogroup", choices: ["a", "b"] }, value: "a", press: pressRadio },
    { name: "tagbox", element: { type: "tagbox", choices: ["a", "b"] }, value: ["a"], press: pressList }
  ];
  cases.forEach(({ name, element, value, press }) => {
    const before = onPages(element);
    before.q.value = value;
    expect(enterChip(before.q), name).toBe("to continue");
    press(before.q);
    expect(before.survey.currentPageNo, name).toBe(1);

    const last = onPages(element, {}, 0);
    last.q.value = value;
    expect(enterChip(last.q), name).toBe("to submit");
    press(last.q);
    expect(last.survey.state, name).toBe("completed");

    const noComplete = onPages(element, { autoAdvanceAllowComplete: false }, 0);
    noComplete.q.value = value;
    expect(enterChip(noComplete.q), name).toBeUndefined();
    press(noComplete.q);
    expect(noComplete.survey.state, name).toBe("running");

    const preview = onPages(element, { showPreviewBeforeComplete: true }, 0);
    preview.q.value = value;
    expect(enterChip(preview.q), name).toBe("to continue");
    press(preview.q);
    expect(preview.survey.state, name).toBe("preview");
  });

  const closed = onPages({ type: "dropdown", choices: ["a", "b"], defaultValue: "a" });
  expect(enterChip(closed.q)).toBeUndefined();
  pressList(closed.q);
  expect(closed.survey.currentPageNo).toBe(0);

  const open = onPages({ type: "dropdown", choices: ["a", "b"] });
  open.q.dropdownListModel.onFocus(null);
  open.q.dropdownListModel.keyHandler(keyDown);
  expect(enterChip(open.q)).toBe("to select");
  pressList(open.q);
  expect(open.q.value).toBe("a");

  const nested = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "radiogroup", name: "q", choices: ["a", "b"] }] }] },
      { elements: [{ type: "text", name: "next" }] }
    ]
  });
  const inner = (nested.getQuestionByName("pd") as any).panels[0].getQuestionByName("q");
  inner.value = "a";
  expect(enterChip(inner)).toBeUndefined();
  pressRadio(inner);
  expect(nested.currentPageNo).toBe(0);
});

// Multiple text holds Enter back until all its items are filled, so the items start filled.
test("inputPerPage: enter on a filled multiple text input does what its chip says", () => {
  settings.autoAdvanceDelay = 0;
  const multipleText = { type: "multipletext", name: "q", items: [{ name: "a" }, { name: "b" }], defaultValue: { a: "1", b: "2" } };
  const survey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    questionsOnPageMode: "inputPerPage",
    elements: [multipleText, { type: "text", name: "next" }]
  });
  const q = survey.getQuestionByName("q") as any;
  const press = (question: any, value: string) => question.singleInputQuestion.onKeyUp(enterKey({ value: value }));
  expect(enterChip(q.singleInputQuestion)).toBe("to continue");
  press(q, "3");
  expect(q.singleInputQuestion.name).toBe("b");
  expect(enterChip(q.singleInputQuestion)).toBe("to continue");
  press(q, "4");
  expect(survey.currentSingleQuestion.name).toBe("next");

  const lastSurvey = new SurveyModel({
    showKeyboardHints: true,
    autoAdvanceEnabled: true,
    questionsOnPageMode: "inputPerPage",
    elements: [multipleText]
  });
  const last = lastSurvey.getQuestionByName("q") as any;
  lastSurvey.performNext();
  expect(enterChip(last.singleInputQuestion)).toBe("to submit");
  press(last, "4");
  expect(lastSurvey.state).toBe("completed");
});
