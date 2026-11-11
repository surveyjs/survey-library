import type { IObjectValueContext, IValueGetterContext } from "./conditions/conditionProcessValue";
import { RecordKeyLevel } from "./record-key-level";
import { RecordKeyLevelValueGetterContext } from "./data-scope-contexts";

// The metadata mode's start context of an element inside a records template (design time): the element's own
// context, then the levels of the template's nesting panels around it, innermost first, then the template's
// record, then the records question's own metadata context (an outer template's levels come after an inner
// template's record). A matrix's detail panel template has no data: the matrix's design row stands for its
// record. A matrix column goes on to its matrix's metadata context. The element's own context otherwise.
// A panel's own expressions run in its parent's scope, so its levels start at its parent; a template panel's
// own expressions run in its record.
// The elements are typed any: an element, a column or a template panel is read through the members it has.
export function getMetadataValueGetterContext(el: any): IValueGetterContext {
  const cxt: IValueGetterContext = el.getValueGetterContext();
  if (!!el.colOwner) return withOwnerRoot(cxt, el.colOwner);
  const template = isTemplatePanel(el) ? el : getRecordTemplatePanel(el);
  if (!template) return cxt;
  const chain = getRecordTemplateKeyLevels(el, template);
  const record: IObjectValueContext = !el.data ? getDesignRecordObj(template) : (el.isQuestion ?
    (!!cxt && !!cxt.getRootObj ? cxt.getRootObj() : undefined) : { getValueGetterContext: () => cxt });
  let root: IObjectValueContext = !record ? record :
    { getValueGetterContext: () => withOwnerRoot(record.getValueGetterContext(), template.getRecordsOwner()) };
  for (let i = chain.length - 1; i >= 0; i--) {
    const levels = chain[i];
    const next = root;
    root = { getValueGetterContext: () => new RecordKeyLevelValueGetterContext(levels, next) };
  }
  const first = root;
  if (!el.isQuestion || !cxt) return !!first ? first.getValueGetterContext() : cxt;
  return { getValue: params => cxt.getValue(params), getRootObj: () => first };
}
// A context that goes on, when a name is not found, to the owner's metadata context: each step moves to a
// records question strictly outside the template, so the chain ends at the survey.
function withOwnerRoot(cxt: IValueGetterContext, owner: any): IValueGetterContext {
  if (!cxt || !owner) return cxt;
  return { getValue: params => cxt.getValue(params),
    getRootObj: () => ({ getValueGetterContext: () => getMetadataValueGetterContext(owner) }) };
}
function isTemplatePanel(panel: any): boolean {
  return !!panel && typeof panel.isRecordTemplatePanel === "function" && panel.isRecordTemplatePanel();
}
// The records template around an element, or null.
function getRecordTemplatePanel(el: any): any {
  let panel = el.parent;
  while(!!panel && !isTemplatePanel(panel)) panel = panel.parent;
  return panel || null;
}
// The record of a template with no data (a matrix's detail panel template): the matrix's design row.
function getDesignRecordObj(template: any): IObjectValueContext {
  const owner: any = template.getRecordsOwner();
  if (!owner || typeof owner.getDesignRowContext !== "function") return undefined;
  return { getValueGetterContext: () => owner.getDesignRowContext() };
}
// The levels of the template's nesting panels around an element, innermost first; empty when no panel around
// it nests in the records.
function getRecordTemplateKeyLevels(el: any, template: any): Array<Array<RecordKeyLevel>> {
  const panels: Array<any> = [];
  let panel = el === template ? null : el.parent;
  while(!!panel && panel !== template) {
    panels.unshift(panel);
    panel = panel.parent;
  }
  const res: Array<Array<RecordKeyLevel>> = [];
  let levels = [new RecordKeyLevel(template.elements)];
  for (let i = 0; i < panels.length && levels.length > 0; i++) {
    const key = panels[i].getRecordDataNestingKey();
    if (!key) continue;
    levels = RecordKeyLevel.getLevelsOf(levels, key);
    if (levels.length > 0) res.unshift(levels);
  }
  return res;
}
