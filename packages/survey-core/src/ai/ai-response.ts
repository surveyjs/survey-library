const fenceRegex = /^```[a-zA-Z]*[ \t]*\r?\n?([\s\S]*?)\r?\n?```$/;

export function isAIObject(data: any): boolean {
  return !!data && typeof data === "object" && !Array.isArray(data);
}
function parseObject(text: string): any {
  if (!text || text[0] !== "{") return undefined;
  let data: any;
  try {
    data = JSON.parse(text);
  } catch{
    return undefined;
  }
  return isAIObject(data) ? data : undefined;
}

// The inside of a text that is one fenced block (```json ... ```), trimmed; undefined for other text.
export function getAIFencedText(text: string): string {
  if (typeof text !== "string") return undefined;
  const fence = text.trim().match(fenceRegex);
  return !!fence ? fence[1].trim() : undefined;
}

// The JSON object a model's text holds: the whole text, or a fenced block that is only that object.
// Anything else is undefined; a feature may then read the text in looser ways of its own.
export function readAIJson(text: string): any {
  if (typeof text !== "string") return undefined;
  const res = parseObject(text.trim());
  if (res !== undefined) return res;
  const fenced = getAIFencedText(text);
  return fenced !== undefined ? parseObject(fenced) : undefined;
}
