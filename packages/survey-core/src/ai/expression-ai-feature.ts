import { AIRequestIssue, AIResponseFormat } from "../interfaces/ai-interfaces";
import { IAIFeature } from "./ai-request";
import { buildExpressionInstruction } from "./expression-context";
import { IExpressionResponse, parseExpressionResponse, readExpressionData } from "./expression-response";

// finding: what the product's check found, as the check reports it (Survey Creator: a lint finding)
export interface IExpressionAIIssue<TFinding = any> extends AIRequestIssue {
  finding: TFinding;
}

// The answer the system prompt asks for, as a structured-output schema
export const expressionResponseFormat: AIResponseFormat = {
  name: "survey_expression",
  schema: {
    type: "object",
    properties: {
      expression: { type: "string" },
      explanation: { type: "string" },
    },
    required: ["expression", "explanation"],
    additionalProperties: false,
  },
};

// The expression feature's part of an AI request. check returns the problems of an answer's
// expression; without it, no answer has any. An explanation is never checked.
export class ExpressionAIFeature<TFinding = any> implements IAIFeature<IExpressionResponse, IExpressionAIIssue<TFinding>> {
  public readonly feature = "expression";
  public readonly responseFormat = expressionResponseFormat;

  constructor(private check?: (expression: string) => Array<IExpressionAIIssue<TFinding>>) { }

  public parse(data: any, text: string): IExpressionResponse {
    const res = data !== undefined ? readExpressionData(data) : parseExpressionResponse(text);
    return { expression: (!!res && res.expression || "").trim(), explanation: !!res && res.explanation || "" };
  }
  public isEmpty(answer: IExpressionResponse): boolean {
    return !answer.expression;
  }
  public serialize(answer: IExpressionResponse): string {
    return JSON.stringify({ expression: answer.expression, explanation: answer.explanation || "" });
  }
  public validate(answer: IExpressionResponse, action: string): Array<IExpressionAIIssue<TFinding>> {
    if (action === "explain" || !this.check) return [];
    return this.check(answer.expression) || [];
  }
  public buildFixInstruction(answer: IExpressionResponse, issues: Array<IExpressionAIIssue<TFinding>>): string {
    return buildExpressionInstruction("fix", "", answer.expression, issues.map(issue => ({ severity: issue.severity, message: issue.message })));
  }
}
