// The public surface of "survey-core/interview". It is a separate entry point on purpose: an
// application that only renders a survey never loads any of it, and no file under src/ outside
// src/interview/ imports from here. entries/index.ts does not reference this file.

export type {
  IInterview,
  IInterviewOptions,
  IInterviewItem,
  IInterviewSummary,
  IInterviewAction,
  IInterviewError,
  IInterviewChanges,
  IInterviewResult,
  IInterviewCompleteResult,
  IInterviewDocument,
  IInterviewToolDefinition,
} from "../src/interview/interview-types";

// The one entry point into the runtime. It is asynchronous because the model may still be loading
// choices from a web service or running an asynchronous expression when it is handed over, and an
// interview that described that model would describe a state that is about to change.
export { createInterview } from "../src/interview/interview";
