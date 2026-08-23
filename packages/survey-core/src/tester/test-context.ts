import type { ISurveyDateProvider } from "../helpers";
import { SurveyModel } from "../survey";
import { SurveyTestDiagnostics } from "./test-diagnostics";
import { ISurveyTest, ISurveyTestOptions, RESERVED_TARGET_SURVEY } from "./test-json";
import { ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestStepResult, SurveyTestIssueCodes, SurveyTestSeverity } from "./test-result";
import { createCaseError } from "./test-error";
import { ISurveyTestTarget, SurveyTestTargetKind, SurveyTestTargetResolver } from "./test-targets";

// The target grammar - the path a case writes, in both directions - lives in test-targets.ts. It is
// re-exported here because the context is what a command and a check handler are written against, and
// so is the case error: a handler that refuses an interaction raises one.
export type { ISurveyTestTarget, SurveyTestTargetKind } from "./test-targets";
export { createCaseError, SurveyTestCaseError } from "./test-error";

// What the runner does with a check result or an issue the moment a handler produces it. The context
// knows nothing about the execution options: it reports, and the runner decides whether anyone listens.
export interface ISurveyTestNotifier {
  notifyCheckResult(result: ISurveyTestCheckResult, stepIndex: number): void;
  // stepIndex is -1 for an issue raised outside a step.
  notifyIssue(issue: ISurveyTestIssue, stepIndex: number): void;
}

export interface ISurveyTestContext {
  readonly survey: SurveyModel;
  readonly options: ISurveyTestOptions;
  readonly test: ISurveyTest;
  // The index of the step being executed; -1 outside a step.
  readonly stepIndex: number;
  // Set when the caller passed one. An asynchronous handler that takes long enough to be worth
  // stopping should watch it and return early: the tester checks it again the moment the handler
  // returns, and it cannot terminate a promise on its own.
  readonly signal?: AbortSignal;
  // Throws SurveyTestCaseError when the name resolves to nothing.
  resolveTarget(name: string): ISurveyTestTarget;
  addIssue(issue: ISurveyTestIssue): void;
  addWarning(code: string, message: string, data?: any): void;
  // Appended to the checks of the current step.
  addCheckResult(result: ISurveyTestCheckResult): void;
}

export const DEFAULT_TEST_NOW = "2024-01-01T00:00:00";
export const DEFAULT_TEST_RANDOM_SEED = 1;

// The clock of one test, and of nothing else. It is handed to the model of that test and it is read
// only by the expressions of that model: nothing global is installed, so a run that waits for a UI
// callback or for an asynchronous command leaves the date of every other survey in the process alone,
// and two runs pinned to two different moments can be interleaved freely.
export class SurveyTestDateProvider implements ISurveyDateProvider {
  private time: number;
  constructor(nowStr?: string) {
    let time = Date.parse(!!nowStr ? nowStr : DEFAULT_TEST_NOW);
    // An unparsable "now" falls back to the default: pinning the machine clock instead would make the
    // whole run non-reproducible, which is the one thing this provider exists to prevent.
    if (isNaN(time)) time = Date.parse(DEFAULT_TEST_NOW);
    this.time = time;
  }
  public now(): number {
    return this.time;
  }
}

export class SurveyTestContext implements ISurveyTestContext {
  private surveyValue: SurveyModel;
  private resolver: SurveyTestTargetResolver;
  private targetCache: { [path: string]: ISurveyTestTarget } = {};
  private dateProviderValue: SurveyTestDateProvider;
  private currentStep: ISurveyTestStepResult;
  private resetCacheFunc: () => void;
  private diagnostics: SurveyTestDiagnostics = new SurveyTestDiagnostics(this);
  // A target resolved to explain a failure must not report an ambiguity the case already heard about.
  private isResolvingQuietly: boolean = false;
  private notifier: ISurveyTestNotifier;
  private signalValue: AbortSignal;
  // The path of the test node inside the case document: "tests[3]" in a suite run, "test" in
  // runTest(). Every issue this context records is addressed from it.
  private casePathValue: string = "";

  // testIssues is the issues array of the test result: issues raised outside a step land there.
  constructor(public readonly options: ISurveyTestOptions,
    public readonly test: ISurveyTest, private testIssues: Array<ISurveyTestIssue>) {
    this.dateProviderValue = new SurveyTestDateProvider(options.now);
  }
  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  // Created before the model is: the model of this test is built with it, so a defaultValueExpression
  // that calls today() is already pinned while the survey is being built.
  public get dateProvider(): ISurveyDateProvider {
    return this.dateProviderValue;
  }
  public get stepIndex(): number {
    return !!this.currentStep ? this.currentStep.index : -1;
  }
  public get signal(): AbortSignal {
    return this.signalValue;
  }
  public setNotifier(notifier: ISurveyTestNotifier): void {
    this.notifier = notifier;
  }
  public setSignal(signal: AbortSignal): void {
    this.signalValue = signal;
  }
  public setCasePath(path: string): void {
    this.casePathValue = path;
  }
  // Where in the case document an issue raised right now belongs: the step that is running, or the
  // test itself when nothing is.
  public get casePath(): string {
    const path = this.casePathValue;
    if (!path) return undefined;
    return !!this.currentStep ? path + ".steps[" + this.currentStep.index + "]" : path;
  }
  // The configuration the tester owns whatever the factory did, and the subscriptions the tester needs.
  // Nothing here is left to the factory: an application configures runtime behaviour, not what makes a
  // run reproducible.
  public setupSurvey(survey: SurveyModel): void {
    this.surveyValue = survey;
    // The ambiguity of a plain name is a warning of the case, so the grammar reports it here instead of
    // deciding anything about it.
    this.resolver = new SurveyTestTargetResolver(survey, (name, kinds) => {
      if (this.isResolvingQuietly) return;
      this.addWarning(SurveyTestIssueCodes.ambiguousTarget,
        "The survey contains several elements named \"" + name + "\": " + kinds.join(", ") +
        ". The test uses the " + kinds[0] + ".",
        { name: name, kinds: kinds });
    });
    const options = this.options;
    // The factory receives the clock and the default one builds the model with it. A factory that
    // ignored it - or that returned a model built from a JSON of its own - still runs the rest of the
    // case pinned: only the expressions that ran inside its constructor read the machine clock.
    survey.dateProvider = this.dateProviderValue;
    if (options.locale !== undefined) survey.locale = options.locale;
    if (options.clearInvisibleValues !== undefined) survey.clearInvisibleValues = options.clearInvisibleValues;
    if (options.checkErrorsMode !== undefined) survey.checkErrorsMode = options.checkErrorsMode;
    survey.randomSeed = options.randomSeed !== undefined ? options.randomSeed : DEFAULT_TEST_RANDOM_SEED;
    this.subscribeToModelChanges();
    this.diagnostics.attach();
  }
  // Nothing global is restored here because nothing global was installed. The clock stays on the model
  // it belongs to: the model dies with the test, and a host that keeps rendering it after the run keeps
  // seeing the dates the case ran with.
  public teardown(): void {
    this.diagnostics.detach();
    this.unsubscribeFromModelChanges();
    this.targetCache = {};
    this.resolver = undefined;
    this.currentStep = undefined;
  }
  public setCurrentStep(step: ISurveyTestStepResult): void {
    this.currentStep = step;
  }
  // Called by the runner once the command of the step is known: a command starts a new action, and the
  // triggers and the blocked navigation of the previous one stop explaining what happens after it.
  public startCommand(commandName: string): void {
    this.diagnostics.startCommand(commandName);
  }
  // "survey" means the survey itself and nothing else. An element carrying that name would make every
  // case that uses it mean two things, so the test does not run at all.
  public checkReservedTargetName(): void {
    const survey = this.survey;
    const name = RESERVED_TARGET_SURVEY;
    let kind = "";
    if (!!survey.getQuestionByName(name)) kind = "question";
    else if (!!survey.getPanelByName(name)) kind = "panel";
    else if (!!survey.getPageByName(name)) kind = "page";
    if (!kind) return;
    throw createCaseError(SurveyTestIssueCodes.reservedTargetName,
      "The survey contains a " + kind + " named \"" + name + "\", but \"" + name +
      "\" is the reserved target name that means the survey itself. Rename the " + kind + ".",
      { target: name, data: { kind: kind } });
  }
  public resolveTarget(name: string): ISurveyTestTarget {
    const cached = this.targetCache[name];
    if (!!cached) return cached;
    const target = this.resolver.resolve(name);
    if (this.canCache(name)) {
      this.targetCache[name] = target;
    }
    return target;
  }
  // The diagnostics resolve a target that has already been resolved once, to explain a result that
  // names it. A name that resolves to nothing there is not a second case error.
  public resolveTargetSafe(name: string): ISurveyTestTarget {
    if (!name || !this.surveyValue) return undefined;
    this.isResolvingQuietly = true;
    try {
      return this.resolveTarget(name);
    } catch(e) {
      return undefined;
    } finally {
      this.isResolvingQuietly = false;
    }
  }
  public addIssue(issue: ISurveyTestIssue): void {
    this.enrichIssue(issue);
    if (!!this.currentStep) {
      if (issue.step === undefined) issue.step = this.currentStep.index;
      this.currentStep.issues.push(issue);
    } else {
      this.testIssues.push(issue);
    }
    if (!!this.notifier) {
      this.notifier.notifyIssue(issue, this.stepIndex);
    }
  }
  // The runner records the issue a case error carries without going through addIssue, so filling the
  // two paths of an issue - where it belongs in the case, and the node of the survey it names - lives
  // in a method of its own. A path the validator or a handler already set is more specific than
  // anything that can be derived here and it is never overwritten.
  public enrichIssue(issue: ISurveyTestIssue): void {
    if (!issue) return;
    if (issue.path === undefined) {
      const path = this.casePath;
      if (!!path) issue.path = path;
    }
    this.diagnostics.enrichIssue(issue);
  }
  public addWarning(code: string, message: string, data?: any): void {
    const issue: ISurveyTestIssue = { severity: <SurveyTestSeverity>"warning", code: code, message: message };
    if (data !== undefined) issue.data = data;
    // A blocked navigation is recorded, not only reported: the check that asks why the state did not
    // change is written in the next step, and it reads what this step found out.
    if (code === SurveyTestIssueCodes.completeBlocked || code === SurveyTestIssueCodes.nextPageBlocked) {
      this.diagnostics.setBlocked(!!this.currentStep ? this.currentStep.command : "", data);
    }
    this.addIssue(issue);
  }
  public addCheckResult(result: ISurveyTestCheckResult): void {
    if (!!this.currentStep) {
      this.diagnostics.enrichCheckResult(result);
      this.currentStep.checks.push(result);
      if (!!this.notifier) {
        this.notifier.notifyCheckResult(result, this.currentStep.index);
      }
    }
  }
  private subscribeToModelChanges(): void {
    const survey = this.survey;
    this.resetCacheFunc = () => { this.targetCache = {}; };
    survey.onCurrentPageChanged.add(this.resetCacheFunc);
    survey.onDynamicPanelAdded.add(this.resetCacheFunc);
    survey.onDynamicPanelRemoved.add(this.resetCacheFunc);
    survey.onMatrixRowAdded.add(this.resetCacheFunc);
    survey.onMatrixRowRemoved.add(this.resetCacheFunc);
  }
  private unsubscribeFromModelChanges(): void {
    const survey = this.surveyValue;
    if (!survey || !this.resetCacheFunc) return;
    survey.onCurrentPageChanged.remove(this.resetCacheFunc);
    survey.onDynamicPanelAdded.remove(this.resetCacheFunc);
    survey.onDynamicPanelRemoved.remove(this.resetCacheFunc);
    survey.onMatrixRowAdded.remove(this.resetCacheFunc);
    survey.onMatrixRowRemoved.remove(this.resetCacheFunc);
    this.resetCacheFunc = undefined;
  }
  // Only a plain top-level name is cached. A path into a dynamic panel or a matrix resolves to an
  // object the model rebuilds on its own schedule, and handing out a stale question is worse than
  // resolving it again. The cache is dropped on a page change and on a row/panel change anyway.
  private canCache(name: string): boolean {
    return name.indexOf(".") < 0 && name.indexOf("[") < 0;
  }
}
