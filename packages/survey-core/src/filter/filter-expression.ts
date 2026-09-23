// The grammar knows exactly two escapes, \' and \" (grammar.pegjs, AnyCharacters), and none for the
// backslash itself. A bare " is not allowed inside a single-quoted string either - the character
// class excludes both quotes - so both of them are escaped. A backslash that lands in front of a
// quote, or at the very end in front of the closing one, would be read as that escape and swallow
// the quote: it is dropped. A quick search that loses a backslash is a lesser evil than a filter
// expression the parser refuses, which would take the whole filter down with it.
export function escapeExpressionText(text: string): string {
  return (text || "").replace(/\\+(?=['"]|$)/g, "").replace(/(['"])/g, "\\$1");
}
// OperandMaker.toOperandString (expressions.ts:619) is deliberately not used here: it escapes
// nothing and it leaves the strings "true"/"false" unquoted, which would turn a choice value into
// a boolean.
export function toExpressionConst(value: any): string {
  if (typeof value === "number" || typeof value === "boolean") return value.toString();
  const text = value === undefined || value === null ? "" : value.toString();
  return "'" + escapeExpressionText(text) + "'";
}
