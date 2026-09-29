import { getLocaleString } from "../surveyStrings";
import { ItemValue } from "../itemvalue";
import { QuestionValueType } from "../question";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-fields";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import {
  getConditionDefaultOperator, getConditionOperatorNames, isConditionOperatorEnabled, isQuestionClassContains
} from "../conditions/conditionOperators";
import { ConditionEditorItem, ConditionEditorItemsBuilder } from "../conditions/conditionEditorItems";
import { toExpressionConst } from "./filter-expression";

// The label a condition editor shows for one operator, e.g. "equal" -> "Equals". Written out as
// literal keys (not "conditionOperator" + operator, capitalized) so survey-utils check-strings -
// which counts a string literal in the scanned sources as usage - can see all 13 keys are used;
// the same reason src/linter/value-types.ts:20-25 keeps its locale keys as a literal table instead
// of building them. One entry per name getConditionOperatorNames() returns (conditionOperators.ts).
const OPERATOR_TITLE_KEYS: { [operator: string]: string } = {
  empty: "conditionOperatorEmpty",
  notempty: "conditionOperatorNotempty",
  equal: "conditionOperatorEqual",
  notequal: "conditionOperatorNotequal",
  contains: "conditionOperatorContains",
  notcontains: "conditionOperatorNotcontains",
  anyof: "conditionOperatorAnyof",
  noneof: "conditionOperatorNoneof",
  allof: "conditionOperatorAllof",
  greater: "conditionOperatorGreater",
  less: "conditionOperatorLess",
  greaterorequal: "conditionOperatorGreaterorequal",
  lessorequal: "conditionOperatorLessorequal"
};

// A locale that has not translated a key falls back to English, the way getLocaleString always
// does. An operator the table does not know (a future operator, a typo) has no key to look up, so
// the operator name itself is the best title there is.
export function getConditionOperatorTitle(operator: string, locale?: string): string {
  const key = OPERATOR_TITLE_KEYS[operator];
  return !!key ? getLocaleString(key, locale) : operator;
}

// The operator a new condition on this field starts with. Same rule Creator's condition editor
// uses (condition-survey.ts, getDefaultOperatorByQuestion): by the resolved question type, falling
// back to settings.logic.defaultOperators.default. A typeless field runs on a text question, so it
// starts the same way any other text field does.
export function getFilterFieldDefaultOperator(field: IDynamicDataFilterField): string {
  return getConditionDefaultOperator(field.fieldType);
}

// The operators a typeless field never offers, on top of whatever its (always "text") editor type
// already excludes. A field with no authored fieldType edits as plain text - contains/notcontains
// make sense there - but the value is really a number, a date or a boolean underneath, and the
// respondent's raw text answer to "contains" would rarely be what they mean by it. A boolean also
// loses the ordering operators: "true" and "false" have no order a text comparison could honor.
function narrowTypelessOperators(names: Array<string>, valueType: string): Array<string> {
  if (valueType !== "number" && valueType !== "date" && valueType !== "boolean") return names;
  let res = names.filter((op: string): boolean => op !== "contains" && op !== "notcontains");
  if (valueType === "boolean") {
    res = res.filter((op: string): boolean =>
      op !== "less" && op !== "greater" && op !== "lessorequal" && op !== "greaterorequal");
  }
  return res;
}

// The condition operators a field's value editor takes, in the order editors have always listed
// them (getConditionOperatorNames). qType is read once, off the editor json the default operator
// would produce - the same thing Creator's condition editor does (condition-survey.ts:351) - and
// not per operator: asking per operator would give every text field anyof (its checkbox editor
// json) and take contains away from a checkbox field (its editor json for contains is a
// radiogroup).
export function getFilterFieldOperators(field: IDynamicDataFilterField): Array<string> {
  const qType = getFilterValueEditorJson(field, getFilterFieldDefaultOperator(field)).type;
  const names = getConditionOperatorNames().filter((op: string): boolean => isConditionOperatorEnabled(qType, op));
  return field.isTypeless ? narrowTypelessOperators(names, field.valueType) : names;
}

// The condition-authoring properties a survey question keeps that a value editor never needs:
// visibility/enable logic, validation, defaults and write-back rules all belong to the question
// this field renders in the real survey, not to the throwaway question that only reads one value
// for the condition. Ported from survey-creator-core's SurveyHelper.deleteConditionProperties /
// updateQuestionJson (survey-helper.ts:282-314), plus the properties that list adds beyond that:
// isRequired/requiredIf/validators/defaultValue/defaultValueExpression/setValueIf/
// setValueExpression/resetValueIf/name. Applied to the top-level json and, since none of these
// besides visibleIf/enableIf ever exists on an ItemValue anyway, reused as-is for each choice/
// row/column item.
const CONDITION_ONLY_PROPS = [
  "visible", "visibleIf", "readOnly", "enableIf", "valueName",
  "choicesVisibleIf", "choicesEnableIf", "columnsVisibleIf", "columnsEnableIf",
  "rowsVisibleIf", "rowsEnableIf", "width", "minWidth", "maxWidth",
  "isRequired", "requiredIf", "validators", "defaultValue", "defaultValueExpression",
  "setValueIf", "setValueExpression", "resetValueIf", "name", "showCommentArea"
];
function cleanConditionJsonItem(json: any): void {
  CONDITION_ONLY_PROPS.forEach((prop: string): void => { delete json[prop]; });
}
function cleanConditionJsonArray(items: any): void {
  if (!Array.isArray(items)) return;
  items.forEach((item: any): void => {
    if (!!item && typeof item === "object") cleanConditionJsonItem(item);
  });
}
// choicesOrder/rowOrder "random" would reshuffle the editor's choices/rows on every render - fine
// for the real question, pointless and confusing for a one-shot value editor.
function cleanRandomOrder(json: any): void {
  ["choicesOrder", "rowOrder"].forEach((prop: string): void => {
    if (json[prop] === "random") delete json[prop];
  });
}
function cleanConditionJson(json: any): void {
  json.storeOthersAsComment = false;
  cleanConditionJsonItem(json);
  cleanRandomOrder(json);
  cleanConditionJsonArray(json.choices);
  cleanConditionJsonArray(json.rows);
  cleanConditionJsonArray(json.columns);
}

// The JSON that creates the question editing one field's condition value, for the given operator.
// A typeless field always edits as plain text - it runs on a text question and never had a real
// editor of its own - whatever the operator; the value is coerced to its real type only when the
// condition is turned into an expression (FilterConditionItem). Otherwise this is templateQuestion's
// own condition json (Question.getConditionJson), adjusted the way Creator's condition editor
// adjusts it (condition-survey.ts:779-814): an expression question edits as text, and anyof/noneof
// switch a non-checkbox select (a dropdown, a ranking) to a checkbox editor - a tagbox is already a
// checkbox by class and keeps its own type, and a checkbox itself just keeps checkbox.
export function getFilterValueEditorJson(field: IDynamicDataFilterField, operator: string): any {
  if (field.isTypeless) return { type: "text" };
  const question = field.templateQuestion;
  const json = question.getConditionJson(operator) || {};
  if (json.type === "expression") json.type = "text";
  if ((operator === "anyof" || operator === "noneof") && !isQuestionClassContains(json.type, ["checkbox"], [])) {
    json.type = "checkbox";
  }
  // choicesFromQuestion names another question by id, which means nothing outside the survey this
  // value editor is never part of; templateQuestion.visibleChoices already carried it out, so the
  // resolved list is used directly instead of the reference.
  if (json.choicesFromQuestion) {
    json.choices = ItemValue.getData(question.visibleChoices);
    delete json.choicesFromQuestion;
  }
  // A field's own choices - set on a matrix column or a standalone FilterField when they are not
  // the template question's own - take over whatever the template contributed.
  if (Array.isArray(field.choices)) {
    json.choices = ItemValue.getData(field.choices);
  }
  cleanConditionJson(json);
  return json;
}

// A field's own valueName is the key its condition is authored under and the variable its
// expression names it by, but two fields can share one (a nested bound field named the same as a
// standalone one - filter-control-integration.test.ts:158). The first field with a given valueName
// owns it: later duplicates are unreachable, the same rule getFieldByName's dotted-path lookup
// already applies one level up. Exported so the condition editor (a later task) can hide the
// duplicates instead of showing an unreachable one.
export function getFieldsByValueName(fields: Array<IDynamicDataFilterField>): { [valueName: string]: IDynamicDataFilterField } {
  const res: { [valueName: string]: IDynamicDataFilterField } = {};
  (fields || []).forEach((field: IDynamicDataFilterField): void => {
    if (!Object.prototype.hasOwnProperty.call(res, field.valueName)) res[field.valueName] = field;
  });
  return res;
}

// Whether val is a string that reads as a real number: Number(), not parseFloat() - parseFloat
// stops at the first character it cannot read and turns "0x1A" into 0 rather than 26, and a
// blank/whitespace-only string into NaN rather than "not a number". Number("") and Number("  ")
// are both 0, which is exactly the false positive a blank value must not become, so blankness is
// rejected before Number() ever runs. Number("0x1A") is 26 - a deliberate choice to read a hex
// literal correctly rather than to reproduce ConditionEditorItem.valToText's text-authoring rule
// (which keeps a leading zero a string so a code like "007" is not misread as 7): a value editor's
// input is not that text-authoring context, and Number is otherwise the more correct reader here.
function coerceToNumber(val: any): number {
  if (typeof val !== "string" || val.trim() === "") return undefined;
  const num = Number(val);
  return isFinite(num) ? num : undefined;
}
// A condition's value is authored as whatever the value editor produced - a text question for a
// typeless field always answers a string - so it is coerced to the field's real type here, once,
// at the point the condition becomes an expression. Kept deliberately simple: only the two
// mismatches a typeless field can produce (a numeric string, "true"/"false") are handled, and the
// same coercion is applied whatever the field's fieldType is - a typed text field whose valueType
// happens to be "number" benefits from it too, not just a typeless one.
function coerceConditionValue(valueType: QuestionValueType, value: any): any {
  if (Array.isArray(value)) return value.map((v: any): any => coerceConditionValue(valueType, v));
  if (valueType === "number") {
    const num = coerceToNumber(value);
    if (num !== undefined) return num;
  }
  if (valueType === "boolean" && (value === "true" || value === "false")) return value === "true";
  return value;
}

// One IFilterCondition as a row ConditionEditorItemsBuilder.itemsToExpression can write out. The
// variable is the condition's field (a valueName, possibly dotted - "mt.city"), which is already
// exactly what ConditionEditorItem.questionName is read back as text, so no getVariableName
// override is needed the way SurveyConditionEditorItem needs one for a differing name/valueName.
// getValueText is overridden because the base class's valToText only ever sees text-editor input
// (a number is typed in, so a numeric string is never quoted) - a filter condition's value can
// already be a real number, boolean or array from a structured value editor, and valToText would
// mishandle those (e.g. it would quote an array's own bracket text). toExpressionConst is exact
// for any already-typed value instead.
export class FilterConditionItem extends ConditionEditorItem {
  constructor(field: IDynamicDataFilterField, condition: IFilterCondition) {
    super();
    this.questionName = condition.field;
    this.operator = condition.operator;
    this.value = coerceConditionValue(field.valueType, condition.value);
  }
  public getValueText(): string {
    const val = this.value;
    if (Array.isArray(val)) return "[" + val.map((v: any): string => toExpressionConst(v)).join(", ") + "]";
    return toExpressionConst(val);
  }
}

// A control's own conditions (as opposed to a preset's stored expression text) to one expression,
// joined by "and" - conditions are always "and": only a preset's own text can hold an "or". A
// condition on a field the current field list no longer has is dropped rather than kept as dead
// text, and so is a condition that is not ready yet (no value where its operator needs one) - not
// left for ConditionEditorItemsBuilder.itemsToExpression's own rule of stopping at the first one
// that is not ready, which would otherwise hide every ready condition that happens to follow an
// unready one.
export function conditionsToExpression(conditions: Array<IFilterCondition>, fields: Array<IDynamicDataFilterField>): string {
  const fieldsByValueName = getFieldsByValueName(fields);
  const items: Array<ConditionEditorItem> = [];
  (conditions || []).forEach((condition: IFilterCondition): void => {
    const field = fieldsByValueName[condition.field];
    if (!field) return;
    const item = new FilterConditionItem(field, condition);
    if (!item.isReady) return;
    items.push(item);
  });
  return ConditionEditorItemsBuilder.itemsToExpression(items);
}

// Conditions that come from outside the control - a saved uiState - checked against the fields it
// has now, with the same rules the control's own edits and parseFilterExpression follow: a field
// that is no longer there, a second condition on a field that already has one, or an operator that
// field does not offer is dropped (not the whole list: the rest is still what the respondent asked
// for). The value is coerced here once, by the same coerceConditionValue composition uses, so the
// restored condition holds what the edit would have held and not the raw text a JSON round trip or
// a hand-written state carries. An array value comes out as a new array.
export function normalizeFilterConditions(conditions: Array<IFilterCondition>, fields: Array<IDynamicDataFilterField>): Array<IFilterCondition> {
  const fieldsByValueName = getFieldsByValueName(fields);
  const seenValueNames: { [valueName: string]: boolean } = {};
  const res: Array<IFilterCondition> = [];
  (Array.isArray(conditions) ? conditions : []).forEach((condition: IFilterCondition): void => {
    if (!condition || typeof condition !== "object") return;
    const valueName = condition.field;
    if (!Object.prototype.hasOwnProperty.call(fieldsByValueName, valueName)) return;
    if (Object.prototype.hasOwnProperty.call(seenValueNames, valueName)) return;
    const field = fieldsByValueName[valueName];
    if (getFilterFieldOperators(field).indexOf(condition.operator) === -1) return;
    seenValueNames[valueName] = true;
    // coerceConditionValue maps an array into a new one, so the caller's array is never shared.
    res.push({ field: valueName, operator: condition.operator, value: coerceConditionValue(field.valueType, condition.value) });
  });
  return res;
}

// The structural half of parsing a preset's expression - whether the text decomposes into rows at
// all - depends only on the text: build() with no hasValue turns away nothing by name, so the same
// text always parses to the same rows whatever fields exist at the moment. A bound control's field
// list can change under it with no notification (a matrix row added or removed), so this is the
// only part of parseFilterExpression safe to remember between calls; which of those rows still
// name a real field, and whether their operators are still allowed, is checked fresh every time.
const filterExpressionParseCache: Map<string, Array<ConditionEditorItem>> = new Map<string, Array<ConditionEditorItem>>();
function buildFilterExpressionItems(text: string): Array<ConditionEditorItem> {
  const cached = filterExpressionParseCache.get(text);
  if (!!cached) return cached;
  const items = new ConditionEditorItemsBuilder().build(text);
  filterExpressionParseCache.set(text, items);
  return items;
}

// A preset's expression as the conditions it edits with, or null when it is not that kind of text:
// an "or", a comparison of two fields, a function call, a condition naming a field the control does
// not have, two conditions on the same field, or a condition whose operator that field does not
// offer. null (not []) tells the caller the text is raw and has to stay raw - a "" text is the one
// case that legitimately means "no conditions", so it is answered before the parser ever runs.
export function parseFilterExpression(text: string, fields: Array<IDynamicDataFilterField>): Array<IFilterCondition> | null {
  if (!text) return [];
  const items = buildFilterExpressionItems(text);
  // build() also answers [] for a non-empty text it cannot decompose (an "or", a function call) -
  // text is non-empty here, so an empty result can only be that case.
  if (items.length === 0) return null;
  const fieldsByValueName = getFieldsByValueName(fields);
  const seenValueNames: { [valueName: string]: boolean } = {};
  const res: Array<IFilterCondition> = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (i > 0 && item.conjunction !== "and") return null;
    const valueName = item.questionName;
    if (Object.prototype.hasOwnProperty.call(seenValueNames, valueName)) return null;
    seenValueNames[valueName] = true;
    const field = fieldsByValueName[valueName];
    if (!field) return null;
    if (getFilterFieldOperators(field).indexOf(item.operator) === -1) return null;
    // item.value is read straight off the cached, module-wide parse (buildFilterExpressionItems):
    // an array value must be copied out, or a caller that mutates its own condition's value (T7/T8
    // keep parse results as their own conditions) would corrupt every later parse of this same text,
    // in every control that happens to share it.
    const value = Array.isArray(item.value) ? item.value.slice() : item.value;
    res.push({ field: valueName, operator: item.operator, value });
  }
  return res;
}
