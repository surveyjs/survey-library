// The JSON format of a test suite. It is public API: a visual editor for it is planned in SurveyJS
// Builder, so every construct follows one shape: <keyword> -> <target name> -> <payload>.
// The survey definition is deliberately not a part of this format - it is handed to the runner as a
// separate document.

export interface ISurveyTests {
  name?: string;
  description?: string;
  options?: ISurveyTestOptions;
  variables?: { [name: string]: any };
  starts?: Array<ISurveyTestStartDefinition>;
  tests: Array<ISurveyTest>;
}

export interface ISurveyTest {
  name: string;
  description?: string;
  // A disabled test is reported as "skipped"; it is still validated.
  disabled?: boolean;
  // Either a name from ISurveyTests.starts or an inline start state, never a name with overrides.
  start?: string | ISurveyTestStart;
  // Merged over ISurveyTests.options, shallow, one level, per key.
  options?: ISurveyTestOptions;
  // Merged over ISurveyTests.variables, per variable name.
  variables?: { [name: string]: any };
  steps: Array<ISurveyTestStep>;
}

export interface ISurveyTestStart {
  data?: { [name: string]: any };
  // A page name only. An index would let a page reorder silently redirect a test.
  startPage?: string;
  dataMode?: "input" | "restore";
}

export interface ISurveyTestStartDefinition extends ISurveyTestStart {
  name: string;
  description?: string;
}

export interface ISurveyTestStep {
  name?: string;
  description?: string;
  // "expect" is declared only to give hand-written cases the shape of the check map. It is not a
  // special case anywhere in the implementation: it is a command whose parameters are checks.
  expect?: ISurveyTestCheck;
  // "<command>": ISurveyTestCommandParams. The command name is data: the set of commands is
  // extensible through the command registry.
  [command: string]: any;
}

export interface ISurveyTestCommandParams {
  // Target name -> command parameters.
  [target: string]: any;
}

export interface ISurveyTestCheck {
  // Target name -> (check name -> expected value).
  [target: string]: { [check: string]: any };
}

// Flat by design - every member is a scalar, so the per-key merge of a test over the suite never
// raises a deep-merge question.
export interface ISurveyTestOptions {
  locale?: string;
  // An ISO string that pins "today"/"currentDate"; default "2024-01-01T00:00:00".
  now?: string;
  // Default 1.
  randomSeed?: number;
  clearInvisibleValues?: "onComplete" | "onHidden" | "onHiddenContainer" | "none";
  checkErrorsMode?: "onNextPage" | "onValueChanged" | "onComplete";
  // Per test; default false - a failed check does not end the case.
  stopOnFirstFailure?: boolean;
}

// Step keys that are metadata and never a command name.
export const STEP_METADATA_KEYS = ["name", "description"];
// The one command the format fixes the payload shape of.
export const CHECK_COMMAND_NAME = "expect";
// The target name that means the survey itself.
export const RESERVED_TARGET_SURVEY = "survey";
