import { ISurveyTestContext } from "./test-context";
import { createCaseError, SurveyTestCaseError } from "./test-error";
import { ISurveyTestOptions } from "./test-json";
import { SurveyTestIssueCodes } from "./test-result";

// Not every survey operation is finished when the call that started it returns. Server validation, an
// asynchronous validator, an asynchronous expression function and the asynchronous callback of
// onCompleting/onCurrentPageChanging all hand control back while the survey is still deciding, and
// tryComplete()/nextPage() report false in the meantime. A tester that believed that boolean would
// diagnose a survey that is about to navigate as blocked, read the state of the step before in the
// step after, and let the survey complete itself once the run is over. So a command is not finished
// until the model it acted on has settled.

// The budget for one asynchronous survey operation, in milliseconds. It is wall-clock time and it is
// deliberately not the pinned clock of the test: what is bounded here is how long a real handler may
// take, not what the survey believes the date is.
export const DEFAULT_TEST_ASYNC_TIMEOUT = 5000;
// The first re-read is a plain event-loop turn, so an operation that resolves in the same turn costs
// no timer at all. Everything after it polls at this interval.
const ASYNC_POLL_INTERVAL = 5;

export type SurveyTestBusyReason =
  "serverValidation" | "navigationHandler" | "validators" | "expressions" | "webChoices";

export interface ISurveyTestBusyState {
  reason: SurveyTestBusyReason;
  // The questions or the expression owners the survey is still waiting for, when the reason names any.
  names?: Array<string>;
  // The urls of the requests that have not answered yet. Only "webChoices" carries them.
  urls?: Array<string>;
}

export function getAsyncTimeout(options: ISurveyTestOptions): number {
  const val = !!options ? options.asyncTimeout : undefined;
  return typeof val === "number" && isFinite(val) ? val : DEFAULT_TEST_ASYNC_TIMEOUT;
}

// The first reason found, cheapest first. Undefined means the model is settled: everything the last
// interaction started has landed on it.
export function getSurveyBusyState(survey: any): ISurveyTestBusyState {
  if (!survey) return undefined;
  // A handler of onServerValidateQuestions has not called options.complete() yet. The survey navigates
  // or completes from that callback, so nothing about this navigation is decided.
  if (survey.isValidatingOnServer === true) return { reason: "serverValidation" };
  // Set while an onCompleting or an onCurrentPageChanging handler holds the navigation open.
  if (survey.getPropertyValue("isNavigationBlocked") === true) return { reason: "navigationHandler" };
  const questions = getSurveyQuestions(survey);
  const validating = questions.filter((question: any) => question.isRunningValidators === true);
  if (validating.length > 0) return { reason: "validators", names: validating.map(getOwnerName) };
  const running = getExpressionOwners(survey, questions).filter((obj: any) => obj.isAsyncExpressionRunning === true);
  if (running.length > 0) return { reason: "expressions", names: running.map(getOwnerName) };
  // A request that was sent and has not answered. It is deliberately "isRunning" and not "isReady":
  // a question is un-ready from the moment it merely has a url - waitingChoicesByURL is
  // !isChoicesLoaded && hasChoicesUrl - and it stays un-ready for the whole run when nothing will ever
  // send that request, which is what a lazy-loading question with a url does. Waiting for readiness
  // would then time out on every step, over a question no step addresses.
  const loading = questions.filter(isLoadingChoicesFromWeb);
  if (loading.length > 0) {
    return {
      reason: "webChoices",
      names: loading.map(getOwnerName),
      urls: loading.map((question: any) => question.choicesByUrl.processedUrl || question.choicesByUrl.url),
    };
  }
  return undefined;
}

function isLoadingChoicesFromWeb(question: any): boolean {
  const choicesByUrl = question.choicesByUrl;
  return !!choicesByUrl && choicesByUrl.isRunning === true;
}

// "what" names the action the wait belongs to, as a phrase: the "complete" command, the start state
// of the test. It reaches the message of the timeout error and nothing else.
export async function waitForSurvey(context: ISurveyTestContext, what: string): Promise<void> {
  const survey: any = context.survey;
  let busy = getSurveyBusyState(survey);
  if (!busy) return;
  const timeout = getAsyncTimeout(context.options);
  // A caller that sets the budget to zero asks for no waiting at all and takes the consequences.
  if (timeout <= 0) return;
  const start = Date.now();
  let turns = 0;
  while(!!busy) {
    // A stopped run stops waiting. The runner notices the signal the moment this returns, and an
    // operation the survey is still holding is the caller's decision, not a broken case.
    if (!!context.signal && context.signal.aborted) return;
    if (Date.now() - start >= timeout) throw createTimeoutError(what, busy, timeout);
    await delayTurn(turns === 0 ? 0 : ASYNC_POLL_INTERVAL);
    turns++;
    busy = getSurveyBusyState(survey);
  }
}

function createTimeoutError(what: string, busy: ISurveyTestBusyState, timeout: number): SurveyTestCaseError {
  const data: any = { reason: busy.reason, operation: what, timeout: timeout };
  if (!!busy.names) data.names = busy.names;
  if (!!busy.urls) data.urls = busy.urls;
  return createCaseError(SurveyTestIssueCodes.asyncOperationTimeout,
    "The survey was still running an asynchronous operation " + timeout + "ms after " + what + ": " +
    getReasonText(busy) + ". The test stops here: what the survey does next would land on a model no " +
    "step is watching, and the state every step after this one reads would be the state before it. " +
    "Raise the \"asyncTimeout\" option if the operation needs longer.",
    { data: data });
}

function getReasonText(busy: ISurveyTestBusyState): string {
  const names = !!busy.names ? busy.names.join(", ") : "";
  switch(busy.reason) {
    case "serverValidation":
      return "a handler of \"onServerValidateQuestions\" has not called \"options.complete()\"";
    case "navigationHandler":
      return "a handler of \"onCompleting\" or \"onCurrentPageChanging\" has not called its callback";
    case "validators":
      return "the asynchronous validators of " + names + " have not finished";
    case "expressions":
      return "the asynchronous expressions of " + names + " have not finished";
    case "webChoices":
      return "the choices of " + names + " are still loading from " +
        (!!busy.urls ? busy.urls.join(", ") : "a web service");
  }
  return busy.reason;
}

// Every object that runs an expression of its own keeps its own "is an asynchronous run in flight"
// flag, so the whole model is scanned: a visibleIf of a page, a trigger and a calculated value are as
// able to hold the survey as a question is.
function getExpressionOwners(survey: any, questions: Array<any>): Array<any> {
  const res: Array<any> = [survey];
  questions.forEach(question => res.push(question));
  pushAll(res, callArray(survey, "getAllPanels"));
  pushAll(res, survey.pages);
  pushAll(res, survey.triggers);
  pushAll(res, survey.calculatedValues);
  return res;
}

function getSurveyQuestions(survey: any): Array<any> {
  if (typeof survey.getAllQuestions !== "function") return [];
  // Nested questions included: a matrix cell and a question inside a dynamic panel run expressions and
  // validators of their own.
  return survey.getAllQuestions(false, false, true) || [];
}

function getOwnerName(obj: any): string {
  if (!!obj && !!obj.name) return obj.name;
  return !!obj && typeof obj.getType === "function" ? obj.getType() : "survey";
}

function callArray(obj: any, methodName: string): Array<any> {
  return typeof obj[methodName] === "function" ? obj[methodName]() : undefined;
}

function pushAll(dest: Array<any>, source: Array<any>): void {
  if (!Array.isArray(source)) return;
  source.forEach(item => dest.push(item));
}

function delayTurn(ms: number): Promise<void> {
  return new Promise<void>(resolve => { setTimeout(resolve, ms); });
}
