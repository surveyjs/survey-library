import type { IRunningAsyncOperation, SurveyAsyncOperationType, SurveyModel } from "survey-core";

// A survey is not finished deciding when the call that started it returns. choicesByUrl goes out
// over the network, an asynchronous validator, an asynchronous expression function, server
// validation and an asynchronous onCompleting handler all hand control back while the model is
// still running. The interview describes what the model says, so it may only read the model once
// the model has settled: an item described in the middle of a choicesByUrl request would be
// described with an empty choice list, which is a wrong description, not a slow one.

// The default budget for one asynchronous survey operation, in milliseconds. Wall-clock time, the
// same value and the same reasoning as the tester's asyncTimeout.
export const DEFAULT_INTERVIEW_TIMEOUT = 5000;
// The first re-read is a plain event-loop turn, so an operation that resolves in the same turn
// costs no timer at all. Everything after it polls at this interval.
const ASYNC_POLL_INTERVAL = 5;

// Question.isReady is deliberately not waited for: a question with a choicesByUrl url is un-ready
// from the moment it has the url and stays un-ready forever if nothing ever sends the request.
// getRunningAsyncOperations() reports what is actually in flight, and it is the one place in
// survey-core that enumerates the asynchronous mechanisms, so a mechanism added to the model later
// is waited for here without this file learning about it.
export interface IInterviewBusyState {
  reason: SurveyAsyncOperationType;
  // the questions or expression owners the survey is still waiting for, when the reason names any
  names?: Array<string>;
  // the urls of the requests that have not answered yet; only "webChoices" carries them
  urls?: Array<string>;
}

export function getInterviewTimeout(timeout: any): number {
  return typeof timeout === "number" && isFinite(timeout) ? timeout : DEFAULT_INTERVIEW_TIMEOUT;
}

// The first reason found, and everything running for that reason. Undefined means the model has
// settled: everything the last interaction started has landed on it.
export function getSurveyBusyState(survey: any): IInterviewBusyState {
  if (!survey || typeof survey.getRunningAsyncOperations !== "function") return undefined;
  const operations: Array<IRunningAsyncOperation> = survey.getRunningAsyncOperations();
  if (!Array.isArray(operations) || operations.length === 0) return undefined;
  const reason = operations[0].type;
  const res: IInterviewBusyState = { reason: reason };
  if (reason === "serverValidation" || reason === "navigationHandler") return res;
  const owners = operations.filter(operation => operation.type === reason).map(operation => operation.owner);
  res.names = owners.map(getOwnerName);
  if (reason === "webChoices") {
    res.urls = owners.map((question: any) => question.choicesByUrl.processedUrl || question.choicesByUrl.url);
  }
  return res;
}

// Every mutating call of the interview ends here before it reads the state it returns.
export async function settle(survey: SurveyModel, timeout?: number): Promise<void> {
  let busy = getSurveyBusyState(survey);
  if (!busy) return;
  const budget = getInterviewTimeout(timeout);
  // A caller that sets the budget to zero asks for no waiting at all and takes the consequences.
  if (budget <= 0) return;
  const start = Date.now();
  let turns = 0;
  while(!!busy) {
    if (Date.now() - start >= budget) throw createTimeoutError(busy, budget);
    await delayTurn(turns === 0 ? 0 : ASYNC_POLL_INTERVAL);
    turns++;
    busy = getSurveyBusyState(survey);
  }
}

function createTimeoutError(busy: IInterviewBusyState, timeout: number): Error {
  const error: any = new Error("The survey was still running an asynchronous operation " + timeout +
    "ms after the interview asked it to settle: " + getReasonText(busy) + ". The interview stops " +
    "here: what it would describe is the state before the operation landed. Raise the \"timeout\" " +
    "option if the operation needs longer, or pass 0 not to wait at all.");
  error.code = "asyncTimeout";
  error.reason = busy.reason;
  if (!!busy.names) error.names = busy.names;
  if (!!busy.urls) error.urls = busy.urls;
  return error;
}

function getReasonText(busy: IInterviewBusyState): string {
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

function getOwnerName(obj: any): string {
  if (!!obj && !!obj.name) return obj.name;
  return !!obj && typeof obj.getType === "function" ? obj.getType() : "survey";
}

function delayTurn(ms: number): Promise<void> {
  return new Promise<void>(resolve => { setTimeout(resolve, ms); });
}
