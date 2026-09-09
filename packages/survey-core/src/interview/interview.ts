import { SurveyModel } from "survey-core";
import { settle } from "./interview-async";
import { renderInterviewDocument } from "./render";
import {
  IInterview, IInterviewCompleteResult, IInterviewItem, IInterviewOptions, IInterviewResult,
  IInterviewToolDefinition,
} from "./interview-types";

// The interview conducts one SurveyModel the integrator owns (overview 2.6). It sets exactly one
// property of that model - questionsOnPageMode, the mode it drives - and never disposes it, so the
// same model may be rendered by a UI at the same time and everything else on it stays whatever the
// developer configured. Nothing is cached: a value written past the interview, by that UI or by the
// host's own code, is seen on the next call.
export class Interview implements IInterview {
  // The interview's own state, the part the model has no notion of: which optional items the
  // interviewee chose to skip, and (tier 06) which summary steps were marked done. dispose() drops
  // it; the model is left alone.
  private skippedItems: { [address: string]: boolean } = {};
  private timeoutValue: number;

  constructor(private surveyValue: SurveyModel, options?: IInterviewOptions) {
    this.timeoutValue = !!options ? options.timeout : undefined;
  }

  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  public get data(): any {
    return this.surveyValue.data;
  }
  protected get timeout(): number {
    return this.timeoutValue;
  }

  // Called once by createInterview, before the instance is handed out. The model is put into the
  // mode the interview drives and, if it is showing a start page, started: the start page is a UI
  // concept that getSingleElements() skips, so an interview would otherwise never ask its questions
  // and never get past it.
  public async initialize(): Promise<void> {
    const survey: any = this.surveyValue;
    // Setting the property re-runs onQuestionsOnPageModeChanged, which resets the single-input state
    // of every question and makes the first root current. A model already in the mode keeps whatever
    // input its owner navigated to.
    if (survey.questionsOnPageMode !== "inputPerPage") {
      survey.questionsOnPageMode = "inputPerPage";
    }
    if (survey.state === "starting" && !survey.start()) {
      throw createStartPageError(survey);
    }
    await settle(this.surveyValue, this.timeoutValue);
  }

  // Tier 04 replaces this: the first visible input that is unanswered or invalid.
  public current(): IInterviewItem | null {
    return null;
  }
  // The text form is final (tier 03); what is still missing is the document behind it. Tier 04
  // fills in the current item, the answered map and the real progress numbers - until then this is
  // the heading and the progress section of a survey nothing has been asked of.
  public describe(): string {
    return renderInterviewDocument({
      title: this.surveyValue.processedTitle,
      progress: { answered: 0, remainingRequired: 0 },
    });
  }
  public answer(value: any): Promise<IInterviewResult>;
  public answer(name: string, value: any): Promise<IInterviewResult>;
  public answer(nameOrValue: any, value?: any): Promise<IInterviewResult> {
    return notImplemented("answer");
  }
  public skip(): Promise<IInterviewResult> {
    return notImplemented("skip");
  }
  public complete(): Promise<IInterviewCompleteResult> {
    return notImplemented("complete");
  }
  public describeAll(): string {
    return notImplemented("describeAll");
  }
  public answerAll(values: { [address: string]: any }): Promise<IInterviewResult> {
    return notImplemented("answerAll");
  }
  public getAnswerSchema(): any {
    return notImplemented("getAnswerSchema");
  }
  public getTools(): Array<IInterviewToolDefinition> {
    return notImplemented("getTools");
  }
  public callTool(name: string, args: any): Promise<any> {
    return notImplemented("callTool");
  }
  public dispose(): void {
    this.skippedItems = {};
  }
}

// A SurveyModel instance is used as is - a subclass is an instance too, and the interview reads and
// writes it through the public Question/SurveyModel surface only, so a subclass is transparent. A
// plain object is JSON and becomes a model with nothing else configured: the convenience form for a
// survey that needs no setup. Anything a developer wants set - locale, data, variables, providers,
// events - means building the model themselves and passing it.
export function createInterview(survey: SurveyModel | any, options?: IInterviewOptions): Promise<IInterview> {
  let model: SurveyModel;
  try {
    model = toSurveyModel(survey);
  } catch(error) {
    return Promise.reject(error);
  }
  const interview = new Interview(model, options);
  return interview.initialize().then(() => interview);
}

function toSurveyModel(survey: SurveyModel | any): SurveyModel {
  if (survey instanceof SurveyModel) {
    if (survey.isDisposed) throw createTypeError("the SurveyModel passed to it is disposed");
    return survey;
  }
  if (!!survey && typeof survey === "object" && !Array.isArray(survey)) {
    return new SurveyModel(survey);
  }
  throw createTypeError("it received " + describeArgument(survey));
}

function createTypeError(what: string): TypeError {
  return new TypeError("createInterview accepts a SurveyModel instance or a survey JSON object, and " +
    what + ". Parse JSON text with JSON.parse first, and build the model yourself when it needs a " +
    "locale, data, variables, providers or event handlers.");
}

function describeArgument(survey: any): string {
  if (survey === null) return "null";
  if (Array.isArray(survey)) return "an array";
  return "a value of type \"" + typeof survey + "\"";
}

// start() validates the start page and returns false when a required question on it is empty. Those
// questions are never items - getSingleElements() skips the start page - so the interview cannot ask
// them; the owner answers them or turns firstPageIsStartPage off before the hand-over. The model is
// left in the "starting" state.
function createStartPageError(survey: any): Error {
  const names = getStartPageErrorNames(survey);
  const error: any = new Error("The survey is showing its start page and start() refused to leave it" +
    (names.length > 0 ? ": " + names.join(", ") + " " + (names.length === 1 ? "has" : "have") + " an error" : "") +
    ". Questions of a start page are never asked by the interview. Answer them, or set " +
    "firstPageIsStartPage to false, before createInterview.");
  error.code = "startPageIncomplete";
  error.names = names;
  return error;
}

function getStartPageErrorNames(survey: any): Array<string> {
  const page = survey.startPage;
  if (!page) return [];
  return page.questions.filter((question: any) => question.errors.length > 0)
    .map((question: any) => question.name);
}

function notImplemented(name: string): never {
  throw new Error("not implemented: " + name);
}
