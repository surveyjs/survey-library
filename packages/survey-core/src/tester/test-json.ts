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
  // What the survey takes from outside itself. Both are maps by key - the function name, the url - and
  // both are merged per key, test over suite, like the variables above them.
  functions?: { [name: string]: ISurveyTestFunctionStub };
  web?: { [url: string]: ISurveyTestWebStub };
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
  // Merged over ISurveyTests.functions and ISurveyTests.web, per name and per url: a test overrides
  // one entry without restating the map.
  functions?: { [name: string]: ISurveyTestFunctionStub };
  web?: { [url: string]: ISurveyTestWebStub };
  steps: Array<ISurveyTestStep>;
}

// What a function registered through FunctionFactory answers while this case runs. The stub replaces
// the body of that function for the model of this test alone: what the survey does with the answer -
// an expression, a trigger, a calculated value - is the real code.
export interface ISurveyTestFunctionStub {
  // Whether the survey defers the expression that calls it. Inherited from an existing registration
  // when the process has one - and contradicting that registration is a case error, because a survey
  // cannot treat one name as both - and true when it has none.
  async?: boolean;
  // Real milliseconds before the answer, never the pinned clock of the test: what is simulated is a
  // slow handler, not a different date. Bounded by the "asyncTimeout" option. Asynchronous stubs only.
  delay?: number;
  // The answer when no "results" row matches.
  result?: any;
  results?: Array<ISurveyTestFunctionResult>;
  // The handler failed. The expression receives null, the way it does when a real one fails, and the
  // step records a warning that says why.
  error?: string;
}

export interface ISurveyTestFunctionResult {
  // The arguments this row answers, compared as the checks compare values: "1" does not match 1.
  params: Array<any>;
  result?: any;
  delay?: number;
  error?: string;
}

// What a "choicesByUrl" request answers. The stub supplies the response and nothing else: the path,
// the value and title fields, the parsing and what an error does to the question all stay in the
// survey.
export interface ISurveyTestWebStub {
  // Default 200. Anything else takes the question down the same path a failing service does.
  status?: number;
  statusText?: string;
  // A string is parsed the way a real response is - JSON, XML, a plain list of lines - and an object
  // or an array is the body already parsed.
  response?: any;
  // Real milliseconds, as above.
  delay?: number;
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
  // How long a step waits for an asynchronous survey operation - server validation, an asynchronous
  // validator or expression, a navigation handler that holds its callback - before the test ends with
  // the "asyncOperationTimeout" error. Milliseconds; default 5000. Zero, or less, waits for nothing.
  asyncTimeout?: number;
}

// Step keys that are metadata and never a command name. Frozen: it is public through the tester entry
// point, and it is the one list the validator, the runner and an editor all read.
export const STEP_METADATA_KEYS: ReadonlyArray<string> = Object.freeze(["name", "description"]);
// The one command the format fixes the payload shape of.
export const CHECK_COMMAND_NAME = "expect";
// The target name that means the survey itself.
export const RESERVED_TARGET_SURVEY = "survey";
