import type { SurveyModel } from "survey-core";
import { DEFAULT_SURVEY_ASYNC_TIMEOUT, getSurveyAsyncReasonText, getSurveyAsyncTimeout, getSurveyBusyState as getBusyState,
  ISurveyBusyState, waitForSurveyOperations } from "../utils/survey-async";
import { IInterviewRejection, InterviewErrorCodes, createRejection } from "./interview-errors";

// A survey is not finished deciding when the call that started it returns. choicesByUrl goes out
// over the network, an asynchronous validator, an asynchronous expression function, server
// validation and an asynchronous onCompleting handler all hand control back while the model is
// still running. The interview describes what the model says, so it may only read the model once
// the model has settled: an item described in the middle of a choicesByUrl request would be
// described with an empty choice list, which is a wrong description, not a slow one.

// The budget for each wait for the model to settle, chained operations included, in milliseconds.
// Wall-clock time, the same value and the same reasoning as the tester's asyncTimeout. The waiting
// itself lives in src/utils/survey-async.ts, which the tester shares.
export const DEFAULT_INTERVIEW_TIMEOUT = DEFAULT_SURVEY_ASYNC_TIMEOUT;

export type IInterviewBusyState = ISurveyBusyState;

export function getInterviewTimeout(timeout: any): number {
  return getSurveyAsyncTimeout(timeout);
}

// The first reason found, and everything running for that reason. Undefined means the model has
// settled: everything the last interaction started has landed on it.
export function getSurveyBusyState(survey: any): IInterviewBusyState {
  return getBusyState(survey);
}

// Every mutating call of the interview ends here before it reads the state it returns.
export async function settle(survey: SurveyModel, timeout?: number): Promise<void> {
  const result = await waitForSurveyOperations(survey, timeout);
  if (result.status === "timedOut") throw createTimeoutError(result.busy, result.timeout);
}

function createTimeoutError(busy: IInterviewBusyState, timeout: number): IInterviewRejection {
  const error = createRejection(InterviewErrorCodes.asyncTimeout, "The survey was still running an " +
    "asynchronous operation " + timeout + "ms after the interview asked it to settle: " +
    getSurveyAsyncReasonText(busy) + ". The interview stops here: what it would describe is the state before the " +
    "operation landed. Raise the \"timeout\" option if the operation needs longer, or pass 0 not to wait at all.");
  error.reason = busy.reason;
  if (!!busy.names) error.names = busy.names;
  if (!!busy.urls) error.urls = busy.urls;
  return error;
}
