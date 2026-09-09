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

export function notAskableError(name: string, reason: "disabled" | "unsupported"): IInterviewError {
  const why = reason === "disabled"
    ? "an \"enableIf\" expression turned it off, and it takes an answer again once that expression turns true"
    : "its value can only be produced through the question's own UI - a file to upload, a signature to draw";
  return {
    name: name,
    message: "The input " + quoteValue(name) + " cannot be answered: " + why + ".",
    code: InterviewErrorCodes.notAskable,
  };
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
