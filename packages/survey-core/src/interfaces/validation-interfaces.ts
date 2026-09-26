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

// The kind of a finding SurveyModel.setData() reports. The first three are also the vocabulary of
// the value checks: IValueChecks names the same three checks and IncorrectValueError.check names one
// of them. expressionResultMismatch is not a value check: it is the diagnostic that compares the
// response with survey.data after loading.
export type DataIssueType = "unknownProperty" | "invalidValueType" | "invalidChoiceValue" | "expressionResultMismatch";
// The value checks that run on a question value. Every member is optional: isValueCorrect() and the
// walk behind setData() run all three unless a member is set to false, and clearIncorrectValues()
// removes what they report, keeping an unknown choice when keepIncorrectValues asks for it. validate()
// runs none of them: it is the respondent-facing validation and its behavior does not depend on these.
// setData() takes IDataVerificationOptions and maps its report* members onto these.
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
// The options of SurveyModel.setData(). A separate vocabulary from IValueChecks: setData() maps its
// three report* value checks onto IValueChecks. They are on unless a member is set to false; the
// mismatch diagnostic is off unless it is set to true.
export interface IDataVerificationOptions {
  reportUnknownProperties?: boolean;
  reportInvalidValueTypes?: boolean;
  reportInvalidChoiceValues?: boolean;
  // Reports every place where survey.data after loading differs from the response. Despite the
  // name, the mismatch is not limited to expressions: it is anything the model added, changed or
  // dropped, a defaultValue, a normalization, a value set by a trigger or cleared by a condition.
  // A diagnostic about what the model did to the input, not a verdict on it. Off by default: a
  // valid partial response receives defaults, so the report would never be empty for legitimate input.
  reportExpressionResultMismatches?: boolean;
}
// One finding of SurveyModel.setData(). It carries no text: the consumer is a developer, and type,
// path, value, expressionResult and question identify the issue. A consumer that shows issues to
// end users builds the text from type and path.
export interface IDataIssue {
  type: DataIssueType;
  // The location of the value from the survey root, rendered for reading: "panel1[2].q1",
  // "matrix.row1.col1". A key is written as is, so the path is ambiguous for a key that contains
  // "." or "[": it is for reading and not meant to be parsed.
  path: string;
  // The offending value as it is in the checked data.
  value: any;
  // expressionResultMismatch only: the value the model holds instead. undefined when the model
  // dropped the value.
  expressionResult?: any;
  // The question that owns the location. For a value check: the instance that holds the value, the
  // cell question or the panel item question for a nested one. For an expressionResultMismatch: the
  // question that owns the ROOT key of the location, whatever the depth, because the comparison does
  // not walk instances. Undefined for an unknown root property and for a mismatch whose root key
  // no question owns (a calculated value, a stray key).
  question?: Question;
}
