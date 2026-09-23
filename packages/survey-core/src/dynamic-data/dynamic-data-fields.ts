import { Question, QuestionValueType } from "../question";
import { LocalizableString } from "../localizablestring";
import { settings } from "../settings";
import { DynamicDataFieldType, IDynamicDataField } from "./dynamic-data-interfaces";

// The record fields a dynamic panel template or a matrix column contributes to the list. They are
// used for sorting only (the filter is an expression and needs no typing), so a value type that
// does not say how to compare is "any": the local sort then compares the raw values.
export function getDynamicDataFieldType(question: Question): DynamicDataFieldType {
  const type = question.getValueType();
  // "string" is also what a question that does not know its value type reports (an expression, a
  // select question whose choices are not loaded yet), so it is not trusted: the values decide.
  return type === "number" || type === "date" || type === "boolean" ? type : "any";
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

// What a Filter Control needs to know about one field of a Dynamic Matrix or a Dynamic Panel. It is
// not an IDynamicDataField: that one describes a record key the list sorts and compares by, this one
// describes a field a human filters by, and the two do not have the same key space - a field of a
// value that is a record of its own is named by the dotted path the expression language reads it
// with, which is not a key of the record.
export interface IDynamicDataFilterField {
  name: string;
  // The variable the expression names: "{valueName} > 10". It is the key the cell or the question
  // writes, and a dotted path for a nested field.
  valueName: string;
  locTitle: LocalizableString;
  valueType: QuestionValueType;
  // The question type that supplies the value editor, the way cellType does for a matrix cell.
  fieldType: string;
  // The question the editor is cloned from. It belongs to the source and is never stored.
  templateQuestion: Question;
}
// The fields a Filter Control offers for a set of questions. A question whose value is a record of
// its own - Multiple Textboxes, a composite question - is not a field: its children are, under the
// dotted path the expression language reads them with ({address.city}). A question whose value is a
// table of its own - a nested Dynamic Matrix or Dynamic Panel - is neither, and is skipped whole.
export function getFilterFieldsForQuestions(questions: Array<Question>): Array<IDynamicDataFilterField> {
  const res = new Array<IDynamicDataFilterField>();
  (questions || []).forEach((question: Question): void => { collectFilterFields(res, question, ""); });
  return res;
}
function collectFilterFields(res: Array<IDynamicDataFilterField>, question: Question, valuePrefix: string): void {
  if (!question || !question.allowFiltering) return;
  const valueName = valuePrefix + question.getValueName();
  if (question.isFilterable) {
    res.push({
      name: question.name, valueName: valueName, locTitle: question.locTitle,
      valueType: question.getValueType(), fieldType: question.getType(), templateQuestion: question
    });
    return;
  }
  if (question.getValueType() !== "object") return;
  question.getNestedQuestions(false, false).forEach((nested: Question): void => {
    collectFilterFields(res, nested, valueName + ".");
  });
}
