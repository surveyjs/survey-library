import { getLocaleString } from "../surveyStrings";
import { ItemValue } from "../itemvalue";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-fields";
import {
  getConditionDefaultOperator, getConditionOperatorNames, isConditionOperatorEnabled, isQuestionClassContains
} from "../conditions/conditionOperators";

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
