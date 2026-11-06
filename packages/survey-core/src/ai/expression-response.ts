import { getAIFencedBlocks, getAIFencedText, isAIObject, parseAIObject } from "./ai-response";

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

// Reads the answer of a model, in this order: the JSON the system prompt asks for, as the whole text
// or one fenced block (extra keys ignored); a whole-text fenced block holding a one-line expression; a
// line "Expression: ..."; in prose, the first fenced block whose JSON is an answer, else the first
// one-line fenced block - a block in prose may be an example or context, so the Expression line goes
// first; a bare one-line expression. Anything else is undefined - an empty result; so is JSON whose
// expression is empty, except that its explanation is kept (expression ""). The expression is trimmed
// and never "repaired": the check judges it as it came.
export function parseExpressionResponse(text: string): IExpressionResponse | undefined {
  if (typeof text !== "string") return undefined;
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const fenced = getAIFencedText(trimmed);
  const json = parseAIObject(trimmed) || parseAIObject(fenced);
  if (json !== undefined) return readExpressionData(json);
  if (isOneLine(fenced)) return { expression: fenced };
  const lines = trimmed.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].trim().match(/^expression\s*:\s*(.+)$/i);
    if (!!match) {
      const expression = match[1].trim().replace(/^`(.*)`$/, "$1").trim();
      return !!expression ? { expression: expression } : undefined;
    }
  }
  const blocks = getAIFencedBlocks(trimmed);
  for (let i = 0; i < blocks.length; i++) {
    const res = readExpressionData(parseAIObject(blocks[i]));
    if (!!res) return res;
  }
  // a multi-line block is no expression
  const oneLine = blocks.filter(block => isOneLine(block))[0];
  if (oneLine !== undefined) return { expression: oneLine };
  return isOneLine(trimmed) ? { expression: trimmed } : undefined;
}
