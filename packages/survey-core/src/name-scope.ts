import type { ISurvey, ISurveyElement } from "./base-interfaces";

// Scoped names (SN1, SN3): in a nesting mode of dataNesting a name is unique where its value lives. A container
// that holds data opens a name scope, and so does a records template (a dynamic panel's template, a matrix's
// detail panel). A panel that holds no data opens none: its elements belong to the nearest scope above it. In
// "none" the survey is the only scope, and every lookup is flat, as before.
//
// Where each scope holds its elements by name:
//   the survey: its flat structure (SurveyModel's elementIndex), read through a filter: in a nesting mode only the
//     elements whose nearest scope is the survey answer;
//   a container that holds data, a record item: the instance of its data scope (ObjectDataScope.getDataKeyIndex),
//     which holds by name every element its walk reaches;
//   a records template: a walk of the template, which has no runtime instance (design time).
//
// A lookup takes a path of names (O2, O8): the name of each scope's owner (a panel, a page, a dynamic panel, a
// matrix), then the element's name. A whole-string match in the scope asked wins (a name may hold a dot); else the
// string is split at its dots, left to right.

export type ElementKind = (el: ISurveyElement) => boolean;
// The elements of one name scope, by name. caseInsensitive with exactFirst: an element with the exact name wins.
export interface INameScope {
  findOwnElement(name: string, isKind: ElementKind, caseInsensitive?: boolean, exactFirst?: boolean): any;
}

export function isNameScopeMode(survey: ISurvey): boolean {
  const mode = (<any>survey)?.dataNesting;
  return !!mode && mode !== "none";
}
// The records template a question opens as a name scope: a dynamic panel's template, a matrix's detail panel (when
// its detail panel mode shows one); undefined for another question.
function getRecordsTemplate(el: any): any {
  return !!el && el.isQuestion && typeof el.getRecordSortTemplate === "function" ? el.getRecordSortTemplate() : undefined;
}
export function isTemplatePanel(panel: any): boolean {
  return !!panel && typeof panel.isRecordTemplatePanel === "function" && panel.isRecordTemplatePanel();
}
// The records template around an element, or null.
export function getRecordTemplatePanel(el: any): any {
  let panel = el.parent;
  while(!!panel && !isTemplatePanel(panel)) panel = panel.parent;
  return panel || null;
}
// Whether a panel or a page inside its top panel holds data: its scope is active, or, inside a records template
// (which has no scopes at design time), the records built from it nest it.
function holdsData(panel: any): boolean {
  if (typeof panel.getDataScope !== "function") return false;
  const scope = panel.getDataScope();
  if (!!scope) return scope.isActive;
  return !!panel.parent && !!getRecordTemplatePanel(panel) && !!panel.getRecordDataNestingKey();
}
// The element whose name scope holds el's name: the nearest panel or page around it that holds data, else the
// records question whose template or record el is inside; null for the survey's own scope.
export function getNameScopeOwner(el: ISurveyElement): any {
  let top: any = el;
  let cur: any = (<any>el).parent;
  while(!!cur) {
    if (holdsData(cur)) return cur;
    top = cur;
    cur = cur.parent;
  }
  if (top === el || top.isPage || typeof top.getRecordsOwner !== "function") return null;
  return top.getRecordsOwner() || null;
}
// Whether an element opens a name scope: a panel or a page that holds data, or a records question.
function isScopeOwner(el: any): boolean {
  return el.isQuestion ? !!getRecordsTemplate(el) : holdsData(el);
}
// The scope an owner opens, or null.
function getOwnerNameScope(owner: any): INameScope {
  if (owner.isQuestion) {
    const template = getRecordsTemplate(owner);
    return !!template ? new ElementsNameScope(template.elements) : null;
  }
  const scope = owner.getDataScope();
  if (!!scope && scope.isActive) return scope;
  return holdsData(owner) ? new ElementsNameScope(owner.elements) : null;
}
// The elements of a panel inside a records template, walked on each lookup: the panels that hold no data are
// walked through, a panel that holds data is an element of this scope and holds its own.
class ElementsNameScope implements INameScope {
  constructor(private elements: Array<any>) { }
  findOwnElement(name: string, isKind: ElementKind, caseInsensitive?: boolean, exactFirst?: boolean): any {
    if (!name) return null;
    if (!caseInsensitive || exactFirst) {
      const res = this.find(this.elements, el => el.name === name && isKind(el));
      if (!!res || !caseInsensitive) return res;
    }
    const lower = name.toLowerCase();
    return this.find(this.elements, el => typeof el.name === "string" && el.name.toLowerCase() === lower && isKind(el));
  }
  private find(elements: Array<any>, isMatch: (el: any) => boolean): any {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (isMatch(el)) return el;
      if (el.isPanel && !holdsData(el)) {
        const res = this.find(el.elements, isMatch);
        if (!!res) return res;
      }
    }
    return null;
  }
}
// An element of the kind in the scope, by a bare name or a path of names.
export function findElementInNameScope(scope: INameScope, name: string, isKind: ElementKind, caseInsensitive?: boolean, exactFirst?: boolean): any {
  if (!name) return null;
  const res = scope.findOwnElement(name, isKind, caseInsensitive, exactFirst);
  if (!!res) return res;
  let pos = name.indexOf(".");
  while(pos > 0) {
    const owner = scope.findOwnElement(name.substring(0, pos), isScopeOwner, caseInsensitive, exactFirst);
    const inner = !!owner ? getOwnerNameScope(owner) : null;
    const found = !!inner ? findElementInNameScope(inner, name.substring(pos + 1), isKind, caseInsensitive, exactFirst) : null;
    if (!!found) return found;
    pos = name.indexOf(".", pos + 1);
  }
  return null;
}
export function isQuestionElement(el: ISurveyElement): boolean {
  return el.isQuestion;
}
// The path of names the survey finds an element by: each scope owner's name, then the element's. Its name when the
// element belongs to the survey's own scope.
export function getElementNamePath(el: ISurveyElement): string {
  const names: Array<string> = [el.name];
  let owner = getNameScopeOwner(el);
  while(!!owner) {
    names.unshift(owner.name);
    owner = getNameScopeOwner(owner);
  }
  return names.join(".");
}
