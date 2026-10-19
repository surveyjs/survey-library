import { Question } from "./question";
import { SurveyModel } from "./survey";

export interface IKeyboardHintKey {
  label: string;
  shortcut: string;
  visible: boolean;
}

export interface IKeyboardHint {
  keys: IKeyboardHintKey[];
  text: string;
}

const keyboardHintFaces = {
  enter: { label: "Enter ↵", shortcut: "Enter" }, // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  space: { label: "Space", shortcut: "Space" },
  shiftEnter: { label: "Shift+Enter", shortcut: "Shift+Enter" },
  tab: { label: "Tab", shortcut: "Tab" },
  esc: { label: "Esc", shortcut: "Escape" },
  arrowDown: { label: "↓", shortcut: "ArrowDown" }, // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  arrowsVertical: { label: "↑↓", shortcut: "ArrowUp ArrowDown" }, // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  arrowsAll: { label: "↑↓←→", shortcut: "ArrowUp ArrowDown ArrowLeft ArrowRight" } // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
};

export type KeyboardHintFace = keyof typeof keyboardHintFaces;

export function keyboardHintKey(face: KeyboardHintFace, visible: boolean): IKeyboardHintKey {
  const item = keyboardHintFaces[face];
  return { label: item.label, shortcut: item.shortcut, visible: visible };
}

export function keyboardHint(owner: { getLocalizationString(name: string): string }, textKey: string, keys: IKeyboardHintKey[]): IKeyboardHint {
  return { text: owner.getLocalizationString(textKey), keys: keys };
}

export function singleChoiceKeyboardHints(question: Question, submitVisible: boolean): IKeyboardHint[] {
  const survey = question.survey as SurveyModel;
  const rows = [keyboardHint(question, "keyboardHintSelectText", [keyboardHintKey("arrowsAll", true)])];
  if (survey.autoAdvanceEnabled === true) {
    rows.push(keyboardHint(question, "keyboardHintSubmitText", [keyboardHintKey("enter", submitVisible)]));
  }
  return rows;
}

export function multiChoiceKeyboardHints(question: Question, submitVisible: boolean): IKeyboardHint[] {
  const survey = question.survey as SurveyModel;
  const rows = [
    keyboardHint(question, "keyboardHintNextItemText", [keyboardHintKey("tab", true)]),
    keyboardHint(question, "keyboardHintSelectText", [keyboardHintKey("space", true)])
  ];
  if (survey.autoAdvanceEnabled === true) {
    rows.push(keyboardHint(question, "keyboardHintSubmitText", [keyboardHintKey("enter", submitVisible)]));
  }
  return rows;
}
