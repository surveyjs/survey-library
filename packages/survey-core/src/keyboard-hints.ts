import { Question } from "./question";
import { SurveyModel } from "./survey";
import { toCssClasses } from "./utils/cssClassBuilder";

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
  keyboardHintItemHidden: string;
  keyboardHintKeyLabel: string;
  keyboardHintSeparator: string;
  keyboardHintText: string;
}

export class KeyboardHintItem {
  readonly parts: IKeyboardHintPart[];
  readonly className: string;
  constructor(hint: IKeyboardHintData, orText: string, cssClasses: IKeyboardHintCss) {
    const parts: IKeyboardHintPart[] = [];
    hint.keyLabels.forEach((keyLabel, index) => {
      if (index > 0) parts.push({ text: orText, className: cssClasses.keyboardHintSeparator });
      parts.push({ text: keyLabel, className: cssClasses.keyboardHintKeyLabel });
    });
    parts.push({ text: hint.text, className: cssClasses.keyboardHintText });
    this.parts = parts;
    this.className = toCssClasses(cssClasses.keyboardHintItem, !hint.visible && cssClasses.keyboardHintItemHidden);
  }
}

export class KeyboardHintModel {
  readonly cssClasses: IKeyboardHintCss;
  readonly items: KeyboardHintItem[];
  constructor(owner: { getLocalizationString(name: string): string, cssClasses: IKeyboardHintCss }, hints: IKeyboardHintData[]) {
    const orText = owner.getLocalizationString("keyboardHintOrText");
    this.cssClasses = owner.cssClasses;
    this.items = hints.map(hint => new KeyboardHintItem(hint, orText, this.cssClasses));
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
  arrowsHorizontal: "←→", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  arrowsAll: "↑↓←→" // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
};

export type KeyboardHintKey = keyof typeof keyboardHintLabels;

export function keyboardHint(owner: { getLocalizationString(name: string): string }, textLocName: string, hintKeys: KeyboardHintKey[], visible: boolean = true): IKeyboardHintData {
  return { text: owner.getLocalizationString(textLocName), keyLabels: hintKeys.map(hintKey => keyboardHintLabels[hintKey]), visible: visible };
}

// Enter navigation is page-based, so the chip reads the survey's stored page state and never walks the questions.
export function advanceKeyboardHints(question: Question): IKeyboardHintData[] {
  if (!question.canAdvanceOnEnter()) return [];
  const survey = question.survey as SurveyModel;
  if (question.page !== survey.currentPage) return [];
  if (!survey.isLastPage) return [keyboardHint(question, "keyboardHintContinueText", ["enter"])];
  if (!survey.autoAdvanceAllowComplete) return [];
  const locName = survey.showPreviewBeforeComplete ? "keyboardHintContinueText" : "keyboardHintSubmitText";
  return [keyboardHint(question, locName, ["enter"])];
}

export function singleChoiceKeyboardHints(question: Question): IKeyboardHintData[] {
  return [keyboardHint(question, "keyboardHintSelectText", ["arrowsAll"]), ...advanceKeyboardHints(question)];
}

export function multiChoiceKeyboardHints(question: Question): IKeyboardHintData[] {
  return [
    keyboardHint(question, "keyboardHintNextItemText", ["tab"]),
    keyboardHint(question, "keyboardHintToggleText", ["space"]),
    ...advanceKeyboardHints(question)
  ];
}
