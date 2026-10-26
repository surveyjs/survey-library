import { getLocaleString } from "../surveyStrings";
import { ItemValue } from "../itemvalue";
import { Helpers } from "../helpers";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-filter-fields";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { getFieldChoiceItems } from "./filter-expression";
import { getFilterConditionText, getFilterConditionValueText, getFilterFieldOperators } from "./filter-conditions";

// What a fast mode badge edits its field with. "single" is a list where a click picks one value
// (equal), "multi" a list of checkboxes (anyof), "boolean" the two checkboxes Yes and No (equal, or
// notempty with both checked), "condition" an operator and a value.
export type FilterFieldEditorKind = "boolean" | "multi" | "single" | "condition";
// One entry of a "single", "multi" or "boolean" list: the value the condition holds and the text
// the list and the badge show for it.
export interface IFilterFieldListItem {
  value: any;
  text: string;
}

function isBooleanField(field: IDynamicDataFilterField): boolean {
  return field.fieldType === "boolean" || field.valueType === "boolean";
}
// Decided by the operators the author allows, not by the question type: a dropdown column filters
// by several values at once when it offers anyof, and the author makes it a single pick with
// filterOperators: ["equal"]. A list needs values to list: a field with no choices (yet - a
// choicesByUrl that has not loaded) edits as a condition.
export function getFilterFieldEditorKind(field: IDynamicDataFilterField): FilterFieldEditorKind {
  const operators = getFilterFieldOperators(field);
  if (isBooleanField(field)) return operators.indexOf("equal") > -1 ? "boolean" : "condition";
  if (getFieldChoiceItems(field).length > 0) {
    if (operators.indexOf("anyof") > -1) return "multi";
    if (operators.indexOf("equal") > -1) return "single";
  }
  return "condition";
}
// A boolean field lists its own labels and values (a Boolean question's labelTrue/valueTrue); a
// typeless boolean has no question to ask and gets the library's Yes and No.
function getBooleanItems(field: IDynamicDataFilterField, locale: string): Array<IFilterFieldListItem> {
  const q: any = field.templateQuestion;
  if (!!q && typeof q.getValueTrue === "function") {
    return [{ value: q.getValueTrue(), text: getFilterConditionValueText(field, q.getValueTrue()) },
      { value: q.getValueFalse(), text: getFilterConditionValueText(field, q.getValueFalse()) }];
  }
  return [{ value: true, text: getLocaleString("booleanCheckedLabel", locale) },
    { value: false, text: getLocaleString("booleanUncheckedLabel", locale) }];
}
export function getFilterFieldListItems(field: IDynamicDataFilterField, locale?: string): Array<IFilterFieldListItem> {
  if (isBooleanField(field)) return getBooleanItems(field, locale);
  return getFieldChoiceItems(field).map((item: ItemValue): IFilterFieldListItem => ({ value: item.value, text: item.calculatedText }));
}
// Whether a boolean field may be filtered by "has an answer": its two checkboxes both checked.
export function canFilterFieldSelectAll(field: IDynamicDataFilterField, kind: FilterFieldEditorKind): boolean {
  if (kind === "multi") return true;
  return kind === "boolean" && getFilterFieldOperators(field).indexOf("notempty") > -1;
}
// The values a list editor shows checked for a condition, or undefined when the condition is not
// one the list can show (another operator: noneof over a "multi" field, greater over a boolean).
export function getFilterFieldSelection(field: IDynamicDataFilterField, kind: FilterFieldEditorKind, condition: IFilterCondition): Array<any> | undefined {
  if (!condition) return [];
  if (kind === "single") return condition.operator === "equal" ? [condition.value] : undefined;
  if (kind === "multi") return condition.operator === "anyof" && Array.isArray(condition.value) ? [].concat(condition.value) : undefined;
  if (kind === "boolean") {
    if (condition.operator === "notempty") return getBooleanItems(field, undefined).map((item: IFilterFieldListItem): any => item.value);
    return condition.operator === "equal" ? [condition.value] : undefined;
  }
  return undefined;
}
// The other way round: the condition a list editor's checked values stand for, or undefined for
// none (nothing checked - and a boolean's two checked where the field does not offer notempty).
export function getFilterSelectionCondition(field: IDynamicDataFilterField, kind: FilterFieldEditorKind, values: Array<any>): IFilterCondition | undefined {
  if (!Array.isArray(values) || values.length === 0) return undefined;
  if (kind === "single") return { field: field.valueName, operator: "equal", value: values[0] };
  if (kind === "multi") return { field: field.valueName, operator: "anyof", value: [].concat(values) };
  if (kind === "boolean") {
    if (values.length === 1) return { field: field.valueName, operator: "equal", value: values[0] };
    return canFilterFieldSelectAll(field, kind) ? { field: field.valueName, operator: "notempty" } : undefined;
  }
  return undefined;
}
// The text of a fast mode badge with a condition, in the words of the editor its popup opens:
// "Gender: Female" for one value, "Category: 6" for several, "Quantity: Equals 128" for an operator
// and a value - and for any condition the field's list editor cannot show.
export function getFilterChipText(field: IDynamicDataFilterField, condition: IFilterCondition, locale?: string): string {
  const kind = getFilterFieldEditorKind(field);
  const values = kind !== "condition" ? getFilterFieldSelection(field, kind, condition) : undefined;
  if (!values || values.length === 0) return getFilterConditionText(field, condition, locale);
  const title = !!field.locTitle ? field.locTitle.calculatedText : field.name;
  if (values.length > 1) return title + ": " + values.length;
  const item = kind === "boolean" ? getBooleanItems(field, locale).filter((i: IFilterFieldListItem): boolean => Helpers.isTwoValueEquals(i.value, values[0]))[0] : undefined;
  return title + ": " + (!!item ? item.text : getFilterConditionValueText(field, values[0]));
}
