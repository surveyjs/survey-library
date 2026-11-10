import type { IPanel, ISurvey, ISurveyImpl } from "./base-interfaces";
import type { PanelModelBase } from "./panel";
import type { Question } from "./question";
import { Helpers } from "./helpers";
import { PanelDataScope, DataNestingPlace, DataNestingKind, IDataNestingPlaceOwner, getDataNestingPlaceOwner,
  getDataNestingKey, getDataNestingKindAt, getDataScopeHost, getRecordDataScope } from "./panel-data-scope";

// An owner's answer about a panel it holds: the owner and the place of the panels inside the panel.
interface IOwnerAnswer {
  owner: IDataNestingPlaceOwner;
  place: DataNestingPlace;
}
function askOwner(obj: any, panel: IPanel): IOwnerAnswer {
  const owner = getDataNestingPlaceOwner(obj);
  const place = !!owner ? owner.getChildDataNestingPlace(panel) : undefined;
  return place !== undefined ? { owner: owner, place: place } : undefined;
}
// The question a panel belongs to: the one it is a template of (its design owner: a dynamic panel, a matrix),
// then the one it is a record panel of (its parent question: a dynamic panel).
function askQuestionOwners(panel: any): IOwnerAnswer {
  const designOwner = panel.selectedElementInDesign;
  return (designOwner !== panel ? askOwner(designOwner, panel) : undefined) || askOwner(panel.parentQuestion, panel);
}
// Where the panels inside el keep their values, or undefined when el is a plain panel inside another one.
function getInnerPlace(el: any): DataNestingPlace {
  const question = askQuestionOwners(el);
  if (!!question) return question.place;
  if (!!el.parent) return undefined;
  const data = askOwner(el.data, el);
  if (!!data && data.place === "record") return data.place;
  // A component's content never nests, whatever its data: the component's author owns the shape of its value.
  if (el.isContentElement) return "";
  if (!!data) return data.place;
  // Without data or on its own survey: the survey's data; another data that does not answer: never.
  return !el.data || el.data === el.survey ? "survey" : "";
}

// A container's nested data: where it is attached, whether it nests and under which key, its scope and how its
// elements are attached again when the key changes. The container owns one (PanelModelBase) and delegates to it.
export class ContainerDataNesting {
  // The scope is kept once created; it passes everything through while the container has no key.
  private scope: PanelDataScope;
  private isUsed: boolean = false;
  // The place found when the container was last attached (attach), and the key it had then: a key change inside
  // a record re-reads the record once.
  private place: DataNestingPlace = "survey";
  private attachedKey: string = "";

  // getContainerKind: the container's kind for the dataNesting table ("panel", "page", or "" for none).
  constructor(private readonly container: PanelModelBase, private readonly getContainerKind: () => DataNestingKind) {
  }
  public getScope(): PanelDataScope {
    return this.isUsed ? this.scope : null;
  }
  // The one place that decides whether the container nests and under which key ("" when it does not): the
  // dataNesting table for the place the container is attached to.
  public getKey(): string {
    return this.isUsed ? this.getPlaceKey() : "";
  }
  private getPlaceKey(): string {
    return this.getKeyOfKind(getDataNestingKindAt(this.place, this.getContainerKind(), false));
  }
  private getKeyOfKind(kind: DataNestingKind, valueName?: string, name?: string): string {
    const container = this.container;
    const host = getDataScopeHost(container.survey || ContainerDataNesting.getTemplateOwnerSurvey(container));
    return getDataNestingKey(host?.dataNesting, kind,
      valueName !== undefined ? valueName : container.valueName, name !== undefined ? name : container.name);
  }
  // The key with these valueName and name for where the container is now; a template panel answers with the key
  // of the records built from it.
  public getKeyFor(valueName: string, name: string): string {
    const kind = getDataNestingKindAt(ContainerDataNesting.getPlace(this.container), this.getContainerKind(), true);
    return this.getKeyOfKind(kind, valueName || "", name || "");
  }
  // The key a panel inside a record's template nests under in the records built from it (RN3).
  public getRecordKey(): string {
    return this.getKeyOfKind("record");
  }
  public get isNesting(): boolean {
    const scope = this.getScope();
    return !!scope && scope.isActive;
  }
  // Writes the container's stored object into data under its key, as one value (D7).
  public collectValue(data: any): void {
    const val = this.getScope().getObjectValue();
    if (!Helpers.isValueEmpty(val)) {
      data[this.getKey()] = Helpers.getUnbindValue(val);
    }
  }
  // The survey impl the container's elements get: its scope when it nests, else value.
  public attach(value: ISurveyImpl): ISurveyImpl {
    this.isUsed = false;
    this.attachedKey = "";
    this.place = ContainerDataNesting.getPlace(this.container);
    if (!value || !this.canAttach(value)) return value;
    if (!this.scope) {
      this.scope = new PanelDataScope(this.container);
    }
    this.scope.setParent(value);
    this.isUsed = true;
    this.attachedKey = this.getKey();
    getDataScopeHost(value.getSurvey())?.dataScopeUsed();
    return this.scope;
  }
  private canAttach(value: ISurveyImpl): boolean {
    const place = this.place;
    // Inside a record a panel with valueName keeps a scope under "none" too: the survey's dataNesting changes
    // reach no panel inside a record, and its key turns on when the mode does (D8).
    const isRecordKey = place === "record" && !!this.container.valueName;
    if (!this.scope && !this.getPlaceKey() && !isRecordKey) return false;
    return !!value.getSurveyData() && (place === "survey" || place === "record");
  }
  // The container's valueName or name changed; impl is the container's survey impl.
  public onKeyChanged(impl: ISurveyImpl): void {
    const prevKey = this.attachedKey;
    this.updateAttachment(impl);
    // A panel that cannot nest ignores its key: nothing to re-read.
    if (!this.isUsed) return;
    const container = this.container;
    const record = this.place === "record" ? getRecordDataScope(container.data) : null;
    if (!!record) {
      // Inside a record the record's questions read it again (D8): the survey's indexes do not hold them.
      if (prevKey === this.attachedKey) return;
      getDataScopeHost(container.survey)?.dataShapeChanged();
      record.updateValuesFromData();
      return;
    }
    getDataScopeHost(container.survey)?.dataScopeChanged(container);
  }
  // The container's key may have changed (its valueName or name, or the survey's dataNesting): a container that
  // starts to nest gets its scope and re-attaches its elements. The data does not move (D8).
  public updateAttachment(impl: ISurveyImpl): void {
    const prevImpl = this.getScope() || impl;
    const elementsImpl = this.attach(impl);
    if (elementsImpl !== prevImpl) {
      const elements = this.container.elements;
      for (let i = 0; i < elements.length; i++) {
        elements[i].setSurveyImpl(elementsImpl);
      }
    }
  }

  // The panel's place: the walk goes up the parents and asks the owner of the first panel that has one. The
  // panel the owner holds is a record panel, a template or a composite's content itself: its own key is ignored,
  // since its object is the record or the component's value already.
  public static getPlace(panel: PanelModelBase): DataNestingPlace {
    let el: any = panel;
    while(!!el) {
      const place = getInnerPlace(el);
      if (place !== undefined) return el === panel && place !== "survey" ? "" : place;
      el = el.parent;
    }
    return "survey";
  }
  // A dynamic panel's template, or a matrix's detail panel template: the panel the records are built from.
  public static isRecordTemplate(panel: PanelModelBase): boolean {
    const answer = askQuestionOwners(panel);
    return !!answer && answer.place === "template";
  }
  // The records question panel is the record panel of: a dynamic panel's template or one of its panels, a
  // matrix's detail panel template or a row's detail panel. null for another panel.
  // A question that answers "template" is the records question itself. A record panel is found through its data
  // (the record item) only: a dynamic panel's new panel has no record before its item is created.
  public static getRecordsOwner(panel: PanelModelBase): Question {
    const template = askQuestionOwners(panel);
    if (!!template && template.place === "template") return <Question><any>template.owner;
    const record = !panel.parent ? askOwner(panel.data, panel) : undefined;
    if (!record || record.place !== "record" || !record.owner.getRecordsQuestion) return null;
    return record.owner.getRecordsQuestion();
  }
  // A matrix's detail panel template is attached to no survey; its matrix (its design owner) is. A template inside
  // such a template (a dynamic panel or a matrix in a detail panel template) has no survey either, so the walk
  // climbs on through each design owner until one has a survey. It follows the design owner, not the owners'
  // answers: a choice panel of a question in a detail panel template has its question as the design owner, and
  // that question answers nothing.
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
