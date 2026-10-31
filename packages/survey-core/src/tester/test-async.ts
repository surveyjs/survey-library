import type { SurveyAsyncOperationType } from "survey-core";
import { DEFAULT_SURVEY_ASYNC_TIMEOUT, getSurveyAsyncReasonText, getSurveyAsyncTimeout, getSurveyBusyState as getBusyState,
  ISurveyBusyState, waitForSurveyOperations } from "../utils/survey-async";
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

// The budget for the whole wait, chained operations included, in milliseconds. It is wall-clock time
// and it is deliberately not the pinned clock of the test: what is bounded here is how long a real
// handler may take, not what the survey believes the date is. The waiting itself lives in
// src/utils/survey-async.ts, which the interview shares.
export const DEFAULT_TEST_ASYNC_TIMEOUT = DEFAULT_SURVEY_ASYNC_TIMEOUT;

// The reasons are the operation types of SurveyModel.getRunningAsyncOperations(): the model owns the
// list of its asynchronous mechanisms, and the tester reports them under the names the model gave.
export type SurveyTestBusyReason = SurveyAsyncOperationType;

export type ISurveyTestBusyState = ISurveyBusyState;

export function getAsyncTimeout(options: ISurveyTestOptions): number {
  return getSurveyAsyncTimeout(!!options ? options.asyncTimeout : undefined);
}

// The first reason found, and everything running for that reason. Undefined means the model is
// settled: everything the last interaction started has landed on it.
export function getSurveyBusyState(survey: any): ISurveyTestBusyState {
  return getBusyState(survey);
}

// "what" names the action the wait belongs to, as a phrase: the "complete" command, the start state
// of the test. It reaches the message of the timeout error and nothing else.
export async function waitForSurvey(context: ISurveyTestContext, what: string): Promise<void> {
  return waitForSurveyModel(context.survey, context.options, context.signal, what);
}

// The same wait for a model that has no context of its own: the variable definition of the suite is
// built beside the survey under test, out of the same suite and with the same providers, and its
// choicesByUrl questions and asynchronous expressions settle under the same budget.
export async function waitForSurveyModel(survey: any, options: ISurveyTestOptions,
  signal: AbortSignal, what: string): Promise<void> {
  // A budget of zero or less asks for no waiting at all, and the caller takes the consequences. A
  // stopped run stops waiting: the runner notices the signal the moment this returns, and an operation
  // the survey is still holding is the caller's decision, not a broken case.
  const res = await waitForSurveyOperations(survey, getAsyncTimeout(options), () => !!signal && signal.aborted);
  if (res.status === "timedOut") throw createTimeoutError(what, res.busy, res.timeout);
}

function createTimeoutError(what: string, busy: ISurveyTestBusyState, timeout: number): SurveyTestCaseError {
  const data: any = { reason: busy.reason, operation: what, timeout: timeout };
  if (!!busy.names) data.names = busy.names;
  if (!!busy.urls) data.urls = busy.urls;
  return createCaseError(SurveyTestIssueCodes.asyncOperationTimeout,
    "The survey was still running an asynchronous operation " + timeout + "ms after " + what + ": " +
    getSurveyAsyncReasonText(busy) + ". The test stops here: what the survey does next would land on a model no " +
    "step is watching, and the state every step after this one reads would be the state before it. " +
    "Raise the \"asyncTimeout\" option if the operation needs longer.",
    { data: data });
}
