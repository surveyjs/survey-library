import type { QuestionValueType } from "./question";

// A leaf module: the value-type rules the runtime applies to a live question, written as pure
// functions over the JSON, so that code which must not build a model (the linter) uses the same rules.
// It imports nothing at runtime.

const numberInputTypes = ["number", "range"];
const dateInputTypes = ["date", "datetime-local", "month", "time", "week"];

// The kind of value a text question with this inputType stores. Only the number and date kinds
// carry min/max/step. This is the value type, not "is it free text": QuestionTextModel.isTextInput
// and the text/regex validators keep their own lists.
export function getInputValueType(inputType: string): "number" | "date" | "string" {
  if (typeof inputType !== "string" || !inputType) return "string";
  const t = inputType.toLowerCase();
  if (numberInputTypes.indexOf(t) > -1) return "number";
  if (dateInputTypes.indexOf(t) > -1) return "date";
  return "string";
}

export type QuestionValueShape = "scalar" | "array" | "object" | "none" | "unknown";
export interface IQuestionValueTypeInfo {
  shape: QuestionValueShape;
  // only for the "scalar" shape; "any" when the JSON does not pin the value to one type
  scalarType?: Exclude<QuestionValueType, "array" | "object"> | "any";
}

// Private copies of the linter's choice helpers (src/linter/value-types.ts); they are not public API.
function getItemValueRaw(item: any): any {
  if (item === null || item === undefined) return undefined;
  if (typeof item === "object") return item.value;
  return item;
}
function getStaticChoiceValues(arr: any): Array<any> {
  if (!Array.isArray(arr)) return [];
  const res: Array<any> = [];
  arr.forEach(item => {
    const value = getItemValueRaw(item);
    if (value !== undefined && value !== null) res.push(value);
  });
  return res;
}
// Every listed value counts, unlike getScalarValueType (question.ts), which reads the first one:
// a JSON that mixes types does not pin the value to one type.
function inferScalarFromValues(values: Array<any>): IQuestionValueTypeInfo["scalarType"] {
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
function scalarOf(values: Array<any>): IQuestionValueTypeInfo {
  return { shape: "scalar", scalarType: inferScalarFromValues(values) };
}

// The value a question of this type stores, read from its JSON alone. Question.getValueType() answers
// the same question for a live model and reads live state (a choices source, a component's content
// question), so it does not call this; tests/questionValueTypeTests.ts keeps the two in agreement.
// Component (custom / composite) types and imagemap are "unknown" here.
export function getQuestionValueTypeInfo(type: string, json?: any): IQuestionValueTypeInfo {
  switch(type) {
    case "text":
      return { shape: "scalar", scalarType: getInputValueType(json?.inputType || "text") };
    case "comment":
    case "signaturepad":
      return { shape: "scalar", scalarType: "string" };
    case "boolean":
      if (json?.valueTrue !== undefined || json?.valueFalse !== undefined) {
        return { shape: "scalar", scalarType: "any" };
      }
      return { shape: "scalar", scalarType: "boolean" };
    case "radiogroup":
    case "dropdown":
    case "buttongroup":
      return scalarOf(getStaticChoiceValues(json?.choices));
    case "imagepicker":
      if (json?.multiSelect === true) return { shape: "array" };
      return scalarOf(getStaticChoiceValues(json?.choices));
    case "checkbox":
    case "tagbox":
    case "ranking":
    case "file":
      return { shape: "array" };
    case "rating": {
      const rateValues = getStaticChoiceValues(json?.rateValues);
      if (rateValues.length > 0) return scalarOf(rateValues);
      return { shape: "scalar", scalarType: "number" };
    }
    case "slider":
      if (json?.sliderType === "range") return { shape: "array" };
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
    default:
      return { shape: "unknown" };
  }
}
