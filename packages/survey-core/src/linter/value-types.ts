import { isSelectBase } from "./metadata";
import { ChoicesInfo, getEffectiveType, ValueTypeInfo, ScalarType } from "./symbols";
import { ILintResolvedSettings } from "./lint-settings";

const NUMERIC_INPUT_TYPES: { [inputType: string]: boolean } = { number: true, range: true };
const DATE_INPUT_TYPES: { [inputType: string]: boolean } = {
  date: true, "datetime-local": true, month: true, time: true, week: true,
};

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
    showOtherItem: json.showOtherItem === true || json.hasOther === true,
    showNoneItem: json.showNoneItem === true || json.hasNone === true,
    showRefuseItem: json.showRefuseItem === true,
    showDontKnowItem: json.showDontKnowItem === true,
  };
}

// Values a comparison against this question may legitimately use besides static choices.
export function getSpecialChoiceValues(info: ChoicesInfo, lintSettings: ILintResolvedSettings): Array<any> {
  const res: Array<any> = [];
  if (info.showOtherItem) res.push("other");
  if (info.showNoneItem) res.push(lintSettings.noneItemValue);
  if (info.showRefuseItem) res.push(lintSettings.refuseItemValue);
  if (info.showDontKnowItem) res.push(lintSettings.dontKnowItemValue);
  return res;
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

export function isTextInputQuestion(record: { type: string, effectiveType?: string, json: any }): boolean {
  const type = getEffectiveType(record);
  if (type === "comment") return true;
  if (type !== "text") return false;
  const inputType = getInputType(record.json);
  return !NUMERIC_INPUT_TYPES[inputType] && !DATE_INPUT_TYPES[inputType];
}
