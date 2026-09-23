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

// The kind of a finding verifyData() reports. It is also the vocabulary of the value checks:
// IValueChecks names the same three checks and IncorrectValueError.check reports the failed one.
export type DataIssueType = "unknownProperty" | "invalidValueType" | "invalidChoiceValue" | "changedValue";
// What a failed value check reports: Question.getIncorrectValueInfo() builds it from the issues of
// verifyOwnValue(), and the IncorrectValueError built from it carries it to the caller.
export interface IIncorrectValueInfo {
  // Never "changedValue": that finding exists on the survey level only and never becomes an error.
  check: DataIssueType;
  // The unknown properties, for the unknownProperty check only, rendered relative to the question:
  // "[0].zzz" for an item of a dynamic panel or a dynamic matrix, "r1.c" for a named row, "zz" for
  // a key of the question value itself.
  keys?: Array<string>;
}
// The value checks that run on a question value. Every member is optional: verifyData() runs all
// three unless a member is set to false, validate() runs the fixed set (Question.getValidateChecks()).
export interface IValueChecks {
  // A key of the data that no question, valueName, comment / totals suffix or calculated value
  // with includeIntoResult owns. Root keys and keys inside a container value alike.
  unknownProperties?: boolean;
  // The value has the JSON shape the question stores: a numeric input does not hold "abc",
  // a dynamic matrix does not hold a scalar row.
  valueTypes?: boolean;
  // The value refers to an existing choice, matrix column, row or rate value.
  choiceValues?: boolean;
}
// The options of PanelModelBase.verifyData() and Question.verifyData(). A separate name from
// IValueChecks so that the options can grow without touching the check vocabulary.
export interface IVerifyDataOptions extends IValueChecks {
}
export interface ISurveyVerifyDataOptions extends IVerifyDataOptions {
  // The response to check, JSON-compatible (plain objects, arrays, strings, numbers, booleans,
  // null). When passed, verifyData() loads a deep copy of it into the survey first, then runs the
  // value checks on what the model holds. The caller's object is never modified.
  // The copy is a JSON round trip, so a Date becomes its ISO string and a class instance loses its
  // prototype: the Date / class instance behavior of the value checks does not apply to this route.
  data?: any;
  // Off by default. With `data`, reports every place where the model's data differs from the
  // response after loading: a default or calculated value the model added, a value it normalized,
  // a value it dropped. A diagnostic about what the model did to the input, not a verdict on it.
  changedValues?: boolean;
}
// One finding of verifyData().
export interface IDataIssue {
  type: DataIssueType;
  // The location of the value from the survey root, on every level, as segments: a string is an
  // object key, a number is an array index. Unambiguous: a key that contains "." or "[" is one segment.
  segments: Array<string | number>;
  // The same location rendered for reading: "panel1[2].q1", "matrix.row1.col1". Derived from
  // segments; not meant to be parsed.
  path: string;
  // The offending value as it is in the checked data.
  value: any;
  // changedValue only: the value the model holds instead. undefined when the model dropped the value.
  newValue?: any;
  // The question that owns the location. For a value check: the instance that holds the value, the
  // cell question or the panel item question for a nested one. For a changedValue: the question
  // that owns the ROOT key of the location, whatever the depth, because the comparison does not
  // walk instances. Undefined for an unknown root property and for a changedValue whose root key
  // no question owns (a calculated value, a stray key).
  question?: Question;
}
