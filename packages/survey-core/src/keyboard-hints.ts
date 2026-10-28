import { Question } from "./question";
import { SurveyModel } from "./survey";

export interface IKeyboardHintData {
  keyLabels: string[];
  text: string;
  visible: boolean;
}

export interface IKeyboardHintPart {
  text: string;
  className: string;
}

export interface IKeyboardHintCss {
  keyboardHintContainer: string;
  keyboardHintItem: string;
  keyboardHintKeyLabel: string;
  keyboardHintSeparator: string;
  keyboardHintText: string;
}

export class KeyboardHintItem {
  readonly parts: IKeyboardHintPart[];
  constructor(hint: IKeyboardHintData, orText: string, cssClasses: IKeyboardHintCss) {
    const parts: IKeyboardHintPart[] = [];
    hint.keyLabels.forEach((keyLabel, index) => {
      if (index > 0) parts.push({ text: orText, className: cssClasses.keyboardHintSeparator });
      parts.push({ text: keyLabel, className: cssClasses.keyboardHintKeyLabel });
    });
    parts.push({ text: hint.text, className: cssClasses.keyboardHintText });
    this.parts = parts;
  }
}

export class KeyboardHintModel {
  readonly cssClasses: IKeyboardHintCss;
  readonly items: KeyboardHintItem[];
  constructor(owner: { getLocalizationString(name: string): string, cssClasses: IKeyboardHintCss }, hints: IKeyboardHintData[]) {
    const orText = owner.getLocalizationString("keyboardHintOrText");
    this.cssClasses = owner.cssClasses;
    this.items = hints.filter(hint => hint.visible).map(hint => new KeyboardHintItem(hint, orText, this.cssClasses));
  }
  public hasItems(): boolean {
    return this.items.length > 0;
  }
}

const keyboardHintLabels = {
  enter: "Enter",
  space: "Space",
  shiftEnter: "Shift+Enter",
  tab: "Tab",
  esc: "Esc",
  arrowDown: "↓", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  arrowsVertical: "↑↓", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  arrowsAll: "↑↓←→" // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
};

export type KeyboardHintKey = keyof typeof keyboardHintLabels;

export function keyboardHint(owner: { getLocalizationString(name: string): string }, textLocName: string, hintKeys: KeyboardHintKey[], visible: boolean = true): IKeyboardHintData {
  return { text: owner.getLocalizationString(textLocName), keyLabels: hintKeys.map(hintKey => keyboardHintLabels[hintKey]), visible: visible };
}

export function keyboardHintAdvanceLocName(question: Question): string {
  const survey = question.survey as SurveyModel;
  if (!survey) return "keyboardHintSubmitText";
  const questions = survey.getAllQuestions(true);
  const index = questions.indexOf(question);
  if (index >= 0 && index < questions.length - 1) return "keyboardHintContinueText";
  return "keyboardHintSubmitText";
}

export function singleChoiceKeyboardHints(question: Question): IKeyboardHintData[] {
  const survey = question.survey as SurveyModel;
  const hints = [keyboardHint(question, "keyboardHintSelectText", ["arrowsAll"])];
  if (survey.autoAdvanceEnabled === true) {
    hints.push(keyboardHint(question, keyboardHintAdvanceLocName(question), ["enter"]));
  }
  return hints;
}

export function multiChoiceKeyboardHints(question: Question): IKeyboardHintData[] {
  const survey = question.survey as SurveyModel;
  const hints = [
    keyboardHint(question, "keyboardHintNextItemText", ["tab"]),
    keyboardHint(question, "keyboardHintToggleText", ["space"])
  ];
  if (survey.autoAdvanceEnabled === true) {
    hints.push(keyboardHint(question, keyboardHintAdvanceLocName(question), ["enter"]));
  }
  return hints;
}
