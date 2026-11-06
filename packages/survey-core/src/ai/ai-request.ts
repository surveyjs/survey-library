import { AIMessage, AIRequestEvent, AIRequestIssue, AIResponse, AIResponseFormat } from "../interfaces/ai-interfaces";
import { isAIObject, readAIJson } from "./ai-response";

// What a feature tells the request session: how its answers are read, shown back to the model and
// checked. The session knows nothing else about the feature.
export interface IAIFeature<TAnswer, TIssue extends AIRequestIssue = AIRequestIssue> {
  responseFormat: AIResponseFormat;
  // data: the object of a structured output or the JSON object the text holds, undefined when there
  // is neither; text: the raw text. Always returns an answer - an empty one when nothing is usable.
  parse(data: any, text: string): TAnswer;
  isEmpty(answer: TAnswer): boolean;
  // the assistant turn the next request shows the model
  serialize(answer: TAnswer): string;
  // the problems of an answer; while attempts remain, an "error" sends the answer back
  validate(answer: TAnswer, action: string): Array<TIssue>;
  buildFixInstruction(answer: TAnswer, issues: Array<TIssue>): string;
}

export interface IAIRequest<TAnswer, TIssue extends AIRequestIssue = AIRequestIssue> {
  feature: IAIFeature<TAnswer, TIssue>;
  action: string;
  userPrompt: string;
  // the last user message of the request
  instruction: string;
  context: any;
  systemPrompt: string;
  buildSystemPrompt: (context: any) => string;
  // false: the request and its answer stay out of the conversation (an explanation)
  keepTurn?: boolean;
  // the feature's own payload fields; retryOf is the answer a retry sends back
  getFields?: (retryOf?: TAnswer) => { [name: string]: any };
  // called before a rejected answer is sent back
  onRetry?: (answer: TAnswer, issues: Array<TIssue>, attempt: number) => void;
}

export type AIRequestResult<TAnswer, TIssue extends AIRequestIssue = AIRequestIssue> =
  { status: "answer", answer: TAnswer, issues: Array<TIssue>, attempts: number } |
  { status: "empty", answer: TAnswer, attempts: number } |
  { status: "error", error: string };

// Whom the session asks: fire raises the feature's own AI request event with the payload (Survey
// Creator: creator.onAIExpressionRequest); getFixAttempts says how many rejected answers may be sent back.
export interface IAIRequestOwner<TEvent extends AIRequestEvent = AIRequestEvent> {
  fire: (options: TEvent) => void;
  getFixAttempts: () => number;
}

function clone<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

// One send: the request and its done, which is called once.
interface IAIRequestRun<TAnswer, TIssue extends AIRequestIssue> {
  request: IAIRequest<TAnswer, TIssue>;
  done: (result: AIRequestResult<TAnswer, TIssue>) => void;
  isDone: boolean;
}

// One conversation with the application's model through owner.fire: it sends a request, reads the
// answer, checks it, and sends a rejected answer back while owner.getFixAttempts() allows.
// A new request aborts the running one; an answer that comes late, twice, after an abort or after
// dispose is ignored.
export class AIRequestSession<TAnswer, TIssue extends AIRequestIssue = AIRequestIssue, TEvent extends AIRequestEvent = AIRequestEvent> {
  private conversation: Array<AIMessage> = [];
  private controller: AbortController;
  private isDisposed: boolean = false;

  constructor(public readonly owner: IAIRequestOwner<TEvent>) { }
  public send(request: IAIRequest<TAnswer, TIssue>, done: (result: AIRequestResult<TAnswer, TIssue>) => void): void {
    this.abort();
    if (this.isDisposed) return;
    this.fire({ request: request, done: done, isDone: false }, 0, request.instruction, undefined, []);
  }
  public cancel(): void {
    this.abort();
  }
  public dispose(): void {
    this.abort();
    this.isDisposed = true;
  }

  private abort(): void {
    if (!!this.controller) {
      this.controller.abort();
      this.controller = undefined;
    }
  }
  private fire(run: IAIRequestRun<TAnswer, TIssue>, attempt: number, instruction: string, retryOf: TAnswer, issues: Array<TIssue>): void {
    const request = run.request;
    const controller = new AbortController();
    this.controller = controller;
    let isAnswered = false;
    let options: TEvent;
    const base: AIRequestEvent = {
      action: request.action,
      userPrompt: request.userPrompt || "",
      attempt: attempt,
      issues: issues.map(issue => {
        const res: AIRequestIssue = { severity: issue.severity, message: issue.message };
        if (!!issue.code) res.code = issue.code;
        return res;
      }),
      // copies: a handler that adjusts them changes this request only
      context: clone(request.context),
      systemPrompt: request.systemPrompt,
      rebuildSystemPrompt: () => { options.systemPrompt = request.buildSystemPrompt(options.context); },
      messages: clone(this.conversation).concat([{ role: "user", content: instruction }]),
      responseFormat: clone(request.feature.responseFormat),
      signal: controller.signal,
      callback: (response?: AIResponse) => {
        if (isAnswered || controller.signal.aborted || this.controller !== controller || this.isDisposed) return;
        isAnswered = true;
        // the request stays the running one until its outcome: a cancel() or send() meanwhile ends it
        try {
          this.onResponse(run, controller, attempt, instruction, response);
        } catch(e) {
          this.fail(run, controller, e);
        }
      }
    };
    try {
      // getFields supplies the rest of TEvent, the feature's own fields; the base fields win
      options = <TEvent>Object.assign({}, !!request.getFields ? request.getFields(retryOf) : {}, base);
      this.owner.fire(options);
    } catch(e) {
      this.fail(run, controller, e);
    }
  }
  private finish(run: IAIRequestRun<TAnswer, TIssue>, controller: AbortController, result: AIRequestResult<TAnswer, TIssue>): void {
    if (run.isDone) return;
    run.isDone = true;
    this.release(controller);
    run.done(result);
  }
  // An exception thrown while the request waits for its outcome (by the check, onRetry or the handler)
  // ends it with an "error" result, so the UI does not wait forever. Once the result is delivered, or
  // after the request was cancelled or replaced, the exception goes on to the caller.
  private fail(run: IAIRequestRun<TAnswer, TIssue>, controller: AbortController, error: any): void {
    if (run.isDone || controller.signal.aborted || this.controller !== controller || this.isDisposed) throw error;
    this.finish(run, controller, { status: "error", error: error instanceof Error ? error.message : String(error) });
  }
  private release(controller: AbortController): void {
    if (this.controller === controller) {
      this.controller = undefined;
    }
  }
  private onResponse(run: IAIRequestRun<TAnswer, TIssue>, controller: AbortController, attempt: number, instruction: string,
    response: AIResponse): void {
    if (!!response && !!response.error) {
      this.finish(run, controller, { status: "error", error: String(response.error) });
      return;
    }
    const request = run.request;
    const feature = request.feature;
    const text = !!response && typeof response.text === "string" ? response.text : undefined;
    const data = !!response && isAIObject(response.data) ? response.data : readAIJson(text);
    const answer = feature.parse(data, text);
    if (request.keepTurn !== false) {
      // the answer as the feature asks for it, so the next request shows the model its own turn
      this.conversation.push({ role: "user", content: instruction });
      this.conversation.push({ role: "assistant", content: feature.serialize(answer) });
    }
    if (feature.isEmpty(answer)) {
      this.finish(run, controller, { status: "empty", answer: answer, attempts: attempt });
      return;
    }
    const issues = feature.validate(answer, request.action) || [];
    const hasErrors = issues.some(issue => issue.severity === "error");
    if (hasErrors && attempt < Math.max(0, this.owner.getFixAttempts() || 0)) {
      if (!!request.onRetry) request.onRetry(answer, issues, attempt + 1);
      // onRetry may have cancelled the request, sent a new one or disposed the session
      if (this.isDisposed || this.controller !== controller) return;
      this.fire(run, attempt + 1, feature.buildFixInstruction(answer, issues), answer, issues);
      return;
    }
    this.finish(run, controller, { status: "answer", answer: answer, issues: issues, attempts: attempt });
  }
}
