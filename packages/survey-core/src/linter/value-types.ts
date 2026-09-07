import { getLocaleString } from "survey-core";
import { getPropertyOnKey, isPropertyOn, isSelectBase } from "./metadata";
import { ChoicesInfo, getEffectiveType, ValueTypeInfo, ScalarType } from "./symbols";
import { ILintResolvedSettings } from "./lint-settings";

// The class registering the built-in item toggles and their legacy aliases (hasOther, hasNone).
const SELECT_BASE_CLASS = "selectbase";

// The built-in items a select question adds to its listed choices (question_baseselect.ts).
// Each one is known here by the property that switches it on, the locale string holding its
// default caption, and where its value comes from: the None/Refuse/Don't know values are
// settings the application may change, the Other value is a constant of the core.
interface SpecialItemDef {
  item: string;
  toggleProp: string;
  textKey: string;
  getValue(lintSettings: ILintResolvedSettings): any;
}

const SPECIAL_ITEMS: Array<SpecialItemDef> = [
  { item: "other", toggleProp: "showOtherItem", textKey: "otherItemText", getValue: () => "other" },
  { item: "none", toggleProp: "showNoneItem", textKey: "noneItemText", getValue: s => s.noneItemValue },
  { item: "refuse", toggleProp: "showRefuseItem", textKey: "refuseItemText", getValue: s => s.refuseItemValue },
  { item: "dontknow", toggleProp: "showDontKnowItem", textKey: "dontKnowItemText", getValue: s => s.dontKnowItemValue },
];

function findSpecialItem(item: string): SpecialItemDef {
  return SPECIAL_ITEMS.filter(def => def.item === item)[0];
}

function isSpecialItemOn(json: any, item: string): boolean {
  return isPropertyOn(json, SELECT_BASE_CLASS, findSpecialItem(item).toggleProp);
}

// The key the author wrote to show the item (showOtherItem or its alias hasOther), so a
// finding names what is in the JSON; the registered name when the item is not on at all.
export function getSpecialItemToggleProp(json: any, item: string): string {
  const def = findSpecialItem(item);
  return getPropertyOnKey(json, SELECT_BASE_CLASS, def.toggleProp) || def.toggleProp;
}

// The caption the item renders with by default - the English one, as the rest of a finding
// is English too, and the application may have replaced it.
export function getSpecialItemText(item: string): string {
  return getLocaleString(findSpecialItem(item).textKey, "en");
}

export function hasOtherItem(json: any): boolean {
  return isSpecialItemOn(json, "other");
}

const NUMERIC_INPUT_TYPES: { [inputType: string]: boolean } = { number: true, range: true };
const DATE_INPUT_TYPES: { [inputType: string]: boolean } = {
  date: true, "datetime-local": true, month: true, time: true, week: true,
};

// time and week are excluded on purpose: the runtime compares them with its own arithmetic
// (getWeekTimeNumber in question_text.ts), which a plain operator call does not reproduce.
const COMPARABLE_RANGE_INPUT_TYPES: { [inputType: string]: boolean } = {
  number: true, range: true, date: true, "datetime-local": true, month: true,
};

// Mirrors isMinMaxType (question_text.ts): the inputTypes whose editor offers min/max, and the
// only ones whose min/max/step properties the runtime applies at all.
export function isMinMaxInputType(inputType: string): boolean {
  return !!NUMERIC_INPUT_TYPES[inputType] || !!DATE_INPUT_TYPES[inputType];
}

// The min/max bounds a plain operator compares the way the runtime does.
export function isComparableRangeInputType(inputType: string): boolean {
  return !!COMPARABLE_RANGE_INPUT_TYPES[inputType];
}

export function getItemValueRaw(item: any): any {
  if (item === null || item === undefined) return undefined;
  if (typeof item === "object") return item.value;
  return item;
}

export function getStaticChoiceValues(arr: any): Array<any> {
  if (!Array.isArray(arr)) return [];
  const res: Array<any> = [];
  arr.forEach(item => {
    const value = getItemValueRaw(item);
    if (value !== undefined && value !== null) res.push(value);
  });
  return res;
}

function inferScalarFromValues(values: Array<any>): ScalarType {
  if (!values.length) return "any";
  let allNumbers = true;
  let allStrings = true;
  values.forEach(value => {
    if (typeof value !== "number") allNumbers = false;
    if (typeof value !== "string") allStrings = false;
  });
  if (allNumbers) return "number";
  if (allStrings) return "string";
  return "any";
}

export function getChoicesInfo(json: any, type: string): ChoicesInfo | undefined {
  const isSelect = isSelectBase(type);
  const isColumnLike = type === "matrixdropdowncolumn";
  if (!isSelect && !isColumnLike) return undefined;
  return {
    staticValues: getStaticChoiceValues(json.choices),
    hasChoicesByUrl: !!json.choicesByUrl && !!json.choicesByUrl.url,
    lazy: json.choicesLazyLoadEnabled === true,
    carryForwardFrom: json.choicesFromQuestion || undefined,
    carryForwardValuesFrom: json.choiceValuesFromQuestion || undefined,
    carryForwardTextsFrom: json.choiceTextsFromQuestion || undefined,
    shownSpecialItems: SPECIAL_ITEMS.filter(def => isSpecialItemOn(json, def.item)).map(def => def.item),
  };
}

export function showsSpecialItem(info: ChoicesInfo, item: string): boolean {
  return info.shownSpecialItems.indexOf(item) > -1;
}

export interface SpecialChoiceDef {
  // which built-in item this is, independent of the value it carries
  item: string;
  value: any;
}

// The built-in items the question adds to its listed choices, with the value each one holds.
export function getSpecialChoiceDefs(info: ChoicesInfo,
  lintSettings: ILintResolvedSettings): Array<SpecialChoiceDef> {
  return SPECIAL_ITEMS.filter(def => showsSpecialItem(info, def.item))
    .map(def => ({ item: def.item, value: def.getValue(lintSettings) }));
}

// Values a comparison against this question may legitimately use besides static choices.
export function getSpecialChoiceValues(info: ChoicesInfo, lintSettings: ILintResolvedSettings): Array<any> {
  return getSpecialChoiceDefs(info, lintSettings).map(def => def.value);
}

// The inputType a text question collects with, defaulted the way the model defaults it.
export function getInputType(json: any): string {
  return ((json ? json.inputType : undefined) || "text").toLowerCase();
}

export function getValueTypeInfo(type: string, json: any): ValueTypeInfo {
  switch(type) {
    case "text": {
      const inputType = getInputType(json);
      if (NUMERIC_INPUT_TYPES[inputType]) return { shape: "scalar", scalarType: "number" };
      if (DATE_INPUT_TYPES[inputType]) return { shape: "scalar", scalarType: "date" };
      return { shape: "scalar", scalarType: "string" };
    }
    case "comment":
    case "signaturepad":
      return { shape: "scalar", scalarType: "string" };
    case "boolean":
      if (json.valueTrue !== undefined || json.valueFalse !== undefined) {
        return { shape: "scalar", scalarType: "any" };
      }
      return { shape: "scalar", scalarType: "boolean" };
    case "radiogroup":
    case "dropdown":
    case "buttongroup":
      return { shape: "scalar", scalarType: inferScalarFromValues(getStaticChoiceValues(json.choices)) };
    case "imagepicker":
      if (json.multiSelect === true) return { shape: "array" };
      return { shape: "scalar", scalarType: inferScalarFromValues(getStaticChoiceValues(json.choices)) };
    case "checkbox":
    case "tagbox":
    case "ranking":
    case "file":
      return { shape: "array" };
    case "rating": {
      const rateValues = getStaticChoiceValues(json.rateValues);
      if (rateValues.length > 0) return { shape: "scalar", scalarType: inferScalarFromValues(rateValues) };
      return { shape: "scalar", scalarType: "number" };
    }
    case "slider":
      if (json.sliderType === "range") return { shape: "array" };
      return { shape: "scalar", scalarType: "number" };
    case "matrix":
    case "matrixdropdown":
    case "multipletext":
      return { shape: "object" };
    case "matrixdynamic":
    case "paneldynamic":
      return { shape: "array" };
    case "html":
    case "image":
      return { shape: "none" };
    case "expression":
      return { shape: "unknown" };
    default:
      return { shape: "unknown" };
  }
}

// How many choices can be selected at once, or undefined when the JSON does not list them all.
// The None/Refuse/Don't know items are exclusive - selecting one clears the rest - and so is a
// choice marked isExclusive; Other is an ordinary selection.
export function getSelectableChoiceCount(record: { choicesInfo?: ChoicesInfo, json: any }): number | undefined {
  const info = record.choicesInfo;
  if (!info || info.hasChoicesByUrl || info.lazy || info.carryForwardFrom ||
    info.carryForwardValuesFrom || info.staticValues.length === 0) return undefined;
  const items = record.json ? record.json.choices : undefined;
  if (!Array.isArray(items)) return undefined;
  let count = 0;
  items.forEach(item => {
    if (getItemValueRaw(item) === undefined) return;
    if (!!item && typeof item === "object" && item.isExclusive === true) return;
    count++;
  });
  return count + (showsSpecialItem(info, "other") ? 1 : 0);
}

export function isTextInputQuestion(record: { type: string, effectiveType?: string, json: any }): boolean {
  const type = getEffectiveType(record);
  if (type === "comment") return true;
  if (type !== "text") return false;
  const inputType = getInputType(record.json);
  return !NUMERIC_INPUT_TYPES[inputType] && !DATE_INPUT_TYPES[inputType];
}
