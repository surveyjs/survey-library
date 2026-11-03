import { AIMessage, AIRequestEventBase, AIRequestIssue, AIResponse, AIResponseFormat } from "../interfaces/ai-interfaces";
import { isAIObject, readAIJson } from "./ai-response";

// What a feature tells the request session: how its answers are read, shown back to the model and
// checked. The session knows nothing else about the feature.
export interface IAIFeature<TAnswer, TIssue extends AIRequestIssue = AIRequestIssue> {
  feature: string;
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

// Whom the session asks: fire raises the product's AI request event (Survey Creator:
// creator.onAIRequest) with the payload; getFixAttempts says how many rejected answers may be sent back.
export interface IAIRequestOwner {
  fire: (options: AIRequestEventBase) => void;
  getFixAttempts: () => number;
}

function clone<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

// One conversation with the application's model through owner.fire: it sends a request, reads the
// answer, checks it, and sends a rejected answer back while owner.getFixAttempts() allows.
// A new request aborts the running one; an answer that comes late, twice, after an abort or after
// dispose is ignored.
export class AIRequestSession<TAnswer, TIssue extends AIRequestIssue = AIRequestIssue> {
  private conversation: Array<AIMessage> = [];
  private controller: AbortController;
  private isDisposed: boolean = false;

  constructor(public readonly owner: IAIRequestOwner) { }
  public send(request: IAIRequest<TAnswer, TIssue>, done: (result: AIRequestResult<TAnswer, TIssue>) => void): void {
    this.abort();
    if (this.isDisposed) return;
    this.fire(request, 0, request.instruction, undefined, [], done);
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
  private fire(request: IAIRequest<TAnswer, TIssue>, attempt: number, instruction: string, retryOf: TAnswer,
    issues: Array<TIssue>, done: (result: AIRequestResult<TAnswer, TIssue>) => void): void {
    const controller = new AbortController();
    this.controller = controller;
    let isAnswered = false;
    const base: AIRequestEventBase = {
      feature: request.feature.feature,
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
        this.controller = undefined;
        this.onResponse(request, attempt, instruction, response, done);
      }
    };
    const options: AIRequestEventBase = Object.assign({}, !!request.getFields ? request.getFields(retryOf) : {}, base);
    this.owner.fire(options);
  }
  private onResponse(request: IAIRequest<TAnswer, TIssue>, attempt: number, instruction: string, response: AIResponse,
    done: (result: AIRequestResult<TAnswer, TIssue>) => void): void {
    if (!!response && !!response.error) {
      done({ status: "error", error: String(response.error) });
      return;
    }
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
      done({ status: "empty", answer: answer, attempts: attempt });
      return;
    }
    const issues = feature.validate(answer, request.action) || [];
    const hasErrors = issues.some(issue => issue.severity === "error");
    if (hasErrors && attempt < Math.max(0, this.owner.getFixAttempts() || 0)) {
      if (!!request.onRetry) request.onRetry(answer, issues, attempt + 1);
      if (this.isDisposed) return;
      this.fire(request, attempt + 1, feature.buildFixInstruction(answer, issues), answer, issues, done);
      return;
    }
    done({ status: "answer", answer: answer, issues: issues, attempts: attempt });
  }
}
