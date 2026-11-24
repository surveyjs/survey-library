import type { Question } from "../question";
import { settings } from "../settings";
import { IDynamicDataFilterField, collectFilterFields } from "../dynamic-data/dynamic-data-filter-fields";
import { getFilterFieldOperators } from "./filter-conditions";

// The property grid rules of allowFiltering and filterOperators: a question's and a matrix column's
// registrations share them.

// Whether a Filter Control can reach a question as a field: the question is in the template of a
// Dynamic Panel or in the detail panel of a matrix, and that one can be a target (isFilterTargetInReach:
// not nested, not in a matrix detail panel's template), at any depth - in a panel (its parentQuestion
// is still the Dynamic Panel), or in a question whose children are the fields (a composite question,
// a Multiple Textboxes). A nested Dynamic Panel's template and a matrix cell are not fields:
// getFilterFields doesn't walk into them, and no target is nested. A column has its own rule.
export function isFilterFieldInReach(question: Question): boolean {
  if (!question) return false;
  let top: Question = question;
  while(!!top.parentQuestion && top.parentQuestion.hasNestedFilterFields) {
    top = top.parentQuestion;
  }
  const owner: Question = top.parentQuestion;
  if (!!owner) return owner.isDescendantOf("paneldynamic") && isFilterTargetInReach(owner);
  const matrix = getDetailPanelMatrix(top);
  return !!matrix && matrix.detailPanelMode !== "none" && isFilterTargetInReach(matrix);
}
// The matrix whose detail panel template holds the question. The template's questions have no
// parentQuestion (only the rows' panels set it); the template is a panel on no page that the matrix
// stands for in the designer (selectedElementInDesign).
function getDetailPanelMatrix(question: Question): any {
  let root: any = question.parent;
  while(!!root && !!root.parent) {
    root = root.parent;
  }
  const matrix: any = !!root ? root.selectedElementInDesign : undefined;
  return !!matrix && typeof matrix.isDetailPanelTemplate === "function" && matrix.isDetailPanelTemplate(root) ? matrix : undefined;
}
// Whether a Filter Control can take the question as its target: it finds the target by name among the
// survey's questions (findQuestionByName), and no target is nested - not in a Dynamic Panel's template
// or a composite question (a parentQuestion), not in a matrix detail panel's template (a panel on no
// page) - the questions of that template are fields, not targets. A question not added anywhere yet
// is let through.
export function isFilterTargetInReach(question: Question): boolean {
  return !!question && !question.parentQuestion && (!question.parent || !!question.page);
}
// The column rule: a column, or its cell question, of a matrix a Filter Control can reach. A column with
// no matrix yet is let through.
export function isFilterColumnInReach(obj: any): boolean {
  const column = getColumn(obj);
  const matrix: any = !!column ? column.colOwner : undefined;
  return !matrix || isFilterTargetInReach(matrix);
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
  // A Filter Control's fields entry: the field it stands for, the target's it overrides among them. Asked
  // first: an entry has getFilterField and a templateQuestion too, and would pass for a column.
  const control: any = obj.fieldOwner || obj.designOwner;
  if (!!control && typeof control.getFieldOfEntry === "function") {
    const field = control.getFieldOfEntry(obj);
    if (!!field) return field;
  }
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
