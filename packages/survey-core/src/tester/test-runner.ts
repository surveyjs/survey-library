import { SurveyModel } from "../survey";
import { ISurveyTest, ISurveyTestOptions, ISurveyTests, ISurveyTestStart, ISurveyTestStep } from "./test-json";
import { getSurveyTestStepCommandNames } from "./test-authoring";
import {
  ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, ISurveyTestStepResult,
  ISurveyTestSummary, SurveyTestIssueCodes, SurveyTestStatus,
} from "./test-result";
import { SurveyTestValidator } from "./test-validator";
import { waitForSurvey } from "./test-async";
import { getClosestName } from "./test-diagnostics";
import { SurveyTestContext } from "./test-context";
import { SurveyTestStubs } from "./test-stubs";
import { createCaseError, SurveyTestCaseError } from "./test-error";
import { ISurveyTestTarget } from "./test-targets";
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

// Everything a suite run decides before it announces anything: whether it can run at all, what the
// structural validation found and which suite entries this run holds. It is resolved first because
// runStarted describes the run that is about to happen, and a host must not have to execute the
// selection filter a second time to learn it.
interface ISurveyTestRunPlan {
  definition: any;
  // The original suite indexes this run holds, in suite order. Empty when nothing can run.
  testIndexes: Array<number>;
  // Everything the validator found, test-level issues included.
  issues: Array<ISurveyTestIssue>;
  // What the validator found outside a test: the shape of the suite itself.
  suiteIssues: Array<ISurveyTestIssue>;
  // The suite cannot run at all: no definition, or a structural error in the suite object. Filtering
  // never repairs this - a malformed root shape is not made runnable by leaving out the node that
  // demonstrates it.
  blockingIssue?: ISurveyTestIssue;
  // The selection filter threw. Nothing is selected and nothing runs after it.
  filterIssue?: ISurveyTestIssue;
}

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
      const issue = this.setCasePath(this.createDefinitionIssue(), SINGLE_TEST_PATH);
      result.issues.push(issue);
      execution.notifyIssue(issue, -1);
      await this.flushIssues(result, undefined, execution);
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
    // Resolved before the first event: runStarted says how many results this run is going to produce
    // and which suite entries they belong to, and neither can be known without the selection.
    const plan = this.createRunPlan(execution);
    try {
      await execution.emit({
        type: "runStarted", tests: suite,
        plannedTestCount: plan.testIndexes.length,
        plannedTestIndexes: plan.testIndexes.slice(),
      });
      await this.runSuite(result, plan, execution);
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
  // The structural validation of the whole suite always runs, whatever this run holds: a malformed
  // suite is malformed for every subset of it. The selection decides which entries are executed and
  // nothing else, and it is never applied by rewriting the suite the caller handed in.
  private createRunPlan(execution: SurveyTestExecution): ISurveyTestRunPlan {
    const suite: any = this.tests;
    const plan: ISurveyTestRunPlan = {
      definition: this.getDefinition(), testIndexes: [], issues: [], suiteIssues: [],
    };
    if (!plan.definition) {
      plan.blockingIssue = this.createDefinitionIssue();
      return plan;
    }
    plan.issues = this.validator.validate(suite);
    plan.suiteIssues = plan.issues.filter(issue => !this.getTestIndex(issue.path));
    const broken = plan.suiteIssues.filter(issue => issue.severity === "error");
    if (broken.length > 0) {
      plan.blockingIssue = broken[0];
      return plan;
    }
    const tests = suite.tests;
    try {
      for (let i = 0; i < tests.length; i++) {
        if (execution.isTestSelected(tests[i], i)) plan.testIndexes.push(i);
      }
    } catch(e) {
      // A filter that throws is a bug in the host, not a broken case: it is reported once, where the
      // suite reports its own failures, and the selection stops there. Nothing runs on a selection
      // that is only half decided.
      plan.testIndexes = [];
      plan.filterIssue = this.toFilterIssue(e);
    }
    return plan;
  }
  private async runSuite(result: ISurveyTestsResult, plan: ISurveyTestRunPlan,
    execution: SurveyTestExecution): Promise<void> {
    if (!!plan.blockingIssue) {
      // The suite is broken and no test runs, so what the validator found inside the tests is reported
      // at the suite level: it is the only place left that can carry it. A missing definition has
      // nothing else to report.
      const issues = plan.issues.length > 0 ? plan.issues : [plan.blockingIssue];
      result.issues = issues;
      await this.announceIssues(issues, undefined, execution);
      return;
    }
    result.issues = plan.suiteIssues.slice();
    await this.announceIssues(plan.suiteIssues, undefined, execution);
    if (!!plan.filterIssue) {
      result.issues.push(plan.filterIssue);
      await this.announceIssues([plan.filterIssue], undefined, execution);
      return;
    }
    const tests: Array<ISurveyTest> = this.tests.tests;
    for (let i = 0; i < plan.testIndexes.length; i++) {
      // Before each test: a test the run never reached produces no result and no event pair.
      execution.throwIfCanceled();
      const testIndex = plan.testIndexes[i];
      // Only what belongs to a selected test is published: a test outside this run reports nothing,
      // not even what the validator found in it. The index is the original one, so an issue path, an
      // event and the suite document keep addressing the same node.
      const testIssues = plan.issues.filter(issue => this.getTestIndex(issue.path) === TEST_PATH_PREFIX + testIndex + "]");
      result.tests.push(await this.runTestCore(tests[testIndex], testIndex, plan.definition, testIssues, execution));
    }
  }
  private async runTestCore(test: ISurveyTest, testIndex: number, definition: any,
    testIssues: Array<ISurveyTestIssue>, execution: SurveyTestExecution): Promise<ISurveyTestResult> {
    const result = this.createTestResult(test);
    const testPath = this.getTestPath(testIndex);
    testIssues.forEach(issue => result.issues.push(issue));
    // Both callers stop before a canceled test is entered, so testStarted is always announced here and
    // whatever is caught below was raised after the host heard it.
    try {
      await execution.emit({ type: "testStarted", testIndex: testIndex, test: test });
      // What the validator found for this test is announced inside the test that carries it: a host
      // hears testStarted, then why this case is broken, and only then testCompleted.
      await this.announceIssues(testIssues, testIndex, execution);
      await this.runTestBody(test, testIndex, definition, result, execution);
    } catch(e) {
      // Only an observer can throw here: runTestBody turns every failure of its own into an issue. The
      // issue is not announced - the observer that would hear about it is the one that just failed.
      // The testCompleted below is still emitted: a host that heard testStarted hears the matching
      // testCompleted, whether the test ended on its own, on cancellation or on the host's own failure.
      if (execution.isCancellation(e)) {
        result.status = "canceled";
      } else {
        result.issues.push(this.toIssue(e, testPath));
        result.status = "error";
      }
    }
    // The test that was running when the caller stopped the run is completed as canceled: a host that
    // heard testStarted hears the matching testCompleted whatever ended the test.
    try {
      await execution.emitCompleted({ type: "testCompleted", testIndex: testIndex, result: result });
    } catch(e) {
      result.issues.push(this.toIssue(e, testPath));
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
    // Every issue this test produces - inside a step or outside one - is addressed from here, so a
    // downloaded result says where each of them belongs without an event transcript to rebuild it from.
    context.setCasePath(this.getTestPath(testIndex));
    if (execution.isObserved) {
      context.setNotifier(execution);
    }
    // A handler of the case cooperates with a stopped run through the context and nothing else.
    context.setSignal(execution.signal);
    // Before the model exists: a stub replaces the body of a function, but whether an expression is
    // asynchronous at all is decided when that expression is parsed, so the names have to be in place
    // before the JSON is loaded.
    context.setStubs(new SurveyTestStubs(this.resolveFunctions(test), this.resolveWeb(test),
      execution.functionHandlers, execution.webHandler));
    let canceled = false;
    try {
      const start = this.resolveStart(test, result);
      context.stubs.install();
      const survey = await this.createSurveyModel(context, test, testIndex, definition, execution);
      context.setupSurvey(survey);
      context.checkReservedTargetName();
      this.reportUnknownFunctions(context, survey);
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
        // Before the issue is announced: the object the observer hears is the object the result holds,
        // and it carries its path in both places.
        context.enrichIssue(issue);
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
      attachProviders: (survey: SurveyModel): void => { context.attachProviders(survey); },
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
      // After the completion callback of the step: a run stopped while the host was holding it is
      // noticed here and not on the next iteration, so the last step of a test is a boundary like every
      // other one. The step keeps what it reported and the test the caller stopped is canceled - what
      // this step found is in its own result, and the test did not end on its own.
      execution.throwIfCanceled();
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
  // A structural or a suite-level issue is recorded before anything runs, outside a handler, so no
  // operation boundary drains it on its own. It is announced where it is found: every error and every
  // warning reaches the observer through issueAdded, and a host never has to read some of them out of
  // the result instead. An observer that fails here is reported by the caller, like any other failure
  // of its own at that level.
  private async announceIssues(issues: Array<ISurveyTestIssue>, testIndex: number,
    execution: SurveyTestExecution): Promise<void> {
    if (!execution.isObserved || issues.length === 0) return;
    // Outside a step: the JSON path of the issue says where in the case it belongs.
    issues.forEach(issue => execution.notifyIssue(issue, -1));
    await execution.flush(testIndex);
  }
  // The last drain of a test: what an issue raised outside a step produced, and what a step that ended
  // the test left behind. An observer that fails here is reported like any other failure of its own.
  private async flushIssues(result: ISurveyTestResult, testIndex: number,
    execution: SurveyTestExecution): Promise<void> {
    try {
      await execution.flush(testIndex);
    } catch(e) {
      result.issues.push(this.toIssue(e, this.getTestPath(testIndex)));
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
    const commands = getSurveyTestStepCommandNames(step);
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
  // Merged per name and per url, exactly like the variables below: a test that overrides one entry
  // keeps the rest of the suite's.
  private resolveFunctions(test: ISurveyTest): { [name: string]: any } {
    const res: { [name: string]: any } = Object.create(null);
    this.copyByPresence(res, !!this.tests ? this.tests.functions : undefined);
    this.copyByPresence(res, !!test ? test.functions : undefined);
    return res;
  }
  private resolveWeb(test: ISurveyTest): { [url: string]: any } {
    const res: { [url: string]: any } = Object.create(null);
    this.copyByPresence(res, !!this.tests ? this.tests.web : undefined);
    this.copyByPresence(res, !!test ? test.web : undefined);
    return res;
  }
  // A function nobody registered and no stub declares answers null, and everything that reads it - a
  // visibleIf, a calculated value, the value of an expression question - is then wrong for a reason
  // that is nowhere in the result. survey-core writes it to the console, which no downloaded result
  // holds, so the case is told once, at the start, naming what it has to declare.
  private reportUnknownFunctions(context: SurveyTestContext, survey: SurveyModel): void {
    const found = survey.validateExpressions({ functions: true, variables: false, semantics: false });
    const names: Array<string> = [];
    found.forEach(item => {
      item.errors.forEach(error => {
        const name = (<any>error).functionName;
        if (!!name && names.indexOf(name) < 0) names.push(name);
      });
    });
    if (names.length === 0) return;
    context.addWarning(SurveyTestIssueCodes.unknownFunctionCalled,
      "The survey calls " + (names.length === 1 ? "a function that is" : "functions that are") +
      " neither registered in this process nor declared by the case: " + names.join(", ") +
      ". Every expression that calls " + (names.length === 1 ? "it" : "them") + " receives null. " +
      "Declare " + (names.length === 1 ? "it" : "them") + " in the \"functions\" section of the suite.",
      { names: names });
  }
  // Merged per variable name: a test that overrides one root variable keeps the others. A test can
  // override a root variable but cannot remove one - null sets it to null, it does not unset it.
  private resolveVariables(test: ISurveyTest): { [name: string]: any } {
    const res: { [name: string]: any } = Object.create(null);
    this.copyByPresence(res, !!this.tests ? this.tests.variables : undefined);
    this.copyByPresence(res, !!test ? test.variables : undefined);
    return res;
  }
  // Cloned and not aliased, for the same reason cloneStart clones the start data: a suite entry is
  // shared by every test of the run and it belongs to the caller, so a value one test mutates must
  // not reach the next one - or the document the caller passed in. Only plain objects and arrays go
  // through the JSON clone; a Date or an instance of a class is copied as it is.
  private copyByPresence(dest: any, source: any): void {
    if (!this.isObject(source)) return;
    Object.keys(source).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        dest[key] = this.cloneValue(source[key]);
      }
    });
  }
  private cloneValue(val: any): any {
    const isPlain = Array.isArray(val) || (!!val && typeof val === "object" && val.constructor === Object);
    return isPlain ? this.cloneJson(val) : val;
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
  // An unexpected exception from survey-core never reaches the caller: it becomes a case error. The
  // path is the node of the case document the issue belongs to, when the caller knows it.
  private toIssue(error: any, casePath?: string): ISurveyTestIssue {
    if (error instanceof SurveyTestCaseError) return this.setCasePath(error.issue, casePath);
    const message = !!error && !!error.message ? error.message : String(error);
    return this.setCasePath({
      severity: "error",
      code: SurveyTestIssueCodes.unexpectedError,
      message: "The survey threw an unexpected error: " + message,
    }, casePath);
  }
  // A suite run addresses a test by its index, a runTest() by the word "test": the entry point decides
  // the root of the path, and everything below it is the same grammar.
  private getTestPath(testIndex: number): string {
    return testIndex === undefined ? SINGLE_TEST_PATH : TEST_PATH_PREFIX + testIndex + "]";
  }
  // Validation and the handlers know more about where an issue belongs than the level that stores it,
  // so a path that is already there wins.
  private setCasePath(issue: ISurveyTestIssue, path: string): ISurveyTestIssue {
    if (!!issue && !!path && issue.path === undefined) issue.path = path;
    return issue;
  }
  // What the host threw while it was deciding which tests to run. It is not a fault of any case, so it
  // belongs to no test: the suite carries it, like every other failure that happens outside one.
  private toFilterIssue(error: any): ISurveyTestIssue {
    if (error instanceof SurveyTestCaseError) return error.issue;
    const message = !!error && !!error.message ? error.message : String(error);
    return {
      severity: "error",
      code: SurveyTestIssueCodes.unexpectedError,
      message: "The function that selects the tests of this run failed: " + message,
      data: { error: message },
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
