// Shared helpers for writing SurveyJS expressions.

// A literal for a SurveyJS expression, or `undefined` when the value cannot be written as one. A
// number or boolean is written bare; anything else is a quoted string. A number JavaScript writes in
// exponent notation, such as 1e-7 or 1e+21, cannot be written: survey-core's expressions have no
// exponent, and would read the condition as invalid.
//
// survey-core's string literal knows two escapes, `\'` and `\"`; every other backslash is literal,
// so `\\` stands for two backslashes. Escaping each `'` is therefore enough, and a backslash before
// an apostrophe survives it: `a\'b` is written `'a\\'b'` and reads back as `a\'b`. Two values
// cannot be written at all: one ending in `\`, whose last backslash would escape the closing quote,
// and one holding `\"`, which would read back as `"`.
export function formatLiteral(value: unknown): string | undefined {
  if (typeof value === "number" && String(value).includes("e")) return undefined;
  if ((typeof value === "number" && Number.isFinite(value)) || typeof value === "boolean") return String(value);
  const text = String(value ?? "");
  if (text.endsWith("\\") || text.includes("\\\"")) return undefined;
  return `'${text.replace(/'/g, "\\'")}'`;
}
