// ``` and an optional language tag: a word followed by a line break or spaces; "```age({b}) >= 18```" has none
const fenceOpen = "```(?:[a-zA-Z][\\w+-]*(?:[ \\t]*\\r?\\n|[ \\t]+))?";
const fenceRegex = new RegExp("^" + fenceOpen + "([\\s\\S]*?)\\r?\\n?```$");

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

// The insides of every fenced block of a text, in order, trimmed: a model often puts its answer in
// one between lines of prose ("Here is the expression:", then the block).
export function getAIFencedBlocks(text: string): Array<string> {
  if (typeof text !== "string") return [];
  const res: Array<string> = [];
  const regex = new RegExp(fenceOpen + "([\\s\\S]*?)```", "g");
  let match: RegExpExecArray;
  while(!!(match = regex.exec(text))) {
    res.push(match[1].trim());
  }
  return res;
}

// The JSON object a model's text holds: the whole text, else the first fenced block that is only an
// object, alone or between lines of prose. Anything else is undefined; a feature may then read the
// text in looser ways of its own.
export function readAIJson(text: string): any {
  if (typeof text !== "string") return undefined;
  const res = parseObject(text.trim());
  if (res !== undefined) return res;
  const blocks = getAIFencedBlocks(text);
  for (let i = 0; i < blocks.length; i++) {
    const data = parseObject(blocks[i]);
    if (data !== undefined) return data;
  }
  return undefined;
}
