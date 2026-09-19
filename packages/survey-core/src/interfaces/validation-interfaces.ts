import type { ILocalizableOwner } from "../localizablestring";
import type { Base } from "../base";
import type { SurveyError } from "../survey-error";
import type { IPanel, IQuestion } from "../base-interfaces";
import type { Question } from "../question";

export interface ISurveyErrorOwner extends ILocalizableOwner {
  getErrorCustomText(text: string, error: SurveyError): string;
}
export interface ISurveyValidatorOwner extends ISurveyErrorOwner {
  createRegexValidator(validator: Base, pattern: string, flags: string): RegExp;
}
export interface ISurveyValidation {
  validateQuestion(question: IQuestion, errors: Array<SurveyError>, fireCallback: boolean): void;
  validatePanel(panel: IPanel, errors: Array<SurveyError>, fireCallback: boolean): void;
  createRegexValidator(question: IQuestion, validator: Base, pattern: string, flags: string): RegExp;
  isValidateOnValueChanging: boolean;
  isValidateOnValueChanged: boolean;
  getValidateVisitedEmptyFields(): boolean;
}

// Which of the value checks failed: IncorrectValueError.check reports it.
export type ValueCheckName = "valueType" | "choices" | "unknownKeys";
// What a failed value check reports: Question.isValueCorrectCore() returns it, undefined when the
// value is correct, and the IncorrectValueError built from it carries it to the caller.
export interface IIncorrectValueInfo {
  check: ValueCheckName;
  // The unknown keys, for the unknownKeys check only. A key of a nested row is reported as "<row>.<key>".
  keys?: Array<string>;
}
// The value checks validate() runs on the question value. Every member is optional: the members that
// are not set are taken from SurveyModel.validationValueChecks and then from the built-in defaults,
// { valueType: true, choices: true, unknownKeys: false }.
export interface IValueChecks {
  // The value has the JSON shape the question stores: a numeric input does not hold "abc",
  // a dynamic matrix does not hold a scalar row.
  valueType?: boolean;
  // The value refers to an existing choice, matrix column or rate value.
  // SurveyModel.keepIncorrectValues turns this check off.
  choices?: boolean;
  // An object value has no key that no question owns: a matrix row that is not in rows,
  // a key of a dynamic panel item that is not a question of the panel.
  // It is a finding about the payload, not something a respondent can fix, so it is off by default.
  // SurveyModel.keepIncorrectValues turns this check off as well.
  unknownKeys?: boolean;
}
export interface IValidateOptions {
  fireCallback?: boolean;
  focusFirstError?: boolean;
  valueChecks?: IValueChecks;
  // Called exactly once, when the whole validation, every async validator included, is completed.
  // It is not the timing of the positional callbacks, which fire on the first failure.
  // validate() itself still returns false as soon as one failure is known, even if something is pending.
  onAsyncCompleted?: (isValid: boolean, firstErrorQuestion: Question) => void;
}
export interface ISurveyValidateOptions extends IValidateOptions {
  changeCurrentPage?: boolean;
}
