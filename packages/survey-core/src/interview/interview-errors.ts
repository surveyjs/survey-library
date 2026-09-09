import type { IInterviewError } from "./interview-types";

// Every error the interview raises itself, in one frozen table. A host localizes on the code, the
// way it localizes on SurveyLintReasons: the message is English prose meant for a developer or for
// an agent's next turn, and it may be reworded; the code may not be renamed. Errors that come from
// the model - a failed validator, a required input - carry no code at all: their message is already
// the localized text the rendered UI shows for the same error.
export const InterviewErrorCodes = Object.freeze({
  nothingToAnswer: "nothingToAnswer",
  unknownQuestion: "unknownQuestion",
  notAskable: "notAskable",
  notAChoice: "notAChoice",
  notANumber: "notANumber",
  badAction: "badAction",
  requiredCannotSkip: "requiredCannotSkip",
  completionBlocked: "completionBlocked",
  surveyCompleted: "surveyCompleted",
  startPageIncomplete: "startPageIncomplete",
  badAddress: "badAddress",
  badRecord: "badRecord",
  cannotAdd: "cannotAdd",
  cannotRemove: "cannotRemove",
});

// An error the interview raises has no address to point at when it is about the interview as a
// whole and not about one input: "there is nothing left to answer" is true of the survey.
const NO_TARGET = "";

// A value as a message names it. JSON form, so that the type stays visible: the string "5" and the
// number 5 are different answers, and a message that prints both as 5 hides the very mistake the
// reader is looking for. The same rule as the linter's quoteValue.
function quoteValue(value: any): string {
  const res = JSON.stringify(value);
  return res === undefined ? String(value) : res;
}

function quoteValues(values: Array<any>): string {
  return values.map(quoteValue).join(", ");
}

export function nothingToAnswerError(): IInterviewError {
  return {
    name: NO_TARGET,
    message: "There is nothing left to answer: every input that can be asked is answered and valid. " +
      "Call complete() to finish the survey.",
    code: InterviewErrorCodes.nothingToAnswer,
  };
}

export function unknownQuestionError(name: string, known: Array<string>): IInterviewError {
  return {
    name: name,
    message: "There is no input named " + quoteValue(name) + " to answer. The inputs the survey is " +
      "asking for now are: " + (known.length > 0 ? quoteValues(known) : "none") + ".",
    code: InterviewErrorCodes.unknownQuestion,
  };
}

// One code, four reasons. "batch" and "hidden" belong to answerAll(): a container is a question the
// batch API has no way to write, and a question an earlier answer of the same call hid or turned off
// is one the batch may no longer write. Both are the same statement to the caller - "this key was
// not written" - so they are the same code with a message that says which.
export type InterviewNotAskableReason = "disabled" | "unsupported" | "batch" | "hidden";

const NOT_ASKABLE_REASONS: { [reason: string]: string } = {
  disabled: "an \"enableIf\" expression turned it off, and it takes an answer again once that expression turns true",
  unsupported: "its value can only be produced through the question's own UI - a file to upload, a signature to draw",
  batch: "it holds a list of entries that grows and shrinks - a dynamic panel or a dynamic matrix - " +
    "or it is a container nested inside another container. Its inputs are answered in single-input mode",
  hidden: "an earlier answer of the same call hid it or turned it off, so it is no longer being asked",
};

export function notAskableError(name: string, reason: InterviewNotAskableReason): IInterviewError {
  return {
    name: name,
    message: "The input " + quoteValue(name) + " cannot be answered: " + NOT_ASKABLE_REASONS[reason] + ".",
    code: InterviewErrorCodes.notAskable,
  };
}

export function unknownToolError(name: string): Error {
  return new Error("unknown tool: " + name);
}

export function notAChoiceError(name: string, value: any, choices: Array<any>): IInterviewError {
  return {
    name: name,
    message: "The value " + quoteValue(value) + " is not among the choices of " + quoteValue(name) +
      ". Available choices: " + quoteValues(choices) + ".",
    code: InterviewErrorCodes.notAChoice,
  };
}

export function notANumberError(name: string, value: any): IInterviewError {
  return {
    name: name,
    message: "The input " + quoteValue(name) + " takes a number, and the value is " + quoteValue(value) + ".",
    code: InterviewErrorCodes.notANumber,
  };
}

export function badActionError(name: string, action: any): IInterviewError {
  return {
    name: name,
    message: "The input " + quoteValue(name) + " takes a value, and it was given the action " +
      quoteValue(action) + ". Actions belong to the summary step of a dynamic panel or a dynamic " +
      "matrix, which is the only item that offers them.",
    code: InterviewErrorCodes.badAction,
  };
}

// One code for every way an answer to a summary step can be wrong, because they are one statement to
// the caller: the step lists the entries of a container and the four things that can be done to it.
const SUMMARY_ACTIONS = "\"add\", \"remove\" and \"edit\" with an \"index\", and \"done\"";

export function notAnActionError(name: string): IInterviewError {
  return {
    name: name,
    message: "The item " + quoteValue(name) + " is the summary step of a dynamic container: it takes an " +
      "action object, not a value. The actions are " + SUMMARY_ACTIONS + ".",
    code: InterviewErrorCodes.badAction,
  };
}

export function unknownActionError(name: string, action: any): IInterviewError {
  return {
    name: name,
    message: "The summary step " + quoteValue(name) + " has no action " + quoteValue(action) + ". Its " +
      "actions are " + SUMMARY_ACTIONS + ".",
    code: InterviewErrorCodes.badAction,
  };
}

export function badActionIndexError(name: string, action: string, index: any, count: number): IInterviewError {
  return {
    name: name,
    message: "The action " + quoteValue(action) + " on " + quoteValue(name) + " needs the \"index\" of an " +
      "entry, and it was given " + quoteValue(index) + ". " + (count > 0
      ? "The entries are numbered 0 to " + (count - 1) + "."
      : "There are no entries yet; \"add\" makes one."),
    code: InterviewErrorCodes.badAction,
  };
}

// The address grammar refused the text, or an index named an entry that does not exist. The second
// is not "unknown": the address is well formed and the entry can be brought into being, and the way
// to do that is the "add" action of the container's summary step.
export function badAddressError(name: string): IInterviewError {
  return {
    name: typeof name === "string" ? name : "",
    message: "The address " + quoteValue(name) + " does not name an input of this survey. An address is " +
      "a question name, optionally followed by the entry and the input inside it: \"medications[0].dose\", " +
      "\"matrix.row1.column1\", \"contact.email\". An index counts the entries that exist now - a new one " +
      "is added through the \"add\" action of the container's summary step.",
    code: InterviewErrorCodes.badAddress,
  };
}

// A container whose value is one object with a fixed set of keys - a single-choice matrix, a matrix
// dropdown, a multiple text, a composite - takes that object and nothing else, and so does a row of
// a matrix dropdown. null and undefined are not a mistake: they leave the container alone, and a
// field is cleared by sending null for that field.
export function badRecordError(name: string, value: any): IInterviewError {
  return {
    name: name,
    message: "The value of " + quoteValue(name) + " must be an object of field values - its keys are " +
      "the names the document lists for it - and it is " + quoteValue(value) + ". Send only the fields " +
      "to change; the others are left as they are.",
    code: InterviewErrorCodes.badRecord,
  };
}

export function cannotAddError(name: string): IInterviewError {
  return {
    name: name,
    message: "No entry can be added to " + quoteValue(name) + " right now: it has reached its maximum " +
      "count, or adding is turned off for it.",
    code: InterviewErrorCodes.cannotAdd,
  };
}

export function cannotRemoveError(name: string, index: number): IInterviewError {
  return {
    name: name,
    message: "The entry " + index + " of " + quoteValue(name) + " cannot be removed: it offers no remove " +
      "action. Removing is turned off for it, or it would fall below its minimum count.",
    code: InterviewErrorCodes.cannotRemove,
  };
}

export function requiredCannotSkipError(name: string): IInterviewError {
  return {
    name: name,
    message: "The input " + quoteValue(name) + " is required, so it cannot be skipped. It stays the " +
      "current input until it is answered.",
    code: InterviewErrorCodes.requiredCannotSkip,
  };
}

export function completionBlockedError(): IInterviewError {
  return {
    name: NO_TARGET,
    message: "A handler of \"onCompleting\" refused the completion, so the survey is still running. " +
      "The handler knows why; the interview only sees that it said no.",
    code: InterviewErrorCodes.completionBlocked,
  };
}

export function surveyCompletedError(): IInterviewError {
  return {
    name: NO_TARGET,
    message: "The survey is completed. Its answers are still readable through data and describe(), " +
      "and nothing more can be answered, skipped or completed.",
    code: InterviewErrorCodes.surveyCompleted,
  };
}
