import type { Question } from "./question";
import type { PanelModelBase } from "./panel";
import type { IValueGetterContext } from "./conditions/conditionProcessValue";
import { ValueGetter } from "./conditions/conditionProcessValue";
import { Helpers, HashTable } from "./helpers";
import type { PanelDataScope, ObjectDataScope } from "./panel-data-scope";
import { DataKeysScope, getRecordDataScope, getKeyHolderScope, forEachChoicePanel } from "./panel-data-scope";
import type { ISurveyDataElement, IElement } from "./base-interfaces";
import { IDataScope, getElementDataScope } from "./data-key-index";
import { asScopeObject } from "./data-object-utils";

// One write of a survey data key, created where the value is written and passed down the write's steps
// (the changing event, the validation, the triggers, the notification, auto-advance).
//   name: the key the write or the request is for (a survey write: the top-level key written);
//   question: the question that wrote, carried by the write (ISurveyData.setValue): onValueChanged reports it;
//   questionName: a code write's report, the question named like the key, set by the survey when no container
//     owns the key;
//   writer: the question that wrote, when the survey must not look it up by the key: a question inside a
//     nesting container (its data path goes below the key), or a question that asks to advance itself.
export interface IValueWrite {
  name: string;
  question?: Question;
  questionName?: string;
  writer?: Question;
}

// What the root data scope reads from its survey. The survey is the root scope itself: an element whose
// value scope is the host is a top-level element.
export interface ISurveyRootDataScopeHost extends IDataScope {
  readonly pages: Array<PanelModelBase>;
  readonly isLoadingFromJson: boolean;
  getAllQuestions(visibleOnly?: boolean, includeDesignTime?: boolean): Array<Question>;
  getValueGetterContext(): IValueGetterContext;
}

// The survey's part of nested data: the root's keys (top-level questions and root containers), the root
// containers by key and by path, and the keys a write of a container key changes for triggers and
// conditions. The survey owns one and delegates to it; it reaches the survey only through the host.
// It keeps the data scopes' instances (ElementIndex) up: the root's own, and the instances below the root
// through the scope that holds each element. The root's instance is the base's walk of the pages (DataKeysScope), in
// document order, as every scope's is: an element appended in place, one removed or renamed in place, and any other
// change builds it again on the next read.
export class SurveyRootDataScope extends DataKeysScope {
  private isUsedValue: boolean = false;
  // getStoredValue: a root key's stored value, without the copy the survey's getValue makes.
  constructor(private host: ISurveyRootDataScopeHost, private getStoredValue: (key: string) => any) {
    super();
  }
  // The scope below the root whose instance held each element when it was built or the element was added: what a
  // removal, a rename or a move takes the element from. A hint, not the truth: an instance built again elsewhere
  // may hold it now (hold). The root's own elements are not in it.
  private holders = new WeakMap<ISurveyDataElement, ObjectDataScope>();

  // Whether a container of this survey has nested once: the records skip their nesting walks until then.
  public get isUsed(): boolean {
    return this.isUsedValue;
  }
  // Called on every attach of a nesting container. On the first one the root is built again: its walk reads the
  // data scopes from then on.
  public used(): void {
    if (this.isUsedValue) return;
    this.isUsedValue = true;
    this.resetDataKeyIndex();
  }
  // The walk of the pages. A question is the root's when its value is a key of the survey data (before a container
  // has nested, every question's is); a root container is an active scope with no active scope above it.
  protected getScopeElements(): Array<IElement> {
    return <Array<IElement>><any>this.host.pages;
  }
  protected isScopeQuestion(q: Question): boolean {
    return q.getValueScope() === <IDataScope>this.host;
  }
  protected isOwnDataScope(scope: PanelDataScope): boolean {
    return !scope.getParentActiveScope();
  }
  // The survey's flat structure holds the root's names.
  protected isScopeName(el: ISurveyDataElement): boolean {
    return false;
  }
  protected holdsChoicePanels(): boolean {
    return true;
  }
  // No scope is active before a container has nested: a survey without nesting asks no panel for its scope.
  protected readsDataScopes(): boolean {
    return this.isUsedValue;
  }
  // A scope below the root built its instance from these elements.
  public dataKeyIndexBuilt(scope: ObjectDataScope, elements: Array<ISurveyDataElement>): void {
    elements.forEach(el => this.hold(el, scope));
  }
  // An element is held by one instance below the root: one built while the element moved (setPage sends its call
  // when the move ends) takes it from the instance that held it before.
  private hold(el: ISurveyDataElement, scope: ObjectDataScope): void {
    const prev = this.holders.get(el);
    if (!!prev && prev !== scope) {
      prev.builtDataKeyIndex?.removeKeyed(el);
    }
    this.holders.set(el, scope);
  }
  // An element joined a container (questionAdded, panelAdded, a page added, the end of a move). The instance of
  // the scope it joined takes its part in place when it comes last in that scope's document order; otherwise that
  // instance is built again. That scope is the root for an element whose data is the survey's. Below the root, a
  // choice panel the element brings is the root's still: the root is built again.
  public elementAdded(el: IElement): void {
    const scope = getKeyHolderScope((<any>el).data);
    if (!scope) {
      // An element with no data (a dynamic panel's template question) is in no walk of the pages.
      if (!(<any>el).data) return;
      // A read while el was attached (a dynamic panel's readiness) may have built the root with a part of el in it
      // (a choice panel's question, a question taken off its page: they stay bound to the survey), ahead of el's
      // elements that were not attached yet: an append would not keep document order.
      if (this.holdsInside(el)) {
        this.resetDataKeyIndex();
      } else {
        this.dataKeyElementAdded(el);
      }
      return;
    }
    const added = scope.dataKeyElementAdded(el);
    if (!!added) {
      added.forEach(inner => this.hold(inner, scope));
    }
    if (this.hasChoicePanels(el)) {
      this.resetDataKeyIndex();
    }
  }
  // An element left its container: it and every element inside it leave the root's instance and the instances the
  // map names. A panel that comes back builds the instances inside it again (ContainerDataNesting.elementsAttached).
  public elementRemoved(el: IElement): void {
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      this.builtDataKeyIndex?.removeKeyed(inner);
      this.holders.get(inner)?.builtDataKeyIndex?.removeKeyed(inner);
      this.holders.delete(inner);
    });
  }
  // setPage moved the element, or took it off its page: its data is the new one already, and the map still names
  // where it was. The move attached the element again, and a read while it was added may have built an instance
  // with it in place, so nothing is patched: the instances that held it and those inside it are built again, and
  // so is the root's (an element taken off its page leaves it; one moved within the root takes its new place).
  public elementMoved(el: IElement): void {
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      this.holders.get(inner)?.resetDataKeyIndex();
      this.holders.delete(inner);
      if (!inner.isQuestion) {
        (<PanelModelBase><any>inner).getDataScope()?.resetDataKeyIndex();
      }
    });
    if (!!el.parent) {
      this.elementAdded(el);
    }
    this.resetDataKeyIndex();
  }
  // questionRenamed: the question's key in the root's instance, and its name and key in the instance below the root
  // that holds it. Each keeps its place in document order.
  public questionRenamed(question: Question): void {
    const root = this.builtDataKeyIndex;
    if (!!root && root.has(question)) {
      root.reKey(question, question.getValueName());
    }
    const index = this.holders.get(question)?.builtDataKeyIndex;
    if (!index) return;
    index.renamed(question);
    if (index.has(question)) {
      index.reKey(question, question.getValueName());
    }
  }
  // elementRenamed: a panel's name changed, or its load ended. Its name in the instance below the root that holds
  // it follows. A key loaded in place (fromJSON) sends no other notification, so a panel that has a scope is
  // treated as a changed key: the instances are only dropped here.
  public panelRenamed(panel: PanelModelBase): void {
    this.holders.get(panel)?.builtDataKeyIndex?.renamed(panel);
    if (!!panel.getDataScope()) {
      this.dataScopeKeysChanged(panel);
    }
  }
  // A container started or stopped holding data, or changed its key. The instances it touches are built again:
  // its own, the one that holds it or its elements, and the root's. The root is built again as a whole, not only for
  // the container's elements: a question whose data is the container's scope can be outside the container (a
  // template question moved onto a page), and its value scope follows that scope. A choice panel linked to the
  // survey or dropped calls this too (question_baseselect.ts): its questions are the root's.
  public dataScopeKeysChanged(panel: PanelModelBase): void {
    panel.getDataScope()?.resetDataKeyIndex();
    this.holders.get(panel)?.resetDataKeyIndex();
    getKeyHolderScope(panel.data)?.resetDataKeyIndex();
    this.resetDataKeyIndex();
  }
  // The element and every element inside it: a panel's elements, and a select question's choice panels.
  private forEachInside(el: IElement, callback: (el: ISurveyDataElement) => void): void {
    callback(<ISurveyDataElement><any>el);
    if (el.isQuestion) {
      forEachChoicePanel(el, (panel: IElement): void => this.forEachInside(panel, callback));
      return;
    }
    const elements: Array<IElement> = (<any>el).elements;
    if (Array.isArray(elements)) {
      elements.forEach(inner => this.forEachInside(inner, callback));
    }
  }
  // Whether the root's instance holds an element inside el already.
  private holdsInside(el: IElement): boolean {
    const index = this.builtDataKeyIndex;
    if (!index) return false;
    let res = false;
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      res = res || inner !== <any>el && index.has(inner);
    });
    return res;
  }
  private hasChoicePanels(el: IElement): boolean {
    if (el.isQuestion) {
      let res = false;
      forEachChoicePanel(el, (): void => { res = true; });
      return res;
    }
    const elements: Array<IElement> = (<any>el).elements;
    return Array.isArray(elements) && elements.some(inner => this.hasChoicePanels(inner));
  }
  // A container's key or the survey's dataNesting (no panel) changed: the containers whose key changed
  // re-attach their elements, and the values of the questions follow. The data does not move.
  public dataScopeChanged(panel?: PanelModelBase): void {
    if (!panel) {
      this.updateDataScopeAttachments();
      // The panels inside a record are not attached again (RN3): a records question builds its objects' instances
      // again.
      this.host.getAllQuestions(false, true).forEach(q => (<any>q).resetDataKeyIndexes?.());
      this.resetDataKeyIndex();
    } else {
      this.dataScopeKeysChanged(panel);
    }
    if (!this.isUsedValue || this.host.isLoadingFromJson) return;
    const questions = !!panel ? panel.questions : this.host.getAllQuestions();
    questions.forEach(q => {
      const data = q.getValueScope();
      const valueName = q.getValueName();
      q.updateValueFromSurvey(data.getValue(valueName), false);
      if (q.requireUpdateCommentValue) {
        q.updateCommentFromSurvey(data.getComment(valueName));
      }
    });
  }
  private updateDataScopeAttachments(): void {
    this.forEachPagePanel(panel => panel.updateDataScopeAttachment());
    // Built again after the whole walk: a read while it went down saw a panel deeper in that was not attached yet.
    this.forEachPagePanel(panel => panel.getDataScope()?.resetDataKeyIndex());
  }
  // The pages and every panel inside them, a container before the panels inside it.
  private forEachPagePanel(callback: (panel: PanelModelBase) => void): void {
    const visit = (panel: PanelModelBase): void => {
      callback(panel);
      const elements = panel.elements;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].isPanel) visit(<PanelModelBase><any>elements[i]);
      }
    };
    this.host.pages.forEach(page => visit(page));
  }

  // The active scopes whose object is the top-level key: the root containers with this key.
  public getRootScopes(key: string): Array<PanelDataScope> {
    return this.getDataKeyIndex().getScopes(key);
  }
  public isScopeKey(key: string): boolean {
    return this.getRootScopes(key).length > 0;
  }
  // The scopes whose object is at the data path: [] gives the survey, ["address"] the root containers with
  // the key "address", ["page1", "address"] the containers with the key "address" inside them (each may
  // be more than one).
  public getScopesByPath(path: Array<string>): Array<IDataScope> {
    let res: Array<IDataScope> = [this.host];
    for (let i = 0; i < path.length && res.length > 0; i++) {
      const next: Array<IDataScope> = [];
      res.forEach(scope => next.push(...scope.getDataKeyIndex().getScopes(path[i])));
      res = next;
    }
    return res;
  }
  // The questions that hold the same value as question: its value name in the indexes of the scopes at its
  // value scope's data path (two containers sharing a key share their object). At the root these are
  // the survey's getQuestionsByValueName. A question inside a record is looked up at the root, as one
  // directly in a record always was: its data path starts at the record, not at the survey data.
  public getQuestionsSharingValue(question: Question): Array<Question> {
    const res: Array<Question> = [];
    const path = !getRecordDataScope(question.data) ? question.getValueScope().getDataPath() : [];
    let scopes = this.getScopesByPath(path);
    // A container no index reaches (one taken off its page): its own scope holds the value.
    if (scopes.length === 0) scopes = [question.getValueScope()];
    scopes.forEach(scope => res.push(...scope.getDataKeyIndex().getQuestions(question.getValueName())));
    return res;
  }

  // The question that wrote the key valueName through a data scope: its data path goes below the key.
  // Only then: a top-level writer would change the question onValueChanging reports and which questions
  // sharing a value name are validated.
  public getWriter(valueName: string, question: Question): Question {
    if (!question || !this.isUsedValue) return undefined;
    const path = question.getDataPath();
    return path.length > 1 && path[0] === valueName ? question : undefined;
  }
  // A code write of a key reports the question named like it, unless the key is a container key. The survey finds
  // by a bare name only its own questions (scoped names 05, O1), whose values are keys of the survey data.
  public isCodeWriteQuestionName(name: string): boolean {
    return !this.isUsedValue || !this.isScopeKey(name);
  }

  // The changed keys below a container key, with their old and new values: the value name and the name of
  // each inner question whose value or comment changed (and its comment key), and the key of each inner
  // container whose object changed, so an expression reading {street} re-runs. Empty for a key that is
  // no container key.
  public getChangedKeys(key: string, newValue: any, oldValue: any): HashTable<{ newValue: any, oldValue: any }> {
    const res: HashTable<{ newValue: any, oldValue: any }> = {};
    if (!this.isUsedValue) return res;
    const getMember = (obj: any, name: string): any => asScopeObject(obj)?.[name];
    const add = (name: string, oldVal: any, newVal: any): void => {
      if (!Object.prototype.hasOwnProperty.call(res, name)) res[name] = { newValue: newVal, oldValue: oldVal };
    };
    const isEqual = (x: any, y: any): boolean => Helpers.isTwoValueEquals(x, y, false, true, false);
    const collect = (scope: PanelDataScope, oldObj: any, newObj: any): void => scope.getDataKeyIndex().elements.forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        const oldVal = getMember(oldObj, inner.key);
        const newVal = getMember(newObj, inner.key);
        if (isEqual(oldVal, newVal)) return;
        add(inner.key, oldVal, newVal);
        collect(inner, oldVal, newVal);
        return;
      }
      const q = <Question>el;
      const valueName = q.getValueName();
      const oldVal = getMember(oldObj, valueName);
      const newVal = getMember(newObj, valueName);
      const commentKey = Helpers.getCommentKey(valueName);
      const oldComment = getMember(oldObj, commentKey);
      const newComment = getMember(newObj, commentKey);
      const isCommentChanged = !isEqual(oldComment, newComment);
      if (isEqual(oldVal, newVal) && !isCommentChanged) return;
      add(valueName, oldVal, newVal);
      if (q.name !== valueName) add(q.name, oldVal, newVal);
      if (isCommentChanged) {
        add(commentKey, oldComment, newComment);
        if (q.name !== valueName) add(Helpers.getCommentKey(q.name), oldComment, newComment);
      }
    });
    this.getRootScopes(key).forEach(scope => collect(scope, oldValue, newValue));
    return res;
  }
  // The trigger keys of a question's value: each key of its data path with its value. Not its name: a trigger is
  // the survey's, and the survey does not find an inner question by its name (O3). A key already there stays.
  // belowRoot: only a path that goes below the root, as runTriggers and performNext add (their root keys come
  // from the data and the question's name); returns whether the keys were added.
  public addTriggerKeys(keys: any, question: Question, belowRoot?: boolean): boolean {
    const path = question.getDataPath();
    if (path.length === 0 || belowRoot && path.length < 2) return false;
    const has = (name: string): boolean => Object.prototype.hasOwnProperty.call(keys, name);
    const add = (name: string, val: any): void => {
      if (!has(name)) keys[name] = val;
    };
    // A root key is read once: several questions (and containers) may share it.
    if (!has(path[0])) keys[path[0]] = this.host.getValue(path[0]);
    // Below the root, the stored value (not keys[path[0]]: runTriggers holds the filtered values there).
    let val = this.getStoredValue(path[0]);
    for (let i = 1; i < path.length; i++) {
      val = asScopeObject(val)?.[path[i]];
      add(path[i], val);
    }
    return true;
  }
  // ISurveyTriggerOwner: whether the changed keys are only the ones a write of the question that name resolves
  // to reports (its data path and its name): a setvalue / copyvalue trigger then skips the change of its own
  // target. A top-level question's write reports one key, which the trigger checks itself.
  public isOwnValueKeys(name: string, keys: Array<string>): boolean {
    if (!this.isUsedValue || !name || keys.length === 0) return false;
    const info = new ValueGetter().getValueInfo({ name: name, context: this.host.getValueGetterContext() });
    const q = <Question>info.question;
    const own = !!q ? q.getDataPath() : [];
    if (own.length < 2) return false;
    // Not the comment key: a comment change of the target runs the trigger, as it does for a top-level one.
    own.push(q.name);
    return keys.every(key => own.indexOf(key) > -1);
  }
}
