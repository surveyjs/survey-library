import { ISurveyTestIssue } from "./test-result";

// The only control-flow exception of the tester. The runner catches it, records the issue it carries
// and ends the current test with the status "error". Nothing else may throw across a step boundary.
// It lives in a module of its own so that the target grammar can raise it without importing the
// execution context, which is itself built on the grammar.
export class SurveyTestCaseError extends Error {
  constructor(public issue: ISurveyTestIssue) {
    super(issue.message);
    Object.setPrototypeOf(this, SurveyTestCaseError.prototype);
    this.name = "SurveyTestCaseError";
  }
}

export function createCaseError(code: string, message: string,
  props?: { target?: string, data?: any, suggestion?: string, jsonPath?: string }): SurveyTestCaseError {
  const issue: ISurveyTestIssue = { severity: "error", code: code, message: message };
  if (!!props) {
    if (props.target !== undefined) issue.target = props.target;
    if (props.data !== undefined) issue.data = props.data;
    if (props.suggestion !== undefined) issue.suggestion = props.suggestion;
    if (!!props.jsonPath) issue.jsonPath = props.jsonPath;
  }
  return new SurveyTestCaseError(issue);
}
