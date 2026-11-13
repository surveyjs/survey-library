import type { ISurvey, ISurveyImpl } from "./base-interfaces";
import type { PanelModelBase } from "./panel";
import type { Question } from "./question";
import { Helpers } from "./helpers";
import { getDataNestingKey } from "./data-nesting-key";
import { PanelDataScope, getDataScopeHost, getRecordDataScope } from "./panel-data-scope";

// Where a container is for nested data: "survey" - on the survey's data, the dataNesting table applies;
// "record" - inside a dynamic panel's or a detail panel's record, at any depth; "template" - inside such a record's
// template, where the key applies to the records built from it; "" - never: a record panel itself (it is the
// record), a composite's content panel and the panels in it (the component's author owns its value's shape).
export type DataNestingPlace = "survey" | "record" | "template" | "";

// A record item (a dynamic panel's item, a matrix row), told by a member only QuestionRecordItem has: an
// ObjectDataScope check would match a composite's scope too.
const isRecordItem = (data: any): boolean => typeof data?.getVariableName === "function";
// Where the panels inside a top panel keep their values. Only a dynamic panel gives a panel a parent question.
function getTopPanelPlace(top: any): DataNestingPlace {
  if (ContainerDataNesting.isRecordTemplate(top)) return "template";
  if (!!top.parentQuestion || isRecordItem(top.data)) return "record";
  if (top.isContentElement) return "";
  // Another data than the survey or a nesting scope is a composite's.
  return !top.data || top.data === top.survey || top.data instanceof PanelDataScope ? "survey" : "";
}

// A container's nested data: where it is attached, its key, its scope, and its elements attached again when the
// key changes. PanelModelBase owns one and delegates to it.
export class ContainerDataNesting {
  // Kept once created: it passes everything through while the container has no key.
  private scope: PanelDataScope;
  // Whether the elements got the scope at the last attach. scope.isActive cannot answer it: inside a record an
  // attached scope stays inactive under "none" and turns on with the mode, without an attach.
  private isUsed: boolean = false;
  private place: DataNestingPlace = "survey";
  // The key at the last attach: a key change inside a record re-reads the record. isActive cannot tell it ("a" to
  // "b"), and the key is read after the valueName or name has changed.
  private attachedKey: string = "";

  // getContainerKind: "panel", "page", or "" for the single-page container.
  constructor(private readonly container: PanelModelBase, private readonly getContainerKind: () => string) {
  }
  public getScope(): PanelDataScope {
    return this.isUsed ? this.scope : null;
  }
  // The one key rule. A by-name mode never changes a record's shape.
  private getKeyAt(place: DataNestingPlace, valueName: string, name: string): string {
    const container = this.container;
    const mode = getDataScopeHost(container.survey || ContainerDataNesting.getTemplateOwnerSurvey(container))?.dataNesting;
    if (place === "survey") return getDataNestingKey(mode, this.getContainerKind(), valueName, name);
    return !!place && mode !== "none" ? valueName : "";
  }
  public getKey(): string {
    return this.isUsed ? this.getKeyAt(this.place, this.container.valueName, this.container.name) : "";
  }
  // A template panel answers with the key of the records built from it: the Creator asks it before a rename.
  public getKeyFor(valueName: string, name: string): string {
    return this.getKeyAt(ContainerDataNesting.getPlace(this.container), valueName || "", name || "");
  }
  public getRecordKey(): string {
    return this.getKeyAt("record", this.container.valueName, this.container.name);
  }
  public get isNesting(): boolean {
    return !!this.getScope() && this.scope.isActive;
  }
  // Every structured data view shows a nesting container as <key>: <object> ("Structured Data Views" in
  // docs/design-survey-nested-data.md).
  public collectValue(data: any): void {
    const val = this.getScope().getObjectValue();
    if (!Helpers.isValueEmpty(val)) {
      data[this.getKey()] = Helpers.getUnbindValue(val);
    }
  }
  // The survey impl the container's elements get: its scope when it nests, else value.
  public attach(value: ISurveyImpl): ISurveyImpl {
    // The place, the survey, the valueName or the name may have changed: the scope reads its key again.
    this.scope?.resetKey();
    this.place = ContainerDataNesting.getPlace(this.container);
    this.isUsed = !!value && this.canAttach(value);
    if (this.isUsed && !this.scope) {
      this.scope = new PanelDataScope(this.container);
    }
    this.attachedKey = this.getKey();
    if (!this.isUsed) return value;
    this.scope.setParent(value);
    getDataScopeHost(value.getSurvey())?.dataScopeUsed();
    return this.scope;
  }
  private canAttach(value: ISurveyImpl): boolean {
    const { place, container } = this;
    if (place !== "survey" && place !== "record" || !value.getSurveyData()) return false;
    if (!!this.scope) return true;
    // Inside a record a panel with valueName gets a scope under "none" too: the survey's dataNesting changes
    // reach no panel inside a record, and its key turns on when the mode does.
    return place === "record" ? !!container.valueName : !!this.getKeyAt(place, container.valueName, container.name);
  }
  // The container's valueName or name changed; impl is the container's survey impl.
  public onKeyChanged(impl: ISurveyImpl): void {
    const prevKey = this.attachedKey;
    this.updateAttachment(impl);
    if (!this.isUsed) return;
    const host = getDataScopeHost(this.container.survey);
    const record = this.place === "record" ? getRecordDataScope(this.container.data) : null;
    if (!record) {
      host?.dataScopeChanged(this.container);
    } else if (prevKey !== this.attachedKey) {
      // The survey's indexes do not hold a record's questions: they read the record again.
      host?.dataShapeChanged();
      record.updateValuesFromData();
    }
  }
  // The key may have changed (the valueName, the name, the survey's dataNesting): the data does not move
  // ("Limitations" in docs/design-survey-nested-data.md).
  public updateAttachment(impl: ISurveyImpl): void {
    const prevImpl = this.getScope() || impl;
    const elementsImpl = this.attach(impl);
    if (elementsImpl !== prevImpl) {
      this.container.elements.forEach(el => el.setSurveyImpl(elementsImpl));
    }
  }

  // A panel is where its top panel's elements are. The top panel itself ignores its key when it is a record
  // panel, a template or a composite's content: its object is the record or the component's value already.
  public static getPlace(panel: PanelModelBase): DataNestingPlace {
    let top: any = panel;
    while(!!top.parent) top = top.parent;
    const place = getTopPanelPlace(top);
    return top === panel && place !== "survey" ? "" : place;
  }
  // A dynamic panel's template, or a matrix's detail panel template.
  public static isRecordTemplate(panel: PanelModelBase): boolean {
    const pq: any = panel.parentQuestion;
    return !!pq && pq.template === panel || !!(<any>panel.selectedElementInDesign)?.isDetailPanelTemplate?.(panel);
  }
  // A template's records question is its design owner; a record panel's is its record item's (a dynamic panel's
  // new panel has none before its item is created).
  public static getRecordsOwner(panel: PanelModelBase): Question {
    if (ContainerDataNesting.isRecordTemplate(panel)) return <Question><any>panel.selectedElementInDesign;
    const data: any = !panel.parent ? panel.data : null;
    return isRecordItem(data) ? data.data : null;
  }
  // A detail panel template has no survey, nor has a template inside one: the walk climbs the design owners to
  // one that has. It follows the design owner, so a choice panel in a detail panel template finds it too.
  private static getTemplateOwnerSurvey(panel: PanelModelBase): ISurvey {
    let el: any = panel;
    for (;;) {
      while(!!el.parent) el = el.parent;
      const owner: any = el.selectedElementInDesign;
      if (!owner || owner === el) return undefined;
      if (!!owner.survey) return owner.survey;
      el = owner;
    }
  }
}
