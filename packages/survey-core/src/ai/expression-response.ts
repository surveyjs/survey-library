import { getAIFencedBlocks, isAIObject, readAIJson } from "./ai-response";

export interface IExpressionResponse {
  expression: string;
  explanation?: string;
}

// The answer in a JSON object: undefined when the object has neither an expression nor an explanation.
// An empty expression with an explanation is the AI saying why it has none - still an empty result,
// but one the assistant can explain.
export function readExpressionData(data: any): IExpressionResponse | undefined {
  if (!isAIObject(data)) return undefined;
  const expression = typeof data.expression === "string" ? data.expression.trim() : "";
  const explanation = typeof data.explanation === "string" ? data.explanation.trim() : "";
  if (!expression && !explanation) return undefined;
  const res: IExpressionResponse = { expression: expression };
  if (!!explanation) res.explanation = explanation;
  return res;
}

function isOneLine(text: string): boolean {
  return !!text && text.indexOf("\n") < 0 && text.indexOf("\r") < 0;
}

// Reads the answer of a model: the JSON the system prompt asks for (also inside a ```json fence,
// alone or between lines of prose, extra keys ignored); a fenced block holding only a one-line
// expression; a line "Expression: ..."; or a bare one-line expression. Anything else is undefined -
// an empty result; so is JSON whose expression is empty, except that its explanation is kept
// (expression ""). The expression is trimmed and never "repaired": the check judges it as it came.
export function parseExpressionResponse(text: string): IExpressionResponse | undefined {
  if (typeof text !== "string") return undefined;
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const json = readAIJson(trimmed);
  if (json !== undefined) return readExpressionData(json);
  // a multi-line block is no expression; an "Expression:" line may still name one
  const fenced = getAIFencedBlocks(trimmed).filter(block => isOneLine(block))[0];
  if (fenced !== undefined) return { expression: fenced };
  const lines = trimmed.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].trim().match(/^expression\s*:\s*(.+)$/i);
    if (!!match) {
      const expression = match[1].trim().replace(/^`(.*)`$/, "$1").trim();
      return !!expression ? { expression: expression } : undefined;
    }
  }
  return isOneLine(trimmed) ? { expression: trimmed } : undefined;
}
