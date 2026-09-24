import { settings } from "../settings";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-fields";

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
export function buildSearchFragment(field: IDynamicDataFilterField, text: string): string {
  const variable = "{" + field.valueName + "}";
  const items = getFieldChoiceItems(field);
  if (items.length > 0) {
    // A choice field matches on what the user sees, not on what is stored. displayValue() cannot do
    // this - functionsfactory.ts:695 resolves survey questions, not record fields - so the match is
    // computed here and the matching values are expanded into the expression.
    const values: Array<any> = [];
    items.forEach((item: any): void => {
      if (containsText(item.calculatedText, text)) values.push(item.value);
    });
    // This field cannot contribute to the "or".
    if (values.length === 0) return "";
    return variable + " anyof [" + values.map((v: any) => toExpressionConst(v)).join(", ") + "]";
  }
  return variable + " contains " + toExpressionConst(text);
}
// The same case rule the expression language itself applies, so the display match and the value
// match never disagree.
function containsText(value: string, text: string): boolean {
  if (!value) return false;
  if (settings.comparator.caseSensitive) return value.indexOf(text) > -1;
  return value.toLowerCase().indexOf(text.toLowerCase()) > -1;
}
// The choices the respondent sees for the field: the ones the source resolved for it, else those of
// the question that supplies the editor, else none. A field with no choices is searched by
// "contains" over the raw value - which is also what a choicesByUrl field gets: neither a FilterField's
// template question nor a matrix column's is ever run, only the questions a respondent answers are.
// The built-in items - "None", "Other", "Select All", "Refuse", "Don't know" - are left out:
// they are gestures over the value set and not values a record holds, so an anyof over one of them
// matches nothing, and counting one as a match would also take the "false" answer away from a field
// whose real choices have nothing to offer.
function getFieldChoiceItems(field: IDynamicDataFilterField): Array<any> {
  const q: any = field.templateQuestion;
  const choices: Array<any> = Array.isArray(field.choices) ? field.choices : (!!q ? q.visibleChoices : undefined);
  if (!Array.isArray(choices)) return [];
  if (!q || typeof q.isBuiltInChoice !== "function") return choices;
  return choices.filter((item: any): boolean => !q.isBuiltInChoice(item));
}
