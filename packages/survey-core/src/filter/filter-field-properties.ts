import { settings } from "../settings";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-filter-fields";
import { getFilterFieldOperators } from "./filter-conditions";

// The operators the property grid offers for a fields entry's operators: those the control's editor would
// offer for the field it names, before the entry's own restriction - the list must not shrink to what is
// picked already. With no entry (the JSON schema's enum, the linter) every operator.
export function getFilterOperatorChoices(obj: any): Array<string> {
  const all = Object.keys(settings.logic.operators);
  const field = getChoicesField(obj);
  if (!field) return all;
  const res = getFilterFieldOperators(Object.assign({}, field, { operators: undefined }));
  return res.length > 0 ? res : all;
}
// The field an entry stands for: through its control (an entry in fields, or a row of the designer's table
// that is not in fields yet), else its own.
function getChoicesField(obj: any): IDynamicDataFilterField {
  if (!obj) return undefined;
  const control: any = obj.fieldOwner || obj.designOwner;
  if (!!control && typeof control.getFieldOfEntry === "function") return control.getFieldOfEntry(obj);
  return typeof obj.getFilterField === "function" ? obj.getFilterField() : undefined;
}
