import type { Question, QuestionValueType } from "../question";
import type { LocalizableString } from "../localizablestring";
import type { ItemValue } from "../itemvalue";

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
  // The choices a respondent sees for this field when they are not the template question's own: a
  // select column with no choices shows the matrix's in its cells, and only the cells receive them.
  // undefined = the template question's visibleChoices.
  choices?: Array<ItemValue>;
  // True when the field authored no fieldType/cellType of its own and runs on the fallback text
  // question: fieldType still names the resolved editor ("text"), so operator narrowing needs its
  // own signal to tell "authored text" from "defaulted to text" - a typeless boolean loses the
  // ordering operators its text editor would take. undefined = not typeless.
  isTypeless?: boolean;
  // Whether the field appears in the Filter Control's quick filters. undefined = shown, the same as
  // true; only the control's fields entries set it, a field a target reports on its own never opts out.
  showInQuickFilters?: boolean;
  // Whether the field shows in its target question: false for a hidden column, a hidden question of a
  // record template and what lies in a hidden panel or a hidden record question; visibleIf is a record's,
  // not the field's, and is not read. Fields left out of a control are its visible fields (spec G).
  // undefined = visible.
  isVisible?: boolean;
  // The operators the control's fields entry allows for the field (FilterField.operators), in the order a
  // condition editor lists them. undefined or [] = every operator the field's value editor takes.
  operators?: Array<string>;
}
// What a field is called in the filter UI: its title, or its name when the title is empty. For a field
// of a question the title already falls back to the name; a field of a custom source may have none.
export function getFilterFieldTitle(field: IDynamicDataFilterField): string {
  return (!!field.locTitle && field.locTitle.calculatedText) || field.name;
}
// The fields a Filter Control offers for a set of questions. A question whose value is a record of
// its own - Multiple Textboxes, a composite question - is not a field: its children are, under the
// dotted path the expression language reads them with ({address.city}). A question whose value is a
// table of its own - a nested Dynamic Matrix or Dynamic Panel, a Dropdown Matrix - is neither, and is
// skipped whole.
export function getFilterFieldsForQuestions(questions: Array<Question>, isVisible?: (question: Question) => boolean): Array<IDynamicDataFilterField> {
  const res = new Array<IDynamicDataFilterField>();
  (questions || []).forEach((question: Question): void => { collectFilterFields(res, question, "", !isVisible || isVisible(question)); });
  return res;
}
// The one rule, shared by both sources: a matrix column that is not a field of its own walks into
// its cell question the same way. valuePrefix is the dotted path already walked, "" at the top.
export function collectFilterFields(res: Array<IDynamicDataFilterField>, question: Question, valuePrefix: string, isVisible: boolean = true): void {
  if (!question) return;
  const valueName = valuePrefix + question.getValueName();
  if (question.isFilterable) {
    res.push({
      name: question.name, valueName: valueName, locTitle: question.locTitle,
      valueType: question.getValueType(), fieldType: question.getType(), templateQuestion: question,
      isVisible: isVisible
    });
    return;
  }
  if (!question.hasNestedFilterFields) return;
  question.getNestedQuestions(false, false).forEach((nested: Question): void => {
    collectFilterFields(res, nested, valueName + ".", isVisible);
  });
}
// The record keys a target's questions take from a Filter Control's fields entries (hasRecordField).
// keys: what a question is reached by - a column's or a template question's name and value name, and
// the dotted path of a child of a record question at any depth. excluded: keys the filter cannot filter
// by (isFilterRecordKeyExcluded); a path into one is taken too.
export interface IFilterRecordKeys {
  keys: Array<string>;
  excluded: Array<string>;
}
export function addFilterRecordKey(res: IFilterRecordKeys, key: string, excluded: boolean): void {
  if (!key) return;
  res.keys.push(key);
  if (excluded) {
    res.excluded.push(key);
  }
}
// A key the filter can neither compare nor walk into - a file, a signature, a table of its own: an entry
// naming it, or a path into it, is ignored (hasRecordField), not taken for a field of the record.
export function isFilterRecordKeyExcluded(question: Question): boolean {
  return !question || (!question.isFilterable && !question.hasNestedFilterFields);
}
// Walks a question the way collectFilterFields does and keeps what that one skips. An excluded key takes
// every path into it, so its children need no walk.
export function collectFilterRecordKeys(res: IFilterRecordKeys, question: Question, valuePrefix: string): void {
  if (!question) return;
  const isExcluded = isFilterRecordKeyExcluded(question);
  const valueName = valuePrefix + question.getValueName();
  addFilterRecordKey(res, valueName, isExcluded);
  if (isExcluded || question.isFilterable || !question.hasNestedFilterFields) return;
  question.getNestedQuestions(false, false).forEach((nested: Question): void => {
    collectFilterRecordKeys(res, nested, valueName + ".");
  });
}
// Whether a fields entry's name is taken: a key itself, or a path into a key the filter leaves out. A
// path into a key the filter offers that names no question is a field of its own - the record may hold
// more under that key than its questions show ("customer.country" next to a "customer" column).
export function isRecordFieldName(name: string, res: IFilterRecordKeys): boolean {
  if (!name) return false;
  return res.keys.indexOf(name) > -1 || res.excluded.some((key: string): boolean => name.indexOf(key + ".") === 0);
}
