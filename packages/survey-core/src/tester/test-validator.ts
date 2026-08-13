import { CHECK_COMMAND_NAME, ISurveyTest, ISurveyTests, ISurveyTestStep, STEP_METADATA_KEYS } from "./test-json";
import { ISurveyTestIssue, SurveyTestIssueCodes, SurveyTestSeverity } from "./test-result";

const DATA_MODES = ["input", "restore"];
// A start describes a starting state only. Options and variables have exactly one path each, and it
// does not go through a start.
const START_RESERVED_KEYS = ["options", "variables"];

// A purely structural check of a suite object: it never sees a survey definition and knows nothing
// about element names, command names or check names. Unknown command and check names depend on the
// registries and are reported at run time. The validator never throws and never mutates its input.
export class SurveyTestValidator {
  public validate(tests: ISurveyTests): Array<ISurveyTestIssue> {
    const issues: Array<ISurveyTestIssue> = [];
    if (!this.isObject(tests)) {
      this.addIssue(issues, SurveyTestIssueCodes.notAnObject, "A test suite must be an object.");
      return issues;
    }
    this.validateOptions(tests.options, "options", issues);
    this.validateVariables(tests.variables, "variables", issues);
    const startNames = this.validateStarts(tests, issues);
    const testsArray = tests.tests;
    if (!Array.isArray(testsArray) || testsArray.length === 0) {
      this.addIssue(issues, SurveyTestIssueCodes.testsMissing,
        "A test suite must contain a non-empty \"tests\" array.");
      return issues;
    }
    const nameIndexes: { [name: string]: number } = {};
    for (let i = 0; i < testsArray.length; i++) {
      const test = testsArray[i];
      const path = "tests[" + i + "]";
      const name = this.isObject(test) ? test.name : undefined;
      if (this.isNonEmptyString(name)) {
        if (nameIndexes[name] !== undefined) {
          this.addIssue(issues, SurveyTestIssueCodes.duplicateTestName,
            "Two tests are named \"" + name + "\" (tests " + nameIndexes[name] + " and " + i +
            "). Test names should be unique.", { path: path, severity: "warning", data: { name: name, indexes: [nameIndexes[name], i] } });
        } else {
          nameIndexes[name] = i;
        }
      }
      this.validateTest(test, path, startNames).forEach(issue => issues.push(issue));
    }
    return issues;
  }

  // startNames is optional: a test validated on its own has no suite to resolve a named start
  // against, and guessing there would report an error that does not exist.
  public validateTest(test: ISurveyTest, path: string, startNames?: Array<string>): Array<ISurveyTestIssue> {
    const issues: Array<ISurveyTestIssue> = [];
    if (!this.isObject(test)) {
      this.addIssue(issues, SurveyTestIssueCodes.notAnObject, "A test must be an object.", { path: path });
      return issues;
    }
    if (!this.isNonEmptyString(test.name)) {
      this.addIssue(issues, SurveyTestIssueCodes.testNameMissing, "A test must have a non-empty \"name\".", { path: path });
    }
    this.validateOptions(test.options, path + ".options", issues);
    this.validateVariables(test.variables, path + ".variables", issues);
    this.validateTestStart(test, path, startNames, issues);
    const steps = test.steps;
    if (!Array.isArray(steps) || steps.length === 0) {
      this.addIssue(issues, SurveyTestIssueCodes.stepsMissing, "A test must contain a non-empty \"steps\" array.", { path: path });
      return issues;
    }
    for (let i = 0; i < steps.length; i++) {
      this.validateStep(steps[i], path + ".steps[" + i + "]").forEach(issue => {
        issue.step = i;
        issues.push(issue);
      });
    }
    return issues;
  }

  public validateStep(step: ISurveyTestStep, path: string): Array<ISurveyTestIssue> {
    const issues: Array<ISurveyTestIssue> = [];
    if (!this.isObject(step)) {
      this.addIssue(issues, SurveyTestIssueCodes.stepNotAnObject, "A step must be an object.", { path: path });
      return issues;
    }
    const commands: Array<string> = [];
    Object.keys(step).forEach(key => {
      if (STEP_METADATA_KEYS.indexOf(key) > -1) return;
      if (step[key] === undefined) {
        this.addIssue(issues, SurveyTestIssueCodes.unknownStepKey,
          "The key \"" + key + "\" is not a command: its value is undefined.", { path: path, data: { key: key } });
        return;
      }
      commands.push(key);
    });
    if (commands.length === 0) {
      this.addIssue(issues, SurveyTestIssueCodes.stepEmpty,
        "A step holds exactly one command, but this step holds none. " + this.quoteList(STEP_METADATA_KEYS) +
        " are step metadata, not commands.",
        { path: path });
      return issues;
    }
    if (commands.length > 1) {
      this.addIssue(issues, SurveyTestIssueCodes.stepHasSeveralCommands,
        "A step holds exactly one command, but this step holds " + commands.length + ": " + this.quoteList(commands) + "." +
        (commands.indexOf(CHECK_COMMAND_NAME) > -1
          ? " \"" + CHECK_COMMAND_NAME + "\" is a command as well, so it goes into a step of its own."
          : ""),
        { path: path, data: { commands: commands } });
      return issues;
    }
    const command = commands[0];
    this.validateCommandParams(command, step[command], path + "." + command, issues);
    return issues;
  }

  private validateCommandParams(command: string, params: any, path: string, issues: Array<ISurveyTestIssue>): void {
    if (command === CHECK_COMMAND_NAME) {
      this.validateChecks(params, path, issues);
      return;
    }
    if (!this.isObject(params)) {
      this.addIssue(issues, SurveyTestIssueCodes.commandParamsNotAnObject,
        "The parameters of the \"" + command + "\" command must be an object that maps a target name to its parameters.",
        { path: path, data: { command: command } });
      return;
    }
    if (Object.keys(params).length === 0) {
      this.addIssue(issues, SurveyTestIssueCodes.commandParamsNotAnObject,
        "The \"" + command + "\" command has no target. Add at least one target name to its parameters.",
        { path: path, data: { command: command } });
    }
  }

  // The single name-aware rule in an otherwise structural validator: the check map is the one payload
  // shape the format fixes, so an editor can validate a case without loading the registries.
  private validateChecks(params: any, path: string, issues: Array<ISurveyTestIssue>): void {
    if (!this.isObject(params)) {
      this.addIssue(issues, SurveyTestIssueCodes.expectNotAnObject,
        "The parameters of the \"" + CHECK_COMMAND_NAME + "\" command must be an object that maps a target name to its checks.",
        { path: path });
      return;
    }
    const targets = Object.keys(params);
    if (targets.length === 0) {
      this.addIssue(issues, SurveyTestIssueCodes.expectEmpty,
        "The \"" + CHECK_COMMAND_NAME + "\" command has no target. Add at least one target name with the checks to run on it.",
        { path: path });
      return;
    }
    targets.forEach(target => {
      const checks = params[target];
      const targetPath = path + "." + target;
      if (!this.isObject(checks)) {
        this.addIssue(issues, SurveyTestIssueCodes.expectTargetNotAnObject,
          "The checks of the target \"" + target + "\" must be an object that maps a check name to its expected value.",
          { path: targetPath, target: target });
        return;
      }
      if (Object.keys(checks).length === 0) {
        this.addIssue(issues, SurveyTestIssueCodes.expectEmpty,
          "The target \"" + target + "\" has no checks. Add at least one check name with its expected value.",
          { path: targetPath, target: target });
      }
    });
  }

  private validateOptions(options: any, path: string, issues: Array<ISurveyTestIssue>): void {
    if (options === undefined) return;
    if (!this.isObject(options)) {
      this.addIssue(issues, SurveyTestIssueCodes.optionsNotAnObject, "\"options\" must be an object.", { path: path });
      return;
    }
    Object.keys(options).forEach(key => {
      const val = options[key];
      if (typeof val === "object" && val !== null) {
        this.addIssue(issues, SurveyTestIssueCodes.optionsNotAnObject,
          "The option \"" + key + "\" must be a scalar value: \"options\" is flat and holds neither objects nor arrays.",
          { path: path + "." + key, data: { key: key } });
      }
    });
  }

  private validateVariables(variables: any, path: string, issues: Array<ISurveyTestIssue>): void {
    if (variables === undefined) return;
    if (!this.isObject(variables)) {
      this.addIssue(issues, SurveyTestIssueCodes.variablesNotAnObject, "\"variables\" must be an object.", { path: path });
    }
  }

  // Duplicate names and unresolved references are reported up front, for the whole suite, before any
  // test runs: they are never resolved last-wins and never discovered mid-run.
  private validateStarts(tests: ISurveyTests, issues: Array<ISurveyTestIssue>): Array<string> {
    const names: Array<string> = [];
    const starts = tests.starts;
    if (starts === undefined) return names;
    if (!Array.isArray(starts)) {
      this.addIssue(issues, SurveyTestIssueCodes.startsNotAnArray, "\"starts\" must be an array.", { path: "starts" });
      return names;
    }
    const nameIndexes: { [name: string]: number } = {};
    for (let i = 0; i < starts.length; i++) {
      const start: any = starts[i];
      const path = "starts[" + i + "]";
      if (!this.isObject(start)) {
        this.addIssue(issues, SurveyTestIssueCodes.startNotAnObject, "A \"starts\" entry must be an object.", { path: path });
        continue;
      }
      const name = start.name;
      if (!this.isNonEmptyString(name)) {
        this.addIssue(issues, SurveyTestIssueCodes.startNameMissing, "A \"starts\" entry must have a non-empty \"name\".", { path: path });
      } else if (nameIndexes[name] !== undefined) {
        this.addIssue(issues, SurveyTestIssueCodes.duplicateStartName,
          "Two \"starts\" entries are named \"" + name + "\" (entries " + nameIndexes[name] + " and " + i +
          "). Start names must be unique.", { path: path, data: { name: name, indexes: [nameIndexes[name], i] } });
      } else {
        nameIndexes[name] = i;
        names.push(name);
      }
      this.validateStartBody(start, path, issues);
    }
    return names;
  }

  private validateTestStart(test: ISurveyTest, path: string, startNames: Array<string> | undefined, issues: Array<ISurveyTestIssue>): void {
    const start: any = test.start;
    if (start === undefined) return;
    const startPath = path + ".start";
    if (typeof start === "string") {
      if (!startNames) return;
      if (startNames.indexOf(start) < 0) {
        this.addIssue(issues, SurveyTestIssueCodes.unknownStartReference,
          "The test refers to the start \"" + start + "\", but \"starts\" contains no entry with this name.",
          { path: startPath, data: { name: start } });
      }
      return;
    }
    if (!this.isObject(start)) {
      this.addIssue(issues, SurveyTestIssueCodes.startNotAnObject,
        "\"start\" must be either a name from \"starts\" or an inline start object.", { path: startPath });
      return;
    }
    // An inline start needs no "name": a "name" key here is ignored, never used to look anything up.
    this.validateStartBody(start, startPath, issues);
  }

  private validateStartBody(start: any, path: string, issues: Array<ISurveyTestIssue>): void {
    START_RESERVED_KEYS.forEach(key => {
      if (start[key] !== undefined) {
        this.addIssue(issues, SurveyTestIssueCodes.startHasReservedKey,
          "A start cannot carry \"" + key + "\": \"" + key + "\" is set on the suite or on a test, never on a start.",
          { path: path + "." + key, data: { key: key } });
      }
    });
    if (start.dataMode !== undefined && DATA_MODES.indexOf(start.dataMode) < 0) {
      this.addIssue(issues, SurveyTestIssueCodes.invalidDataMode,
        "\"dataMode\" must be either \"input\" or \"restore\".", { path: path + ".dataMode", data: { dataMode: start.dataMode } });
    }
    if (start.startPage !== undefined && typeof start.startPage !== "string") {
      this.addIssue(issues, SurveyTestIssueCodes.invalidStartPage,
        "\"startPage\" must be a page name. A page index is not accepted: a page reorder would silently redirect the test.",
        { path: path + ".startPage" });
    }
  }

  private addIssue(issues: Array<ISurveyTestIssue>, code: string, message: string,
    props?: { path?: string, target?: string, severity?: SurveyTestSeverity, data?: any }): void {
    const issue: ISurveyTestIssue = {
      severity: props && props.severity ? props.severity : "error",
      code: code,
      message: message,
    };
    if (props) {
      if (props.path !== undefined) issue.path = props.path;
      if (props.target !== undefined) issue.target = props.target;
      if (props.data !== undefined) issue.data = props.data;
    }
    issues.push(issue);
  }

  private quoteList(values: Array<string>): string {
    return values.map(val => "\"" + val + "\"").join(", ");
  }

  private isObject(val: any): boolean {
    return !!val && typeof val === "object" && !Array.isArray(val);
  }

  private isNonEmptyString(val: any): val is string {
    return typeof val === "string" && val.length > 0;
  }
}
