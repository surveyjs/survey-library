import type { IObjectValueContext, IValueGetterContext } from "../conditions/conditionProcessValue";
import { stripUnwrapPostfix } from "../conditions/conditionProcessValue";
import { RecordKeyLevel } from "./record-key-level";
import { getInnerLevels } from "./data-key-index";
import { RecordKeyLevelValueGetterContext } from "./data-scope-contexts";
import { getRecordTemplatePanel, isTemplatePanel } from "./name-scope";
import { settings } from "../settings";

// The metadata mode's start context of an element inside a records template (design time): the element's own
// context, then the levels of the template's nesting panels around it, innermost first, then the template's
// record, then the records question's own metadata context. A panel's own expressions run in its parent's scope,
// so its levels start at its parent; a template panel's own expressions run in its record. The elements are typed
// any: an element, a column or a template panel is read through the members it has.
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
// The record of a template with no data (a dynamic panel's template outside design mode, a matrix's detail panel
// template in design mode): the matrix's design row, or for a dynamic panel's template the template itself.
function getDesignRecordObj(template: any): IObjectValueContext {
  const owner: any = template.getRecordsOwner();
  if (!owner) return undefined;
  if (typeof owner.getDesignRowContext !== "function") return { getValueGetterContext: () => getTemplateRecordContext(template) };
  return { getValueGetterContext: () => owner.getDesignRowContext() };
}
// A dynamic panel's template as its record: it answers {panel.x} from the template's keys, and in a nested
// dynamic panel {parentPanel.x} is the outer record's (or the outer template's) {panel.x}. A bare name goes on to
// the dynamic panel. {panelIndex}, {prevPanel.x} and {nextPanel.x} have no answer: the template is no record of the
// list. {panel.x-unwrapped} names nothing, as in a record, whose top-level step does not strip the postfix.
function getTemplateRecordContext(template: any): IValueGetterContext {
  return { getValue: params => {
    const path = params.path;
    const head = path.length > 0 ? path[0].name.toLocaleLowerCase() : "";
    const dp = template.getRecordsOwner();
    if (path.length > 1 && head === settings.expressionVariables.parentPanel.toLocaleLowerCase() && !!dp.parentQuestion && !!dp.parent) {
      const outerTemplate = dp.parentQuestion.template;
      const outer: IValueGetterContext = !!dp.parent.data ? dp.parent.data.getValueGetterContext() :
        (!!outerTemplate && outerTemplate === getRecordTemplatePanel(dp) ? getTemplateRecordContext(outerTemplate) : undefined);
      const outerPath = [{ ...path[0], name: settings.expressionVariables.panel }].concat(path.slice(1));
      return !!outer ? outer.getValue({ ...params, path: outerPath, isRoot: true }) : undefined;
    }
    if (head !== settings.expressionVariables.panel.toLocaleLowerCase()) return undefined;
    if (path.length > 1 && stripUnwrapPostfix(path[1].name, <any>{}) !== path[1].name) return undefined;
    const levels = [new RecordKeyLevel(template.elements)];
    return new RecordKeyLevelValueGetterContext(levels).getValue({ ...params, path: path.slice(1), isRoot: false });
  } };
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
    levels = getInnerLevels(levels, key);
    if (levels.length > 0) res.unshift(levels);
  }
  return res;
}
