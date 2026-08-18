import { ISurveyTestOptions, ISurveyTestStart } from "./test-json";

// "canceled" is a control-flow outcome and nothing else: the caller stopped the run, so what carries
// it neither passed nor failed and it holds no issue of its own.
export type SurveyTestStatus = "passed" | "failed" | "error" | "skipped" | "canceled";
export type SurveyTestSeverity = "error" | "warning";

export interface ISurveyTestsResult {
  name?: string;
  // "failed" if any test failed, "error" if any test errored, "canceled" if the run was stopped.
  status: SurveyTestStatus;
  tests: Array<ISurveyTestResult>;
  summary: ISurveyTestSummary;
  // Suite-level issues: a malformed suite object, a missing survey definition.
  issues: Array<ISurveyTestIssue>;
}

// total counts the tests that produced a result. The five status counters are mutually exclusive and
// they add up to it: a test the run never reached produces no result and is counted nowhere.
export interface ISurveyTestSummary {
  total: number;
  passed: number;
  failed: number;
  errored: number;
  skipped: number;
  canceled: number;
  checks: number;
  failedChecks: number;
  warnings: number;
}

export interface ISurveyTestResult {
  name: string;
  status: SurveyTestStatus;
  // The resolved options and variables this test ran with: the suite-level values apply invisibly,
  // so a reader of a failing test body would otherwise see nothing that explains the behaviour.
  options: ISurveyTestOptions;
  variables?: { [name: string]: any };
  // The resolved start state, after cloning.
  start?: ISurveyTestStart;
  // Set when the test referenced a named start.
  startName?: string;
  steps: Array<ISurveyTestStepResult>;
  issues: Array<ISurveyTestIssue>;
}

export interface ISurveyTestStepResult {
  // 0-based index in ISurveyTest.steps.
  index: number;
  name?: string;
  // Always set: "set", "complete", "expect", ...
  command: string;
  status: SurveyTestStatus;
  // Empty unless the command produced checks.
  checks: Array<ISurveyTestCheckResult>;
  issues: Array<ISurveyTestIssue>;
}

export interface ISurveyTestCheckResult {
  // The target name as written in the case.
  target: string;
  check: string;
  expected: any;
  actual: any;
  passed: boolean;
  // One plain sentence: what was expected, what happened.
  message?: string;
  jsonPath?: string;
  details?: any;
}

export interface ISurveyTestIssue {
  severity: SurveyTestSeverity;
  // One of SurveyTestIssueCodes.
  code: string;
  message: string;
  target?: string;
  step?: number;
  // A path inside the case object, e.g. "tests[0].steps[2]".
  path?: string;
  // A path inside the survey definition.
  jsonPath?: string;
  suggestion?: string;
  data?: any;
}

// The values are public API and the Builder UI will localise on them: keep them stable. Later
// prompts extend this object, they do not rename its members.
export const SurveyTestIssueCodes = Object.freeze({
  notAnObject: "notAnObject",
  testsMissing: "testsMissing",
  testNameMissing: "testNameMissing",
  duplicateTestName: "duplicateTestName",
  stepsMissing: "stepsMissing",
  stepNotAnObject: "stepNotAnObject",
  stepEmpty: "stepEmpty",
  stepHasSeveralCommands: "stepHasSeveralCommands",
  unknownStepKey: "unknownStepKey",
  commandParamsNotAnObject: "commandParamsNotAnObject",
  expectNotAnObject: "expectNotAnObject",
  expectTargetNotAnObject: "expectTargetNotAnObject",
  expectEmpty: "expectEmpty",
  optionsNotAnObject: "optionsNotAnObject",
  variablesNotAnObject: "variablesNotAnObject",
  startsNotAnArray: "startsNotAnArray",
  startNotAnObject: "startNotAnObject",
  startNameMissing: "startNameMissing",
  duplicateStartName: "duplicateStartName",
  unknownStartReference: "unknownStartReference",
  startHasReservedKey: "startHasReservedKey",
  invalidDataMode: "invalidDataMode",
  invalidStartPage: "invalidStartPage",
  // Run-time codes: everything below is reported by the runner, not by the validator.
  surveyMissing: "surveyMissing",
  surveyJsonExpected: "surveyJsonExpected",
  surveyFactoryFailed: "surveyFactoryFailed",
  surveyFactoryInvalidResult: "surveyFactoryInvalidResult",
  reservedTargetName: "reservedTargetName",
  unknownTarget: "unknownTarget",
  ambiguousTarget: "ambiguousTarget",
  unknownCommand: "unknownCommand",
  unknownCheck: "unknownCheck",
  commandNotApplicable: "commandNotApplicable",
  checkNotApplicable: "checkNotApplicable",
  invalidCommandParams: "invalidCommandParams",
  invalidCheckPayload: "invalidCheckPayload",
  unknownStartPage: "unknownStartPage",
  startPageNotVisible: "startPageNotVisible",
  asyncOperationTimeout: "asyncOperationTimeout",
  unexpectedError: "unexpectedError",
  // Feasibility codes: a command describes an interaction no respondent could perform.
  navigationButtonNotAvailable: "navigationButtonNotAvailable",
  elementNotOnCurrentPage: "elementNotOnCurrentPage",
  elementNotVisible: "elementNotVisible",
  elementNotEditable: "elementNotEditable",
  commentNotAvailable: "commentNotAvailable",
  valueNotEnterable: "valueNotEnterable",
  invalidChoiceValue: "invalidChoiceValue",
  cannotAddRows: "cannotAddRows",
  cannotRemoveRows: "cannotRemoveRows",
  // Warnings.
  completeBlocked: "completeBlocked",
  nextPageBlocked: "nextPageBlocked",
  addBlocked: "addBlocked",
  removeBlocked: "removeBlocked",
  rowsAddedImplicitly: "rowsAddedImplicitly",
  rowsNotRemoved: "rowsNotRemoved",
  setWhileHidden: "setWhileHidden",
  commentIsOtherText: "commentIsOtherText",
  choicesNotVerifiable: "choicesNotVerifiable",
  valueClearedAsInvisible: "valueClearedAsInvisible",
});
