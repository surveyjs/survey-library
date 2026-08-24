import type { ISurveyDateProvider } from "../helpers";
import { SurveyModel } from "../survey";
import { ISurveyTest, ISurveyTestOptions, ISurveyTests, ISurveyTestStep } from "./test-json";
import {
  ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, ISurveyTestStepResult,
} from "./test-result";

// How a run is executed, as opposed to what it runs. Nothing here belongs to ISurveyTestOptions: those
// options are the serialisable test format, and neither a model factory nor an observer can be written
// in JSON. A headless caller passes none of this and gets exactly the behaviour it always had.

export interface ISurveyTestModelFactoryContext {
  test: ISurveyTest;
  // The index of the test in the suite. Undefined for runTest(): a single test has no index.
  testIndex?: number;
  // The options of this test, after the suite and the root options are merged into them.
  options: ISurveyTestOptions;
  // The clock of this test, pinned to its "now" option. Assign it to the model before the JSON is
  // loaded - survey.dateProvider = context.dateProvider, then survey.fromJSON(surveyJson) - and the
  // expressions that run while the model is being built are pinned as well. A factory that skips it
  // loses the clock for constructor-time evaluation only: the tester assigns it to the model it gets
  // back, so everything the case does afterwards is pinned whatever the factory did.
  dateProvider: ISurveyDateProvider;
}

// Called once per enabled, structurally runnable test, with a deep clone of the survey JSON that
// belongs to that test alone. It must return a new SurveyModel every time.
export type SurveyTestModelFactory =
  (surveyJson: any, context: ISurveyTestModelFactoryContext) => SurveyModel | Promise<SurveyModel>;

// Which entries of the suite this run holds. It is execution infrastructure and not part of the case:
// a suite is not rewritten, copied or re-flagged to run a part of it, and what the filter leaves out is
// not "disabled by the author" - it is simply not in this run.
export type SurveyTestFilter = (test: ISurveyTest, testIndex: number) => boolean;

export type SurveyTestExecutionEventType =
  "runStarted" | "runCompleted" | "surveyCreated" | "testStarted" | "testCompleted" |
  "stepStarted" | "stepCompleted" | "targetStarted" | "targetCompleted" | "checkCompleted" | "issueAdded";

// Every event carries what applies to it and nothing else. A host that needs the whole picture keeps
// what the earlier events gave it; an event never repeats a field to save it that work.

export interface ISurveyTestRunStartedEvent {
  type: "runStarted";
  tests: ISurveyTests;
  // What this run is going to do, so that a host initialises its progress from the event instead of
  // running the filter a second time or guessing what the runner selected. Both describe the same set:
  // plannedTestCount is plannedTestIndexes.length, and the indexes are the original suite indexes, in
  // suite order. A selected test that is disabled or structurally broken is counted - it still produces
  // a result. A test the filter rejected is not, and a suite that cannot run at all plans nothing.
  // summary.total may end up lower than this: a stopped run holds fewer results than it planned.
  plannedTestCount: number;
  plannedTestIndexes: Array<number>;
}
export interface ISurveyTestRunCompletedEvent {
  type: "runCompleted";
  result: ISurveyTestsResult;
}
export interface ISurveyTestTestStartedEvent {
  type: "testStarted";
  testIndex?: number;
  test: ISurveyTest;
}
export interface ISurveyTestSurveyCreatedEvent {
  type: "surveyCreated";
  testIndex?: number;
  test: ISurveyTest;
  // The model the commands of this test run on, configured and subscribed to, before the variables and
  // the start state are applied.
  survey: SurveyModel;
}
export interface ISurveyTestTestCompletedEvent {
  type: "testCompleted";
  testIndex?: number;
  result: ISurveyTestResult;
}
export interface ISurveyTestStepStartedEvent {
  type: "stepStarted";
  testIndex?: number;
  stepIndex: number;
  step: ISurveyTestStep;
}
export interface ISurveyTestStepCompletedEvent {
  type: "stepCompleted";
  testIndex?: number;
  stepIndex: number;
  // Carries the command name, the status, the checks and the issues of the step.
  result: ISurveyTestStepResult;
}
export interface ISurveyTestTargetStartedEvent {
  type: "targetStarted";
  testIndex?: number;
  stepIndex: number;
  command: string;
  target: string;
}
export interface ISurveyTestTargetCompletedEvent {
  type: "targetCompleted";
  testIndex?: number;
  stepIndex: number;
  command: string;
  target: string;
}
export interface ISurveyTestCheckCompletedEvent {
  type: "checkCompleted";
  testIndex?: number;
  stepIndex: number;
  result: ISurveyTestCheckResult;
}
export interface ISurveyTestIssueAddedEvent {
  type: "issueAdded";
  testIndex?: number;
  // Undefined for an issue raised outside a step.
  stepIndex?: number;
  issue: ISurveyTestIssue;
}

export type SurveyTestExecutionEvent =
  ISurveyTestRunStartedEvent | ISurveyTestRunCompletedEvent |
  ISurveyTestTestStartedEvent | ISurveyTestSurveyCreatedEvent | ISurveyTestTestCompletedEvent |
  ISurveyTestStepStartedEvent | ISurveyTestStepCompletedEvent |
  ISurveyTestTargetStartedEvent | ISurveyTestTargetCompletedEvent |
  ISurveyTestCheckCompletedEvent | ISurveyTestIssueAddedEvent;

// The runner awaits it before it continues. This is the whole mechanism a host has to delay, animate,
// scroll or render between two actions: the tester itself never waits for anything.
export type SurveyTestExecutionObserver = (event: SurveyTestExecutionEvent) => void | Promise<void>;

export interface ISurveyTestExecutionOptions {
  createSurvey?: SurveyTestModelFactory;
  // Selects the suite entries this run holds. It is called once per entry, in suite order, with the
  // original test object and its original index, before anything is announced. Omitted, every entry
  // runs. A test it leaves out produces no result, no events and no issues, and it is counted nowhere
  // in the summary. The index is what a host selects by: test names are not required to be unique, so
  // they are not an identity. runTest() selects one test by definition and never consults it.
  testFilter?: SurveyTestFilter;
  onEvent?: SurveyTestExecutionObserver;
  // Stops the run at the next safe boundary. The tester cannot terminate a promise it is waiting for,
  // so what is already running finishes; nothing after it starts.
  signal?: AbortSignal;
}

// The one control-flow exception cancellation raises. It never reaches the caller and it never becomes
// an issue: the runner unwinds on it and reports the canceled status instead.
export class SurveyTestCanceledError extends Error {
  constructor() {
    super("The test run was canceled.");
    Object.setPrototypeOf(this, SurveyTestCanceledError.prototype);
    this.name = "SurveyTestCanceledError";
  }
}

// Two steps instead of new SurveyModel(json): the clock has to be on the model before the JSON is
// loaded, because a defaultValueExpression or a calculated value that calls today() runs while the
// model is being built, and there is no moment between the two in a single constructor call.
function createDefaultSurvey(surveyJson: any, context: ISurveyTestModelFactoryContext): SurveyModel {
  const survey = new SurveyModel();
  survey.dateProvider = context.dateProvider;
  survey.fromJSON(surveyJson);
  return survey;
}

// A check result and an issue are produced inside a handler, and a handler is not a place that can
// await an observer. They are queued as they are produced and the runner drains the queue at the
// boundary of the operation that produced them, in order.
interface ISurveyTestPendingNotification {
  stepIndex: number;
  check?: ISurveyTestCheckResult;
  issue?: ISurveyTestIssue;
}

// The runtime state of one run(): the observer, the model factory and the models already handed out.
// It is created per call, so two runs never share anything.
export class SurveyTestExecution {
  private observer: SurveyTestExecutionObserver;
  private factory: SurveyTestModelFactory;
  private abortSignal: AbortSignal;
  private testFilter: SurveyTestFilter;
  private pending: Array<ISurveyTestPendingNotification> = [];
  // Weak on purpose: the models are held only to tell a reused one from a new one, and a suite of a
  // thousand tests must not keep a thousand surveys, their data and their handlers alive for it.
  private models: WeakSet<SurveyModel> = new WeakSet<SurveyModel>();
  constructor(options?: ISurveyTestExecutionOptions) {
    this.observer = !!options ? options.onEvent : undefined;
    this.factory = !!options && !!options.createSurvey ? options.createSurvey : createDefaultSurvey;
    this.abortSignal = !!options ? options.signal : undefined;
    this.testFilter = !!options ? options.testFilter : undefined;
  }
  // The test object and the index are the ones the suite holds: the filter is host code, and it is
  // never handed a copy it could believe it is allowed to change. What it throws travels out of here
  // untouched - the runner reports it once, at the suite level. The result is read as a boolean:
  // anything falsy leaves the test out of this run.
  public isTestSelected(test: ISurveyTest, testIndex: number): boolean {
    if (!this.testFilter) return true;
    return !!this.testFilter(test, testIndex);
  }
  public get isObserved(): boolean {
    return !!this.observer;
  }
  public get signal(): AbortSignal {
    return this.abortSignal;
  }
  public get isCanceled(): boolean {
    return !!this.abortSignal && this.abortSignal.aborted;
  }
  public throwIfCanceled(): void {
    if (this.isCanceled) throw new SurveyTestCanceledError();
  }
  // A handler that observes the signal may reject with an abort error of its own the moment the run is
  // stopped. Whatever it threw, the caller stopped the run: the outcome is cancellation, and adding an
  // issue for it would report the user's own decision as a broken case.
  public isCancellation(error: any): boolean {
    return error instanceof SurveyTestCanceledError || this.isCanceled;
  }
  public createSurvey(surveyJson: any, context: ISurveyTestModelFactoryContext): SurveyModel | Promise<SurveyModel> {
    return this.factory(surveyJson, context);
  }
  public isModelUsed(survey: SurveyModel): boolean {
    return this.models.has(survey);
  }
  public addModel(survey: SurveyModel): void {
    this.models.add(survey);
  }
  // ISurveyTestNotifier: the context calls these while a handler runs.
  public notifyCheckResult(result: ISurveyTestCheckResult, stepIndex: number): void {
    if (!this.observer) return;
    this.pending.push({ stepIndex: stepIndex, check: result });
  }
  public notifyIssue(issue: ISurveyTestIssue, stepIndex: number): void {
    if (!this.observer) return;
    this.pending.push({ stepIndex: stepIndex, issue: issue });
  }
  // Announces an operation that is about to start or has just produced something, and is a cancellation
  // boundary on both sides of the callback: nothing after it starts if the run was stopped while the
  // host was holding it.
  public async emit(event: SurveyTestExecutionEvent): Promise<void> {
    this.throwIfCanceled();
    await this.emitCore(event);
    this.throwIfCanceled();
  }
  // Announces that something the host already heard about has ended. It is emitted after cancellation
  // on purpose: a host that heard stepStarted hears the matching stepCompleted, canceled or not.
  public emitCompleted(event: SurveyTestExecutionEvent): Promise<void> {
    return this.emitCore(event);
  }
  // The queue is emptied before the first event is emitted: an observer that fails drops what is left
  // instead of leaking it into the next step. What a handler already produced is announced whatever
  // the signal says - the results exist and they are on the step result already.
  public async flush(testIndex: number): Promise<void> {
    const items = this.pending;
    if (items.length === 0) return;
    this.pending = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!!item.check) {
        await this.emitCore({ type: "checkCompleted", testIndex: testIndex, stepIndex: item.stepIndex, result: item.check });
      } else {
        const event: ISurveyTestIssueAddedEvent = { type: "issueAdded", testIndex: testIndex, issue: item.issue };
        if (item.stepIndex >= 0) event.stepIndex = item.stepIndex;
        await this.emitCore(event);
      }
    }
  }
  private async emitCore(event: SurveyTestExecutionEvent): Promise<void> {
    if (!this.observer) return;
    await this.observer(event);
  }
}
