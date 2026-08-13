import { SurveyModel } from "../survey";
import { ISurveyTest, ISurveyTestOptions, ISurveyTests, ISurveyTestStart, ISurveyTestStep, STEP_METADATA_KEYS } from "./test-json";
import {
  ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, ISurveyTestStepResult,
  ISurveyTestSummary, SurveyTestIssueCodes, SurveyTestStatus,
} from "./test-result";
import { SurveyTestValidator } from "./test-validator";
import { createCaseError, ISurveyTestTarget, SurveyTestCaseError, SurveyTestContext } from "./test-context";
import {
  formatTestValue, getTestPayloadTypeText, isCommandAllowedForKind, isValidTestPayload, ISurveyTestCommand,
  SurveyTestCommandFactory,
} from "./test-commands";
// Imported for its side effect: it registers the "expect" command and the built-in check set.
import "./test-checks";

const TEST_PATH_PREFIX = "tests[";

export class SurveyTestRunner {
  private validator: SurveyTestValidator = new SurveyTestValidator();
  // survey is either a survey definition or a SurveyModel. A model is normalised once with toJSON()
  // and never used directly: a run neither mutates nor navigates the caller's model.
  constructor(private survey: any, private tests: ISurveyTests, private options?: ISurveyTestOptions) {
  }
  // The API is Promise-based although every built-in command is synchronous: async validators,
  // onServerValidateQuestions and async expression functions exist, and turning a sync API into an
  // async one later is a breaking change.
  public run(): Promise<ISurveyTestsResult> {
    return Promise.resolve(this.runCore());
  }
  public runTest(test: ISurveyTest): Promise<ISurveyTestResult> {
    const definition = this.getDefinition();
    if (!definition) {
      const result = this.createTestResult(test);
      result.status = "error";
      result.issues.push(this.createSurveyMissingIssue());
      return Promise.resolve(result);
    }
    return Promise.resolve(this.runTestCore(test, definition, []));
  }
  private runCore(): ISurveyTestsResult {
    const result: ISurveyTestsResult = {
      status: "passed",
      tests: [],
      summary: this.createEmptySummary(),
      issues: [],
    };
    const suite: any = this.tests;
    if (!!suite && typeof suite === "object" && typeof suite.name === "string") {
      result.name = suite.name;
    }
    const definition = this.getDefinition();
    if (!definition) {
      result.issues.push(this.createSurveyMissingIssue());
      result.status = "error";
      result.summary = this.createSummary(result);
      return result;
    }
    const issues = this.validator.validate(suite);
    const suiteIssues = issues.filter(issue => !this.getTestIndex(issue.path));
    if (suiteIssues.some(issue => issue.severity === "error")) {
      result.issues = issues;
      result.status = "error";
      result.summary = this.createSummary(result);
      return result;
    }
    result.issues = suiteIssues;
    const tests = suite.tests;
    for (let i = 0; i < tests.length; i++) {
      const testIssues = issues.filter(issue => this.getTestIndex(issue.path) === TEST_PATH_PREFIX + i + "]");
      result.tests.push(this.runTestCore(tests[i], definition, testIssues));
    }
    result.status = this.getSuiteStatus(result);
    result.summary = this.createSummary(result);
    return result;
  }
  private runTestCore(test: ISurveyTest, definition: any, testIssues: Array<ISurveyTestIssue>): ISurveyTestResult {
    const result = this.createTestResult(test);
    testIssues.forEach(issue => result.issues.push(issue));
    // A structural error wins over "disabled": a broken case is reported as broken, it is never
    // silently downgraded to a skipped one.
    if (testIssues.some(issue => issue.severity === "error")) {
      result.status = "error";
      return result;
    }
    if (!!test.disabled) {
      result.status = "skipped";
      return result;
    }
    const variables = this.resolveVariables(test);
    result.variables = variables;
    const context = new SurveyTestContext(this.cloneJson(definition), result.options, test, result.issues);
    try {
      const start = this.resolveStart(test, result);
      context.setup();
      context.checkReservedTargetName();
      this.applyStart(context, variables, start);
      this.runSteps(context, test, result);
    } catch(e) {
      result.issues.push(this.toIssue(e));
      result.status = "error";
    } finally {
      context.teardown();
    }
    return result;
  }
  private runSteps(context: SurveyTestContext, test: ISurveyTest, result: ISurveyTestResult): void {
    const steps = Array.isArray(test.steps) ? test.steps : [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepResult: ISurveyTestStepResult = { index: i, command: "", status: "passed", checks: [], issues: [] };
      if (!!step && typeof step.name === "string") stepResult.name = step.name;
      result.steps.push(stepResult);
      context.setCurrentStep(stepResult);
      try {
        this.runStep(context, step, stepResult);
      } catch(e) {
        const issue = this.toIssue(e);
        issue.step = i;
        stepResult.issues.push(issue);
      }
      context.setCurrentStep(undefined);
      const hasError = stepResult.issues.some(issue => issue.severity === "error");
      const hasFailed = stepResult.checks.some((check: ISurveyTestCheckResult) => !check.passed);
      stepResult.status = hasError ? "error" : (hasFailed ? "failed" : "passed");
      if (hasError) {
        result.status = "error";
        return;
      }
      if (hasFailed) {
        result.status = "failed";
        // stopOnFirstFailure ends this test only. A suite run never stops at the first failure.
        if (result.options.stopOnFirstFailure === true) return;
      }
    }
  }
  private runStep(context: SurveyTestContext, step: ISurveyTestStep, stepResult: ISurveyTestStepResult): void {
    const commandName = this.getStepCommandName(step);
    stepResult.command = commandName;
    const command = SurveyTestCommandFactory.Instance.get(commandName);
    if (!command) {
      throw createCaseError(SurveyTestIssueCodes.unknownCommand,
        "There is no command named \"" + commandName + "\". Available commands: " +
        SurveyTestCommandFactory.Instance.getNames().join(", ") + ".",
        { data: { command: commandName } });
    }
    const params = step[commandName];
    if (!this.isObject(params) || Object.keys(params).length === 0) {
      throw createCaseError(SurveyTestIssueCodes.commandParamsNotAnObject,
        "The parameters of the \"" + commandName +
        "\" command must be a non-empty object that maps a target name to its parameters.",
        { data: { command: commandName } });
    }
    // Targets run in key order: a case that sets two values relies on the order it wrote them in.
    Object.keys(params).forEach(targetName => {
      const target = context.resolveTarget(targetName);
      this.checkCommandTarget(command, target);
      const payload = params[targetName];
      if (!isValidTestPayload(command.payloadType, payload)) {
        throw createCaseError(SurveyTestIssueCodes.invalidCommandParams,
          "The \"" + command.name + "\" command expects " + getTestPayloadTypeText(command.payloadType) +
          " as the parameters of the target \"" + targetName + "\", and it was given " +
          formatTestValue(payload) + this.getUnknownKeysText(payload) + ".",
          { target: targetName, data: { command: command.name, payloadType: command.payloadType } });
      }
      command.run(context, target, payload);
    });
  }
  // A command that takes no parameters is often handed a leftover option object from an earlier draft
  // of a case ({ "complete": { "survey": { "force": true } } }). Naming the keys turns "wrong type"
  // into "this key does not exist".
  private getUnknownKeysText(payload: any): string {
    if (!this.isObject(payload)) return "";
    const keys = Object.keys(payload);
    if (keys.length === 0) return "";
    return ". The command understands no parameter named " + keys.map(key => "\"" + key + "\"").join(", ");
  }
  private checkCommandTarget(command: ISurveyTestCommand, target: ISurveyTestTarget): void {
    if (isCommandAllowedForKind(command, target.kind)) return;
    throw createCaseError(SurveyTestIssueCodes.commandNotApplicable,
      "The command \"" + command.name + "\" does not apply to the " + target.kind + " \"" + target.name +
      "\". Commands for a " + target.kind + ": " +
      SurveyTestCommandFactory.Instance.getNamesForKind(target.kind).join(", ") + ".",
      { target: target.name, data: { command: command.name, kind: target.kind } });
  }
  private getStepCommandName(step: ISurveyTestStep): string {
    if (!this.isObject(step)) {
      throw createCaseError(SurveyTestIssueCodes.stepNotAnObject, "A step must be an object.");
    }
    const commands = Object.keys(step).filter(key => STEP_METADATA_KEYS.indexOf(key) < 0 && step[key] !== undefined);
    if (commands.length === 0) {
      throw createCaseError(SurveyTestIssueCodes.stepEmpty, "A step holds exactly one command, but this step holds none.");
    }
    if (commands.length > 1) {
      throw createCaseError(SurveyTestIssueCodes.stepHasSeveralCommands,
        "A step holds exactly one command, but this step holds " + commands.length + ": " +
        commands.map(name => "\"" + name + "\"").join(", ") + ".", { data: { commands: commands } });
    }
    return commands[0];
  }
  // Variables go in before any data: a visibleIf or a defaultValueExpression that reads a variable
  // must see it while the answers are applied.
  private applyStart(context: SurveyTestContext, variables: { [name: string]: any }, start: ISurveyTestStart): void {
    const survey = context.survey;
    Object.keys(variables).forEach(name => survey.setVariable(name, variables[name]));
    if (!start) return;
    // The survey keeps what it is handed, so it gets a copy: the start recorded on the result stays
    // the state the case described, whatever the run does to the values afterwards.
    const data = this.cloneJson(start.data);
    if (this.isObject(data)) {
      if (start.dataMode === "restore") {
        // As if loaded from saved storage: the values are assigned at once, conditions and calculated
        // values run, triggers do not.
        survey.data = data;
      } else {
        // The default: every answer goes in through the normal set path, so triggers, calculated
        // values and conditions run exactly as they would for a respondent.
        Object.keys(data).forEach(name => survey.setValue(name, data[name]));
      }
    }
    if (!!start.startPage) {
      this.applyStartPage(survey, start.startPage);
    }
  }
  private applyStartPage(survey: SurveyModel, pageName: string): void {
    const page = survey.getPageByName(pageName);
    if (!page) {
      throw createCaseError(SurveyTestIssueCodes.unknownStartPage,
        "The start refers to the page \"" + pageName + "\", but the survey has no page with this name.",
        { data: { startPage: pageName } });
    }
    // SurveyModel ignores an assignment of an invisible page, so a test would silently run on another
    // page. A start that cannot be reached with the state it describes is a broken case.
    if (survey.visiblePages.indexOf(page) < 0) {
      throw createCaseError(SurveyTestIssueCodes.startPageNotVisible,
        "The page \"" + pageName + "\" exists but is not visible with the data and the variables of this start, so the test cannot begin on it.",
        { data: { startPage: pageName } });
    }
    survey.currentPage = page;
  }
  // A start is referenced or inline, and nothing merges into it. The resolved start is deep-cloned
  // per test run: a shared "starts" entry is reused by many tests and a mutation must not leak.
  private resolveStart(test: ISurveyTest, result: ISurveyTestResult): ISurveyTestStart {
    const start: any = test.start;
    if (start === undefined || start === null) return undefined;
    if (typeof start === "string") {
      const entry = this.getStartByName(start);
      if (!entry) {
        throw createCaseError(SurveyTestIssueCodes.unknownStartReference,
          "The test refers to the start \"" + start + "\", but \"starts\" contains no entry with this name.",
          { data: { name: start } });
      }
      result.startName = start;
      result.start = this.cloneStart(entry);
      return result.start;
    }
    if (!this.isObject(start)) {
      throw createCaseError(SurveyTestIssueCodes.startNotAnObject,
        "\"start\" must be either a name from \"starts\" or an inline start object.");
    }
    // A "name" key inside an inline start is ignored: it never looks anything up.
    result.start = this.cloneStart(start);
    return result.start;
  }
  private getStartByName(name: string): any {
    const starts = !!this.tests ? this.tests.starts : undefined;
    if (!Array.isArray(starts)) return undefined;
    for (let i = 0; i < starts.length; i++) {
      if (!!starts[i] && starts[i].name === name) return starts[i];
    }
    return undefined;
  }
  private cloneStart(start: any): ISurveyTestStart {
    const res: ISurveyTestStart = {};
    if (start.data !== undefined) res.data = this.cloneJson(start.data);
    if (start.startPage !== undefined) res.startPage = start.startPage;
    if (start.dataMode !== undefined) res.dataMode = start.dataMode;
    return res;
  }
  // Shallow, one level, per key, later wins. The keys are merged on presence, not on a defined value,
  // so a test can override any option back to its default.
  private resolveOptions(test: ISurveyTest): ISurveyTestOptions {
    const res: ISurveyTestOptions = {};
    this.copyByPresence(res, this.options);
    this.copyByPresence(res, !!this.tests ? this.tests.options : undefined);
    this.copyByPresence(res, !!test ? test.options : undefined);
    return res;
  }
  // Merged per variable name: a test that overrides one root variable keeps the others. A test can
  // override a root variable but cannot remove one - null sets it to null, it does not unset it.
  private resolveVariables(test: ISurveyTest): { [name: string]: any } {
    const res: { [name: string]: any } = {};
    this.copyByPresence(res, !!this.tests ? this.tests.variables : undefined);
    this.copyByPresence(res, !!test ? test.variables : undefined);
    return res;
  }
  private copyByPresence(dest: any, source: any): void {
    if (!this.isObject(source)) return;
    Object.keys(source).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        dest[key] = source[key];
      }
    });
  }
  private getDefinition(): any {
    const survey = this.survey;
    if (survey instanceof SurveyModel) return survey.toJSON();
    if (this.isObject(survey)) return survey;
    return undefined;
  }
  private createTestResult(test: ISurveyTest): ISurveyTestResult {
    return {
      name: !!test && typeof test.name === "string" ? test.name : "",
      status: "passed",
      options: this.resolveOptions(test),
      steps: [],
      issues: [],
    };
  }
  private createSurveyMissingIssue(): ISurveyTestIssue {
    return {
      severity: "error",
      code: SurveyTestIssueCodes.surveyMissing,
      message: "A survey definition is required to run a test suite. Pass a survey JSON object or a SurveyModel instance to the runner.",
    };
  }
  // An unexpected exception from survey-core never reaches the caller: it becomes a case error.
  private toIssue(error: any): ISurveyTestIssue {
    if (error instanceof SurveyTestCaseError) return error.issue;
    const message = !!error && !!error.message ? error.message : String(error);
    return {
      severity: "error",
      code: SurveyTestIssueCodes.unexpectedError,
      message: "The survey threw an unexpected error: " + message,
    };
  }
  private getTestIndex(path: string): string {
    if (!path || path.indexOf(TEST_PATH_PREFIX) !== 0) return undefined;
    const end = path.indexOf("]");
    return end < 0 ? undefined : path.substring(0, end + 1);
  }
  private getSuiteStatus(result: ISurveyTestsResult): SurveyTestStatus {
    if (result.issues.some(issue => issue.severity === "error")) return "error";
    if (result.tests.some(test => test.status === "error")) return "error";
    if (result.tests.some(test => test.status === "failed")) return "failed";
    return "passed";
  }
  // The counters are computed from the results, never accumulated along the way, so they cannot drift.
  private createSummary(result: ISurveyTestsResult): ISurveyTestSummary {
    const summary = this.createEmptySummary();
    summary.total = result.tests.length;
    summary.warnings = this.countWarnings(result.issues);
    result.tests.forEach(test => {
      if (test.status === "passed") summary.passed++;
      if (test.status === "failed") summary.failed++;
      if (test.status === "error") summary.errored++;
      if (test.status === "skipped") summary.skipped++;
      summary.warnings += this.countWarnings(test.issues);
      test.steps.forEach(step => {
        summary.warnings += this.countWarnings(step.issues);
        summary.checks += step.checks.length;
        summary.failedChecks += step.checks.filter(check => !check.passed).length;
      });
    });
    return summary;
  }
  private countWarnings(issues: Array<ISurveyTestIssue>): number {
    return issues.filter(issue => issue.severity === "warning").length;
  }
  private createEmptySummary(): ISurveyTestSummary {
    return { total: 0, passed: 0, failed: 0, errored: 0, skipped: 0, checks: 0, failedChecks: 0, warnings: 0 };
  }
  private cloneJson(obj: any): any {
    return obj === undefined ? obj : JSON.parse(JSON.stringify(obj));
  }
  private isObject(val: any): boolean {
    return !!val && typeof val === "object" && !Array.isArray(val);
  }
}
