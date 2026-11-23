import { getInputValueType, getLocaleString } from "survey-core";
import { getPropertyOnKey, isPropertyOn, isSelectBase } from "./metadata";
import { ChoicesInfo, getEffectiveType } from "./symbols";
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

// The inputTypes whose editor offers min/max, and the only ones whose min/max/step properties
// the runtime applies at all (isMinMaxType in question_text.ts): the number and date kinds.
export function isMinMaxInputType(inputType: string): boolean {
  return getInputValueType(inputType) !== "string";
}

// The min/max bounds a plain operator compares the way the runtime does. time and week are
// excluded on purpose: the runtime compares them with its own arithmetic (getWeekTimeNumber in
// question_text.ts), which a plain operator call does not reproduce.
export function isComparableRangeInputType(inputType: string): boolean {
  const kind = getInputValueType(inputType);
  if (kind === "number") return true;
  return kind === "date" && inputType !== "time" && inputType !== "week";
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
  return getInputValueType(getInputType(record.json)) === "string";
}
