import { Question } from "../question";
import { settings } from "../settings";
import { DynamicDataFieldType, IDynamicDataField } from "./dynamic-data-interfaces";

// The record fields a dynamic panel template or a matrix column contributes to the list. They are
// used for sorting only (the filter is an expression and needs no typing), so a value type that
// does not say how to compare is "any": the local sort then compares the raw values.
function getDynamicDataFieldType(question: Question): DynamicDataFieldType {
  const type = question.getValueType();
  // "string" is also what a question that does not know its value type reports (an expression, a
  // select question whose choices are not loaded yet), so it is not trusted: the values decide.
  return type === "number" || type === "date" || type === "boolean" ? type : "any";
}
function getDynamicDataFieldForQuestion(question: Question): IDynamicDataField {
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
