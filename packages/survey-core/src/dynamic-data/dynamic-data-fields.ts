import { Question } from "../question";
import { settings } from "../settings";
import { DynamicDataFieldType, IDynamicDataField } from "./dynamic-data-interfaces";

// The record fields a dynamic panel template or a matrix column contributes to the list. They are
// used for sorting only (the filter is an expression and needs no typing), so an unknown question
// type is "any": the local sort then compares the raw values.
const dateInputTypes = ["date", "datetime-local", "month", "week", "time"];

export function getDynamicDataFieldType(question: Question): DynamicDataFieldType {
  const type = question.getType();
  if (type === "boolean") return "boolean";
  if (type === "rating") return "number";
  if (type === "text") {
    const inputType = (<any>question).inputType;
    if (inputType === "number" || inputType === "range") return "number";
    if (dateInputTypes.indexOf(inputType) > -1) return "date";
  }
  return "any";
}
export function getDynamicDataFieldForQuestion(question: Question): IDynamicDataField {
  return { name: question.getValueName(), dataType: getDynamicDataFieldType(question) };
}
export function getDynamicDataFieldsForQuestions(questions: Array<Question>): Array<IDynamicDataField> {
  const res = new Array<IDynamicDataField>();
  (questions || []).forEach((question: Question): void => {
    res.push(getDynamicDataFieldForQuestion(question));
    // A comment is stored under an ordinary key of the same record.
    if (question.hasComment) {
      res.push({ name: question.getValueName() + settings.commentSuffix, dataType: "string" });
    }
  });
  return res;
}
