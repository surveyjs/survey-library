import type { IRunningAsyncOperation, SurveyAsyncOperationType } from "survey-core";
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

// The reasons are the operation types of SurveyModel.getRunningAsyncOperations(): the model owns the
// list of its asynchronous mechanisms, and the tester reports them under the names the model gave.
export type SurveyTestBusyReason = SurveyAsyncOperationType;

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

// The first reason found, and everything running for that reason. The model itself enumerates its
// asynchronous mechanisms - getRunningAsyncOperations() is the one place in survey-core that knows
// them all, cheapest and most explanatory first - so a mechanism added to the model later is waited
// for here without this file learning about it. Undefined means the model is settled: everything the
// last interaction started has landed on it.
export function getSurveyBusyState(survey: any): ISurveyTestBusyState {
  if (!survey || typeof survey.getRunningAsyncOperations !== "function") return undefined;
  const operations: Array<IRunningAsyncOperation> = survey.getRunningAsyncOperations();
  if (!Array.isArray(operations) || operations.length === 0) return undefined;
  const reason = operations[0].type;
  const res: ISurveyTestBusyState = { reason: reason };
  if (reason === "serverValidation" || reason === "navigationHandler") return res;
  const owners = operations.filter(operation => operation.type === reason).map(operation => operation.owner);
  res.names = owners.map(getOwnerName);
  if (reason === "webChoices") {
    res.urls = owners.map((question: any) => question.choicesByUrl.processedUrl || question.choicesByUrl.url);
  }
  return res;
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

function getOwnerName(obj: any): string {
  if (!!obj && !!obj.name) return obj.name;
  return !!obj && typeof obj.getType === "function" ? obj.getType() : "survey";
}

function delayTurn(ms: number): Promise<void> {
  return new Promise<void>(resolve => { setTimeout(resolve, ms); });
}
