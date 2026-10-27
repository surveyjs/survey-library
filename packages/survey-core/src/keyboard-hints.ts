import { Question } from "./question";
import { SurveyModel } from "./survey";

export interface IKeyboardHint {
  keys: string[];
  text: string;
  visible: boolean;
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

export type KeyboardHintFace = keyof typeof keyboardHintLabels;

// A hidden hint keeps its place in the row, so the row does not shift when the hint appears.
export function keyboardHint(owner: { getLocalizationString(name: string): string }, textKey: string, faces: KeyboardHintFace[], visible: boolean = true): IKeyboardHint {
  return { text: owner.getLocalizationString(textKey), keys: faces.map(face => keyboardHintLabels[face]), visible: visible };
}

export function keyboardHintAdvanceText(question: Question): string {
  const survey = question.survey as SurveyModel;
  if (!survey) return "keyboardHintSubmitText";
  const questions = survey.getAllQuestions(true);
  const index = questions.indexOf(question);
  if (index >= 0 && index < questions.length - 1) return "keyboardHintContinueText";
  return "keyboardHintSubmitText";
}

export function singleChoiceKeyboardHints(question: Question, submitVisible: boolean): IKeyboardHint[] {
  const survey = question.survey as SurveyModel;
  const rows = [keyboardHint(question, "keyboardHintSelectText", ["arrowsAll"])];
  if (survey.autoAdvanceEnabled === true) {
    rows.push(keyboardHint(question, keyboardHintAdvanceText(question), ["enter"], submitVisible));
  }
  return rows;
}

export function multiChoiceKeyboardHints(question: Question, submitVisible: boolean): IKeyboardHint[] {
  const survey = question.survey as SurveyModel;
  const rows = [
    keyboardHint(question, "keyboardHintNextItemText", ["tab"]),
    keyboardHint(question, "keyboardHintToggleText", ["space"])
  ];
  if (survey.autoAdvanceEnabled === true) {
    rows.push(keyboardHint(question, keyboardHintAdvanceText(question), ["enter"], submitVisible));
  }
  return rows;
}
