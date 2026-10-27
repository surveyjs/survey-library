import type { IRunningAsyncOperation, SurveyAsyncOperationType } from "survey-core";

// Observing and waiting for the asynchronous operations a survey is running, shared by the optional
// bundles that drive a survey model from outside (the tester, the interview). Each of them compiles
// this file in: it imports nothing at run time, so it drags no other source into those bundles, and
// it knows nothing about its callers - each keeps its own options, error type and message, and only
// the reason text comes from here.

// The default budget for the whole wait, chained operations included, in milliseconds. It is
// wall-clock time and it is deliberately not the pinned clock a caller may give the survey: what is
// bounded here is how long a real handler may take, not what the survey believes the date is.
export const DEFAULT_SURVEY_ASYNC_TIMEOUT = 5000;
// The first re-read is a plain event-loop turn, so an operation that resolves in the same turn costs
// no timer at all. Everything after it polls at this interval.
const ASYNC_POLL_INTERVAL = 5;

export interface ISurveyBusyState {
  reason: SurveyAsyncOperationType;
  // The questions or the expression owners the survey is still waiting for, when the reason names any.
  names?: Array<string>;
  // The urls of the requests that have not answered yet. Only "webChoices" carries them.
  urls?: Array<string>;
}

// "settled": the model had nothing running, or everything it ran has landed. "notWaited": the budget
// is zero or negative, so a busy model was left as it is. "aborted": the caller stopped the wait,
// which does not stop the survey's operations. "timedOut": the budget ran out; busy is what was still
// running then and timeout the budget that ran out.
export type SurveyAsyncWaitStatus = "settled" | "notWaited" | "aborted" | "timedOut";

export interface ISurveyAsyncWaitResult {
  status: SurveyAsyncWaitStatus;
  busy?: ISurveyBusyState;
  timeout?: number;
}

// A finite number is the budget as given, anything else is the default. Zero or negative means "do
// not wait"; that is the waiter's decision, not this one's.
export function getSurveyAsyncTimeout(value: any): number {
  return typeof value === "number" && isFinite(value) ? value : DEFAULT_SURVEY_ASYNC_TIMEOUT;
}

// The first reason found, and everything running for that reason. The model itself enumerates its
// asynchronous mechanisms - getRunningAsyncOperations() is the one place in survey-core that knows
// them all, cheapest and most explanatory first - so a mechanism added to the model later is waited
// for here without this file learning about it. Undefined means the model is settled: everything the
// last interaction started has landed on it.
// Question.isReady is deliberately not waited for: a question with a choicesByUrl url is un-ready
// from the moment it has the url and stays un-ready forever if nothing ever sends the request.
// getRunningAsyncOperations() reports what is actually in flight.
export function getSurveyBusyState(survey: any): ISurveyBusyState {
  if (!survey || typeof survey.getRunningAsyncOperations !== "function") return undefined;
  const operations: Array<IRunningAsyncOperation> = survey.getRunningAsyncOperations();
  if (!Array.isArray(operations) || operations.length === 0) return undefined;
  const reason = operations[0].type;
  const res: ISurveyBusyState = { reason: reason };
  if (reason === "serverValidation" || reason === "navigationHandler") return res;
  const owners = operations.filter(operation => operation.type === reason).map(operation => operation.owner);
  res.names = owners.map(getOwnerName);
  if (reason === "webChoices") {
    res.urls = owners.map((question: any) => question.choicesByUrl.processedUrl || question.choicesByUrl.url);
  }
  return res;
}

// What the survey is still doing, as a phrase that fits into a caller's own timeout message.
export function getSurveyAsyncReasonText(busy: ISurveyBusyState): string {
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
    case "dynamicData":
      return "the records of " + names + " are still loading from or saving to their data source";
  }
  return busy.reason;
}

// Waits until the model has nothing running. The running operations are re-read after every turn, so
// an operation that starts another one is waited for too, under the same budget. An idle model returns
// before the budget is read and without a timer. isCanceled is checked before the budget, so a caller
// that stopped the wait never sees a timeout.
export async function waitForSurveyOperations(survey: any, timeout: any,
  isCanceled?: () => boolean): Promise<ISurveyAsyncWaitResult> {
  let busy = getSurveyBusyState(survey);
  if (!busy) return { status: "settled" };
  const budget = getSurveyAsyncTimeout(timeout);
  // A caller that sets the budget to zero asks for no waiting at all and takes the consequences.
  if (budget <= 0) return { status: "notWaited", busy: busy };
  const start = Date.now();
  let turns = 0;
  while(!!busy) {
    if (!!isCanceled && isCanceled()) return { status: "aborted", busy: busy };
    if (Date.now() - start >= budget) return { status: "timedOut", busy: busy, timeout: budget };
    await delayTurn(turns === 0 ? 0 : ASYNC_POLL_INTERVAL);
    turns++;
    busy = getSurveyBusyState(survey);
  }
  return { status: "settled" };
}

function getOwnerName(obj: any): string {
  if (!!obj && !!obj.name) return obj.name;
  return !!obj && typeof obj.getType === "function" ? obj.getType() : "survey";
}

function delayTurn(ms: number): Promise<void> {
  return new Promise<void>(resolve => { setTimeout(resolve, ms); });
}
