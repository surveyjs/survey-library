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

// The codes the interview raises itself, frozen. A host localizes on the code the way it localizes
// on SurveyLintReasons: a message is prose and may be reworded, a code is API and is never renamed.
export { InterviewErrorCodes } from "../src/interview/interview-errors";

// The emitter the documents are written with. A host that renders its own text from IInterviewItem
// records gets the same quoting - the rule that keeps the string "Yes" a string once a consumer
// parses the YAML back.
export { toYaml } from "../src/interview/yaml";
