import type { Base } from "../base";
import type { IExpressionContext } from "../ai/expression-context";

// The payload types of AI request events. SurveyJS never calls a model. Each AI feature fires its
// own event, whose payload extends AIRequestEvent; the feature is on when that event has a handler.
// For example, Survey Creator's expression assistant fires creator.onAIExpressionRequest with an
// ExpressionAIRequestEvent. The application's handler sends systemPrompt and messages to a model and
// passes the answer to callback. The product reads the answer, checks it, and may send a rejected
// answer back with the problems it found (attempt > 0, issues).

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

// The JSON the answer must be: a JSON Schema in the subset that OpenAI strict structured outputs and
// Anthropic structured outputs accept as is. The product also reads plain text that holds this JSON.
export interface AIResponseFormat {
  name: string;
  schema: { [key: string]: any };
}

// A problem the product found in the previous answer, in English, as it is sent to the model.
export interface AIRequestIssue {
  severity: "error" | "warning" | "info";
  message: string;
  // the feature's id of the problem; for a Creator expression, "<linter ruleId>:<reason>"
  code?: string;
}

// What a handler passes to callback: the model's text, the parsed object of a structured output, or an
// error. No argument means no answer.
export interface AIResponse {
  text?: string;
  data?: any;
  error?: string;
}

export interface AIRequestEvent {
  // what the feature asks; each feature's payload narrows it
  action: string;
  // what the author typed; empty when the author typed nothing
  userPrompt: string;
  // 0 for the author's request; 1..n when the product sends back an answer it rejected
  attempt: number;
  // why the previous answer was rejected; empty when attempt is 0
  issues: Array<AIRequestIssue>;
  // a copy of what systemPrompt is built from: a handler that changes it changes this request only
  context: any;
  systemPrompt: string;
  // rebuilds systemPrompt from context after the handler changed context
  rebuildSystemPrompt: () => void;
  // the whole conversation, ending with this request; systemPrompt is not in it
  messages: Array<AIMessage>;
  responseFormat: AIResponseFormat;
  signal: AbortSignal;
  // completes the request; a later call, or one after the signal aborted, is ignored. A request
  // without an answer stays in progress until the author stops it.
  callback: (response?: AIResponse) => void;
}

// The payload of Survey Creator's onAIExpressionRequest, the expression assistant's event:
// - "generate": the target property is empty and the author describes a new expression.
//   Example: userPrompt "show this question to adults only" -> "{age} >= 18".
// - "modify": the target already has an expression (or the assistant shows a suggestion the author
//   refines) and the author describes a change.
//   Example: expression "{age} >= 18", userPrompt "and only for residents" -> "{age} >= 18 and {resident} = true".
// - "explain": the author clicked Explain; the AI describes the target's current expression in words.
// A retry keeps the action: the AI answered "{Age} >= 18", the survey has no "Age", and Creator asks
// again with attempt 1 and that issue; expression is then the rejected answer.
// The answer is { expression, explanation } (responseFormat).
export interface ExpressionAIRequestEvent extends AIRequestEvent {
  action: "generate" | "modify" | "explain";
  context: IExpressionContext;
  // empty for "generate"; the property value or the suggestion to revise for "modify"; the current
  // property value for "explain"; the rejected answer on a retry
  expression: string;
  // whether the expression must return a Boolean value
  isCondition: boolean;
  // the survey objects and properties the expression is written to
  targets: Array<{ element: Base, propertyName: string }>;
}
