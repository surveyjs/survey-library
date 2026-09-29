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
  // A forward page move is allowed with errors (checkErrorsMode "onComplete", validationAllowSwitchPages).
  canLeavePageWithErrors: boolean;
  getValidateVisitedEmptyFields(): boolean;
}

// The kind of a finding SurveyModel.setData() reports. Each one is named by a member of IDataVerificationOptions,
// and IncorrectValueError.check names one of the first three. expressionResultMismatch is not a value
// check: it is the diagnostic that compares the response with survey.data after loading.
export type DataIssueType = "unknownProperty" | "invalidValueType" | "invalidChoiceValue" | "expressionResultMismatch";
// The checks that run on a question value, and the options of SurveyModel.setData(). Every member is
// optional: isValueCorrect() and the walk behind setData() run the three value checks unless a member
// is set to false, and clearIncorrectValues() removes what they report, keeping an unknown choice when
// keepIncorrectValues asks for it. validate() runs none of them: it is the respondent-facing validation
// and its behavior does not depend on these.
export interface IDataVerificationOptions {
  // A key of the data that no question, valueName, comment / totals suffix or calculated value
  // with includeIntoResult owns. Root keys and keys inside a container value alike.
  reportUnknownProperties?: boolean;
  // The value has the JSON shape the question stores: a numeric input does not hold "abc",
  // a dynamic matrix does not hold a scalar row.
  reportInvalidValueTypes?: boolean;
  // The value refers to an existing choice, matrix column, row or rate value.
  reportInvalidChoiceValues?: boolean;
  // setData() only: a question value check ignores it. Unlike the members above it is off unless it
  // is set to true. Reports every place where survey.data after loading differs from the response.
  // Despite the name, the mismatch is not limited to expressions: it is anything the model added,
  // changed or dropped, a defaultValue, a normalization, a value set by a trigger or cleared by a
  // condition. A diagnostic about what the model did to the input, not a verdict on it. Off by
  // default: a valid partial response receives defaults, so the report would never be empty for
  // legitimate input.
  reportExpressionResultMismatches?: boolean;
}
/**
 * Describes an issue reported by the [`SurveyModel.setData()`](/form-library/documentation/api-reference/survey-data-model#setData) method.
 */
export interface IDataIssue {
  /**
   * Identifies the issue type.
   *
   * Possible values:
   *
   * - `"unknownProperty"`\
   * A data property does not correspond to a recognized survey result field.
   *
   * - `"invalidValueType"`\
   * A value's type or structure does not match the question configuration.
   *
   * - `"invalidChoiceValue"`\
   * A value does not match an available choice, matrix column or row, or rating value.
   *
   * - `"expressionResultMismatch"`\
   * A value was added, changed, or removed by expressions, defaults, triggers, or other logic applied during loading.
   */
  type: DataIssueType;
  /**
   * The value's location in the survey data, such as `"panel1[2].q1"` or `"matrix.row1.col1"`.
   *
   * This path is intended for display, not parsing, because property names are not escaped.
   */
  path: string;
  /**
   * The value associated with the issue.
   *
   * For an [`"expressionResultMismatch"`](#type) issue, this is the original value from the supplied data.
   */
  value: any;
  /**
   * The value stored in the survey after loading.
   *
   * This property applies only to [`"expressionResultMismatch"`](#type) issues and is `undefined` if the value was removed.
   */
  expressionResult?: any;
  /**
   * The question associated with the issue, or `undefined` if the data property does not correspond to a question.
   *
   * For nested values, this is the cell or panel question. For an [`"expressionResultMismatch"`](#type) issue, it is the question associated with the root data property.
   */
  question?: Question;
}
