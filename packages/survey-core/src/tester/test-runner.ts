import { SurveyModel } from "../survey";
import { ISurveyTest, ISurveyTestOptions, ISurveyTests, ISurveyTestStart, ISurveyTestStep, STEP_METADATA_KEYS } from "./test-json";
import {
  ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, ISurveyTestStepResult,
  ISurveyTestSummary, SurveyTestIssueCodes, SurveyTestStatus,
} from "./test-result";
import { SurveyTestValidator } from "./test-validator";
import { waitForSurvey } from "./test-async";
import { getClosestName } from "./test-diagnostics";
import { createCaseError, ISurveyTestTarget, SurveyTestCaseError, SurveyTestContext } from "./test-context";
import {
  formatTestValue, getTestPayloadTypeText, isCommandAllowedForKind, isValidTestPayload, ISurveyTestCommand,
  SurveyTestCommandFactory,
} from "./test-commands";
import {
  ISurveyTestExecutionOptions, ISurveyTestModelFactoryContext, SurveyTestCanceledError, SurveyTestExecution,
} from "./test-execution";
// Imported for its side effect: it registers the "expect" command and the built-in check set.
import "./test-checks";

const TEST_PATH_PREFIX = "tests[";
// A test run on its own is not addressed by its index in the suite: it is not required to belong to
// one, so its issues are pathed from "test" instead of from "tests[i]".
const SINGLE_TEST_PATH = "test";

export class SurveyTestRunner {
  private validator: SurveyTestValidator = new SurveyTestValidator();
  // surveyJson is the survey definition and nothing else. The runner creates the model every test runs
  // on, so a model handed in here would never be the one that runs: its handlers, its callbacks and its
  // state would be lost. An application configures the model it wants through ISurveyTestExecutionOptions.
  constructor(private surveyJson: any, private tests: ISurveyTests, private options?: ISurveyTestOptions) {
  }
  // Genuinely asynchronous: a command handler, a check handler and an observer callback may each
  // return a promise, and nothing starts until the operation before it and its callback have finished.
  public run(executionOptions?: ISurveyTestExecutionOptions): Promise<ISurveyTestsResult> {
    return this.runCore(new SurveyTestExecution(executionOptions));
  }
  public runTest(test: ISurveyTest, executionOptions?: ISurveyTestExecutionOptions): Promise<ISurveyTestResult> {
    return this.runSingleTest(test, new SurveyTestExecution(executionOptions));
  }
  private async runSingleTest(test: ISurveyTest, execution: SurveyTestExecution): Promise<ISurveyTestResult> {
    // Stopped before the test started: it is reported as canceled, and no testStarted/testCompleted
    // pair is manufactured for something that never began.
    if (execution.isCanceled) return this.createCanceledResult(test);
    const definition = this.getDefinition();
    if (!definition) {
      const result = this.createTestResult(test);
      result.status = "error";
      result.issues.push(this.createDefinitionIssue());
      return result;
    }
    // The same structural validation a suite run does, so a broken case cannot be reported as passed
    // because the caller picked this entry point. Named starts still resolve against the suite.
    const issues = this.validator.validateTest(test, SINGLE_TEST_PATH, this.getStartNames());
    return await this.runTestCore(test, undefined, definition, issues, execution);
  }
  // runStarted and runCompleted bracket every path of a suite run, a suite that cannot run at all
  // included: a host that displays progress needs the two boundaries whatever happens in between.
  private async runCore(execution: SurveyTestExecution): Promise<ISurveyTestsResult> {
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
    // Stopped before the run started: the two boundaries are not manufactured for a run that never
    // began. Every other path emits both, cancellation included.
    if (execution.isCanceled) {
      result.status = "canceled";
      return result;
    }
    try {
      await execution.emit({ type: "runStarted", tests: suite });
      await this.runSuite(result, execution);
    } catch(e) {
      // Only an observer can throw here: everything else is reported as an issue where it happened.
      if (!execution.isCancellation(e)) {
        result.issues.push(this.toIssue(e));
      }
    }
    // A stopped run is canceled whatever the tests that did finish reported: they keep their own
    // status, and the suite says why it holds no more of them.
    result.status = execution.isCanceled ? "canceled" : this.getSuiteStatus(result);
    result.summary = this.createSummary(result);
    try {
      await execution.emitCompleted({ type: "runCompleted", result: result });
    } catch(e) {
      result.issues.push(this.toIssue(e));
      if (result.status !== "canceled") result.status = "error";
    }
    return result;
  }
  private async runSuite(result: ISurveyTestsResult, execution: SurveyTestExecution): Promise<void> {
    const suite: any = this.tests;
    const definition = this.getDefinition();
    if (!definition) {
      result.issues.push(this.createDefinitionIssue());
      return;
    }
    const issues = this.validator.validate(suite);
    const suiteIssues = issues.filter(issue => !this.getTestIndex(issue.path));
    if (suiteIssues.some(issue => issue.severity === "error")) {
      result.issues = issues;
      return;
    }
    result.issues = suiteIssues;
    const tests = suite.tests;
    for (let i = 0; i < tests.length; i++) {
      // Before each test: a test the run never reached produces no result and no event pair.
      execution.throwIfCanceled();
      const testIssues = issues.filter(issue => this.getTestIndex(issue.path) === TEST_PATH_PREFIX + i + "]");
      result.tests.push(await this.runTestCore(tests[i], i, definition, testIssues, execution));
    }
  }
  private async runTestCore(test: ISurveyTest, testIndex: number, definition: any,
    testIssues: Array<ISurveyTestIssue>, execution: SurveyTestExecution): Promise<ISurveyTestResult> {
    const result = this.createTestResult(test);
    testIssues.forEach(issue => result.issues.push(issue));
    // Both callers stop before a canceled test is entered, so testStarted is always announced here and
    // cancellation can only be raised once the host has heard it.
    let started = false;
    try {
      await execution.emit({ type: "testStarted", testIndex: testIndex, test: test });
      started = true;
      await this.runTestBody(test, testIndex, definition, result, execution);
    } catch(e) {
      // Only an observer can throw here: runTestBody turns every failure of its own into an issue. The
      // issue is not announced - the observer that would hear about it is the one that just failed.
      if (execution.isCancellation(e)) {
        started = true;
        result.status = "canceled";
      } else {
        result.issues.push(this.toIssue(e));
        result.status = "error";
      }
    }
    if (!started) return result;
    // The test that was running when the caller stopped the run is completed as canceled: a host that
    // heard testStarted hears the matching testCompleted whatever ended the test.
    try {
      await execution.emitCompleted({ type: "testCompleted", testIndex: testIndex, result: result });
    } catch(e) {
      result.issues.push(this.toIssue(e));
      if (result.status !== "canceled") result.status = "error";
    }
    return result;
  }
  // The order is fixed and it is the contract: the factory is called with the survey JSON of this test,
  // then the tester configures the model and subscribes to it, then the host sees it, and only then do
  // the variables, the start data and the steps touch it.
  private async runTestBody(test: ISurveyTest, testIndex: number, definition: any,
    result: ISurveyTestResult, execution: SurveyTestExecution): Promise<void> {
    // A structural error wins over "disabled": a broken case is reported as broken, it is never
    // silently downgraded to a skipped one. Neither one reaches the model factory.
    if (result.issues.some(issue => issue.severity === "error")) {
      result.status = "error";
      return;
    }
    if (!!test.disabled) {
      result.status = "skipped";
      return;
    }
    const variables = this.resolveVariables(test);
    result.variables = variables;
    const context = new SurveyTestContext(result.options, test, result.issues);
    if (execution.isObserved) {
      context.setNotifier(execution);
    }
    // A handler of the case cooperates with a stopped run through the context and nothing else.
    context.setSignal(execution.signal);
    let canceled = false;
    try {
      const start = this.resolveStart(test, result);
      const survey = await this.createSurveyModel(context, test, testIndex, definition, execution);
      context.setupSurvey(survey);
      context.checkReservedTargetName();
      await execution.emit({ type: "surveyCreated", testIndex: testIndex, test: test, survey: survey });
      // Loading the JSON starts the expressions of the model, and an asynchronous one is still running
      // when fromJSON returns. The start data has to go into a settled model: survey-core skips a
      // second run of an expression while the first one is in flight, so a value applied now would be
      // silently ignored by the very condition that reads it.
      await waitForSurvey(context, "the survey model was created");
      this.applyStart(context, variables, start);
      // The start data goes in through the normal set path, so it starts whatever a respondent typing
      // it would: the first step begins on a settled model like every step after it.
      await waitForSurvey(context, "the start state of the test was applied");
      await execution.flush(testIndex);
      await this.runSteps(context, test, result, testIndex, execution);
    } catch(e) {
      if (execution.isCancellation(e)) {
        canceled = true;
      } else {
        const issue = this.toIssue(e);
        result.issues.push(issue);
        result.status = "error";
        execution.notifyIssue(issue, -1);
      }
    } finally {
      // Nothing the model, the diagnostics or the global settings hold survives the test, whether it
      // ended on its own, on a rejected handler, on a rejected observer callback or on cancellation.
      context.teardown();
    }
    await this.flushIssues(result, testIndex, execution);
    // The steps that did finish keep what they reported; the test itself did not, so it is neither
    // passed nor failed. The caller stopping a run is not a fault of the case: no issue is added.
    if (canceled) {
      result.status = "canceled";
    }
  }
  private async createSurveyModel(context: SurveyTestContext, test: ISurveyTest, testIndex: number,
    definition: any, execution: SurveyTestExecution): Promise<SurveyModel> {
    // The clock of this test travels with the JSON: the factory is the only place that can pin the
    // expressions which run inside the constructor of the model.
    const factoryContext: ISurveyTestModelFactoryContext = {
      test: test, options: context.options, dateProvider: context.dateProvider,
    };
    if (testIndex !== undefined) {
      factoryContext.testIndex = testIndex;
    }
    let survey: any = undefined;
    try {
      // A clone per call: what the factory or the model does to the JSON cannot reach another test.
      survey = await execution.createSurvey(this.cloneJson(definition), factoryContext);
    } catch(e) {
      const message = !!e && !!e.message ? e.message : String(e);
      throw createCaseError(SurveyTestIssueCodes.surveyFactoryFailed,
        "The function that creates the survey model failed: " + message,
        { data: { error: message } });
    }
    if (!(survey instanceof SurveyModel)) {
      const what = !!survey && typeof survey === "object" ? "an object that is not a SurveyModel" : formatTestValue(survey);
      throw createCaseError(SurveyTestIssueCodes.surveyFactoryInvalidResult,
        "The function that creates the survey model must return a SurveyModel, and it returned " + what + ".");
    }
    // Every test runs on a model of its own: a shared one would carry the answers, the current page and
    // the completed state of the test before it into this one.
    if (execution.isModelUsed(survey)) {
      throw createCaseError(SurveyTestIssueCodes.surveyFactoryInvalidResult,
        "The function that creates the survey model returned a model another test has already run on. " +
        "Return a new SurveyModel for every call.");
    }
    execution.addModel(survey);
    return survey;
  }
  private async runSteps(context: SurveyTestContext, test: ISurveyTest, result: ISurveyTestResult,
    testIndex: number, execution: SurveyTestExecution): Promise<void> {
    const steps = Array.isArray(test.steps) ? test.steps : [];
    for (let i = 0; i < steps.length; i++) {
      // Before a step starts: nothing of it exists yet, so a stopped run adds neither a step result
      // nor an event pair for it.
      execution.throwIfCanceled();
      const step = steps[i];
      const stepResult: ISurveyTestStepResult = { index: i, command: "", status: "passed", checks: [], issues: [] };
      if (!!step && typeof step.name === "string") stepResult.name = step.name;
      result.steps.push(stepResult);
      context.setCurrentStep(stepResult);
      let canceled = false;
      try {
        await execution.emit({ type: "stepStarted", testIndex: testIndex, stepIndex: i, step: step });
      } catch(e) {
        // An observer that fails here still ends the test the way it always did; only a stopped run
        // is handled, and the step it was holding is completed as canceled.
        if (!execution.isCancellation(e)) throw e;
        canceled = true;
      }
      if (!canceled) {
        try {
          await this.runStep(context, step, stepResult, testIndex, execution);
        } catch(e) {
          if (execution.isCancellation(e)) {
            canceled = true;
          } else {
            const issue = this.toIssue(e);
            issue.step = i;
            context.enrichIssue(issue);
            stepResult.issues.push(issue);
            execution.notifyIssue(issue, i);
          }
        }
      }
      context.setCurrentStep(undefined);
      if (canceled) {
        // The step the run was stopped in did not finish: it is not a failure and it is not an error.
        // What it did produce before that is announced and kept.
        stepResult.status = "canceled";
        await execution.flush(testIndex);
        await execution.emitCompleted({ type: "stepCompleted", testIndex: testIndex, stepIndex: i, result: stepResult });
        throw new SurveyTestCanceledError();
      }
      const hasError = stepResult.issues.some(issue => issue.severity === "error");
      const hasFailed = stepResult.checks.some((check: ISurveyTestCheckResult) => !check.passed);
      stepResult.status = hasError ? "error" : (hasFailed ? "failed" : "passed");
      // What the step produced is announced before the step itself ends, so a host renders the checks
      // and the issues of a step while it is still the current one.
      await execution.flush(testIndex);
      await execution.emitCompleted({ type: "stepCompleted", testIndex: testIndex, stepIndex: i, result: stepResult });
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
  private async runStep(context: SurveyTestContext, step: ISurveyTestStep, stepResult: ISurveyTestStepResult,
    testIndex: number, execution: SurveyTestExecution): Promise<void> {
    const commandName = this.getStepCommandName(step);
    stepResult.command = commandName;
    context.startCommand(commandName);
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
    // Targets run in key order, one after the other: a case that sets two values relies on the order it
    // wrote them in, and an asynchronous handler does not let the next one start early.
    const targetNames = Object.keys(params);
    for (let i = 0; i < targetNames.length; i++) {
      // Before each target: the one before it finished and nothing of this one has run.
      execution.throwIfCanceled();
      const targetName = targetNames[i];
      await execution.emit({
        type: "targetStarted", testIndex: testIndex, stepIndex: stepResult.index,
        command: commandName, target: targetName,
      });
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
      await command.run(context, target, payload);
      // The handler returned; the survey may still be finishing what it started. Every command settles
      // here, the ones an integrator registered included, so a check never reads the state of the
      // interaction before it and nothing lands on the model once the run is over.
      await waitForSurvey(context, "the \"" + commandName + "\" command");
      await execution.flush(testIndex);
      // A target that ends the step with an error has no targetCompleted: the error travels past this
      // level, and the stepCompleted that follows carries it. A target whose handler did run is
      // completed even when the run was stopped meanwhile - the stop is noticed on the next line.
      await execution.emitCompleted({
        type: "targetCompleted", testIndex: testIndex, stepIndex: stepResult.index,
        command: commandName, target: targetName,
      });
      // After the handler: it ran to its end, and a run stopped meanwhile goes no further.
      execution.throwIfCanceled();
    }
  }
  // The last drain of a test: what an issue raised outside a step produced, and what a step that ended
  // the test left behind. An observer that fails here is reported like any other failure of its own.
  private async flushIssues(result: ISurveyTestResult, testIndex: number,
    execution: SurveyTestExecution): Promise<void> {
    try {
      await execution.flush(testIndex);
    } catch(e) {
      result.issues.push(this.toIssue(e));
      result.status = "error";
    }
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
      const names = survey.pages.map(item => item.name);
      const closest = getClosestName(pageName, names);
      throw createCaseError(SurveyTestIssueCodes.unknownStartPage,
        "The start refers to the page \"" + pageName + "\", but the survey has no page with this name.",
        { data: { startPage: pageName, pages: names },
          suggestion: !!closest ? "Did you mean \"" + closest + "\"?" : undefined });
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
        const names = this.getStartNames();
        const closest = getClosestName(start, names);
        throw createCaseError(SurveyTestIssueCodes.unknownStartReference,
          "The test refers to the start \"" + start + "\", but \"starts\" contains no entry with this name.",
          { data: { name: start, starts: names },
            suggestion: !!closest ? "Did you mean \"" + closest + "\"?" : undefined });
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
  private getStartNames(): Array<string> {
    const starts = !!this.tests ? this.tests.starts : undefined;
    if (!Array.isArray(starts)) return [];
    return starts.filter(start => !!start && typeof start.name === "string").map(start => start.name);
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
    const survey = this.surveyJson;
    if (survey instanceof SurveyModel) return undefined;
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
  private createCanceledResult(test: ISurveyTest): ISurveyTestResult {
    const result = this.createTestResult(test);
    result.status = "canceled";
    return result;
  }
  // A SurveyModel is not silently serialised into a definition: the model that would run is not the one
  // handed in, so a case that relies on its handlers or its state would pass for the wrong reason.
  private createDefinitionIssue(): ISurveyTestIssue {
    if (this.surveyJson instanceof SurveyModel) {
      return {
        severity: "error",
        code: SurveyTestIssueCodes.surveyJsonExpected,
        message: "The runner takes the survey JSON, not a SurveyModel: it creates a model of its own for every test, " +
          "so the event handlers, the callbacks and the state of this one would be lost. Pass the survey JSON, and " +
          "use the \"createSurvey\" execution option to configure the model the runner creates.",
      };
    }
    return {
      severity: "error",
      code: SurveyTestIssueCodes.surveyMissing,
      message: "A survey definition is required to run a test suite. Pass the survey JSON to the runner.",
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
      if (test.status === "canceled") summary.canceled++;
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
    return { total: 0, passed: 0, failed: 0, errored: 0, skipped: 0, canceled: 0, checks: 0, failedChecks: 0, warnings: 0 };
  }
  private cloneJson(obj: any): any {
    return obj === undefined ? obj : JSON.parse(JSON.stringify(obj));
  }
  private isObject(val: any): boolean {
    return !!val && typeof val === "object" && !Array.isArray(val);
  }
}
