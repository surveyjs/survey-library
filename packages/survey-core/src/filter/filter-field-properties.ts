import type { Question } from "../question";
import { settings } from "../settings";
import { IDynamicDataFilterField, collectFilterFields } from "../dynamic-data/dynamic-data-filter-fields";
import { getFilterFieldOperators } from "./filter-conditions";

// The property grid rules of allowFiltering and filterOperators: a question's and a matrix column's
// registrations share them.

// Whether a Filter Control can reach a question as a field: the question is in the template of a
// Dynamic Panel that can be a source (isFilterSourceInReach: not nested, not in a matrix detail
// panel's template), at any depth - in a panel (its parentQuestion is still the Dynamic Panel),
// or in a question whose children are the fields (a composite question, a Multiple Textboxes).
// A nested Dynamic Panel's template, a matrix cell and a matrix detail panel's question are not
// fields: getFilterFields doesn't walk into them, and no source is nested. A column has its own rule.
export function isFilterFieldInReach(question: Question): boolean {
  if (!question) return false;
  let owner: Question = question.parentQuestion;
  while(!!owner && owner.hasNestedFilterFields) {
    owner = owner.parentQuestion;
  }
  return !!owner && owner.isDescendantOf("paneldynamic") && isFilterSourceInReach(owner);
}
// Whether a Filter Control can take the question as its source: it finds the source by name among the
// survey's questions (findQuestionByName), and no source is nested - not in a Dynamic Panel's template
// or a composite question (a parentQuestion), not in a matrix detail panel's template (a panel on no
// page). A question not added anywhere yet is let through.
export function isFilterSourceInReach(question: Question): boolean {
  return !!question && !question.parentQuestion && (!question.parent || !!question.page);
}
// The column rule: a column, or its cell question, of a matrix a Filter Control can reach. A column with
// no matrix yet is let through.
export function isFilterColumnInReach(obj: any): boolean {
  const column = getColumn(obj);
  const matrix: any = !!column ? column.colOwner : undefined;
  return !matrix || isFilterSourceInReach(matrix);
}

// The operators the property grid offers for filterOperators: those the control's editor would
// offer for the field, before the author's own restriction - the list must not shrink to what is
// picked already. With no object (the JSON schema's enum, the linter) every operator.
export function getFilterOperatorChoices(obj: any): Array<string> {
  const all = Object.keys(settings.logic.operators);
  const field = getChoicesField(obj);
  if (!field) return all;
  const res = getFilterFieldOperators(Object.assign({}, field, { operators: undefined }));
  return res.length > 0 ? res : all;
}
// A column, or its cell question (the property grid may hand either: the cell question's locOwner
// is the column), answers its own field; a question the field collectFilterFields makes of it.
function getChoicesField(obj: any): IDynamicDataFilterField {
  if (!obj) return undefined;
  const column = getColumn(obj);
  if (!!column) return column.getFilterField();
  if (typeof obj.getValueType !== "function" || !obj.isFilterable) return undefined;
  const res: Array<IDynamicDataFilterField> = [];
  collectFilterFields(res, obj, "");
  return res[0];
}
function getColumn(obj: any): any {
  if (!obj) return undefined;
  return isColumn(obj) ? obj : (isColumn(obj.locOwner) ? obj.locOwner : undefined);
}
function isColumn(obj: any): boolean {
  return !!obj && typeof obj.getFilterField === "function" && !!obj.templateQuestion;
}
